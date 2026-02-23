'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { useAuth } from '@/hooks/useAuth'
import { CalendarMonth, categoryColors } from '@/components/calendar'
import { PageTitle } from '@/components/PageTitle'
import { expandRecurringEvents } from '@/lib/expandRecurringEvents'
import type { EventCategory } from '@/components/calendar'

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

interface CalendarContentProps {
  events: EventDoc[]
}

const categoryOrder: EventCategory[] = ['training', 'tournament', 'junior', 'allsvenskan', 'skolschack', 'other']

export function CalendarContent({ events }: CalendarContentProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const { isEditor } = useAuth()

  const calendarEvents = useMemo(() => expandRecurringEvents(events), [events])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageTitle title={t.calendar.title} subtitle={t.calendar.subtitle} />

      {/* Category legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categoryOrder.map((cat) => {
          const colors = categoryColors[cat]
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t.calendar.eventCategories[cat]}
              </span>
            </div>
          )
        })}
      </div>

      <CalendarMonth
        events={calendarEvents}
        isEditor={isEditor}
        translations={t.calendar}
        locale={language}
      />
    </div>
  )
}
