'use client'

import Link from 'next/link'
import { type CalendarEvent, categoryColors } from './types'
import type { Translations } from '@/lib/translations'

interface DayDetailProps {
  day: number
  month: number
  year: number
  events: CalendarEvent[]
  isEditor: boolean
  translations: Translations['calendar']
  locale: string
}

export function DayDetail({ day, month, year, events, isEditor, translations, locale }: DayDetailProps) {
  const dateStr = new Date(year, month, day).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
          {dateStr}
        </h3>
        {isEditor && (
          <Link
            href="/admin/collections/events/create"
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            + {translations.addEvent}
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{translations.noEvents}</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const colors = categoryColors[event.category]
            const startTime = new Date(event.startDate).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })
            const endTime = new Date(event.endDate).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={event.id}
                className={`${colors.bg} rounded-lg p-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`font-medium ${colors.text}`}>{event.title}</p>
                    <p className={`text-sm ${colors.text} opacity-80`}>
                      {translations.time}: {startTime} – {endTime}
                    </p>
                    {event.location && (
                      <p className={`text-sm ${colors.text} opacity-80`}>
                        {translations.location}: {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className={`text-sm ${colors.text} opacity-70 mt-1`}>
                        {event.description}
                      </p>
                    )}
                  </div>
                  {isEditor && (
                    <Link
                      href={`/admin/collections/events/${event.parentId || event.id}`}
                      className={`shrink-0 ${colors.text} opacity-60 hover:opacity-100`}
                      title={translations.editEvent}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>
                  )}
                </div>
                <div className="mt-1">
                  <span className={`text-xs ${colors.text} opacity-60`}>
                    {translations.eventCategories[event.category]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
