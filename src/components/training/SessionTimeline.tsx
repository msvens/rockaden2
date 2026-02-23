'use client'

import { useMemo } from 'react'
import { Link } from '@/components/Link'
import { Button } from '@/components/Button'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { createSession } from '@/app/(frontend)/training/actions'
import { useRouter } from 'next/navigation'

interface SessionDate {
  date: string // YYYY-MM-DD
  hasSession: boolean
  sessionId?: number
  attendanceCount?: number
}

interface SessionTimelineProps {
  groupId: number
  sessionDates: SessionDate[]
  isEditor?: boolean
}

export function SessionTimeline({ groupId, sessionDates, isEditor }: SessionTimelineProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const router = useRouter()

  const today = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  async function handleStartSession(date: string) {
    await createSession(groupId, date)
    router.push(`/training/${groupId}/session/${date}`)
  }

  const pastDates = sessionDates.filter((s) => s.date < today)
  const todayDates = sessionDates.filter((s) => s.date === today)
  const futureDates = sessionDates.filter((s) => s.date > today)

  function renderDate(s: SessionDate, variant: 'past' | 'today' | 'future') {
    const isPast = variant === 'past'
    const isToday = variant === 'today'
    return (
      <div
        key={s.date}
        className={`flex items-center justify-between py-2 px-3 rounded ${
          isPast
            ? 'bg-gray-50 dark:bg-gray-800/50'
            : isToday
              ? 'border-2 border-blue-400 dark:border-blue-600'
              : 'border border-gray-200 dark:border-gray-700'
        }`}
      >
        <span className={`text-sm ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {new Date(s.date + 'T12:00:00').toLocaleDateString(
            language === 'sv' ? 'sv-SE' : 'en-US',
            { weekday: 'short', month: 'short', day: 'numeric' },
          )}
        </span>
        {s.hasSession ? (
          <Link href={`/training/${groupId}/session/${s.date}`} color="blue" className="text-sm">
            {t.training.attendance} ({s.attendanceCount ?? 0})
          </Link>
        ) : isEditor ? (
          <Button
            onClick={() => handleStartSession(s.date)}
            variant={isPast ? 'text' : 'outlined'}
            compact
            color="primary"
          >
            {t.training.startSession}
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {pastDates.map((s) => renderDate(s, 'past'))}
      {todayDates.map((s) => renderDate(s, 'today'))}
      {futureDates.map((s) => renderDate(s, 'future'))}
    </div>
  )
}
