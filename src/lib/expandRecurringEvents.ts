import type { CalendarEvent, EventCategory } from '@/components/calendar/types'

interface EventDoc {
  id: number | string
  title: string
  startDate: string
  endDate: string
  description?: string | null
  location?: string | null
  category?: string | null
  isRecurring?: boolean | null
  recurrenceType?: 'weekly' | 'biweekly' | null
  recurrenceEndDate?: string | null
  excludedDates?: string[] | null
}

function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function expandRecurringEvents(docs: EventDoc[]): CalendarEvent[] {
  const result: CalendarEvent[] = []

  for (const doc of docs) {
    const id = String(doc.id)
    const base: Omit<CalendarEvent, 'id' | 'startDate' | 'endDate' | 'parentId'> = {
      title: doc.title,
      description: doc.description ?? undefined,
      location: doc.location ?? undefined,
      category: (doc.category as EventCategory) || 'other',
      source: 'cms',
    }

    if (!doc.isRecurring || !doc.recurrenceType || !doc.recurrenceEndDate) {
      result.push({
        ...base,
        id,
        startDate: doc.startDate,
        endDate: doc.endDate,
      })
      continue
    }

    const start = new Date(doc.startDate)
    const end = new Date(doc.endDate)
    const durationMs = end.getTime() - start.getTime()
    const seriesEnd = new Date(doc.recurrenceEndDate)
    const stepDays = doc.recurrenceType === 'biweekly' ? 14 : 7
    const excluded = new Set((doc.excludedDates ?? []).map((d) => d))

    const current = new Date(start)
    while (current <= seriesEnd) {
      const dateKey = toDateKey(current)
      if (!excluded.has(dateKey)) {
        const occurrenceStart = new Date(current)
        const occurrenceEnd = new Date(current.getTime() + durationMs)
        result.push({
          ...base,
          id: `${id}-${dateKey}`,
          parentId: id,
          startDate: occurrenceStart.toISOString(),
          endDate: occurrenceEnd.toISOString(),
        })
      }
      current.setDate(current.getDate() + stepDays)
    }
  }

  return result
}
