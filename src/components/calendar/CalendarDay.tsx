'use client'

import { type CalendarEvent, categoryColors } from './types'
import { EventPill } from './EventPill'

interface CalendarDayProps {
  day: number
  events: CalendarEvent[]
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  onClick: () => void
  moreLabel: string
}

export function CalendarDay({
  day,
  events,
  isToday,
  isSelected,
  isCurrentMonth,
  onClick,
  moreLabel,
}: CalendarDayProps) {
  const maxVisible = 2
  const overflow = events.length - maxVisible

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative min-h-[3rem] sm:min-h-[5.5rem] p-1 sm:p-1.5 text-left border border-gray-200 dark:border-gray-700
        transition-colors cursor-pointer
        ${isCurrentMonth ? '' : 'opacity-40'}
        ${isSelected ? 'bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-400 dark:ring-amber-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
      `}
    >
      <span
        className={`
          inline-flex items-center justify-center w-6 h-6 text-xs sm:text-sm rounded-full
          ${isToday ? 'bg-amber-500 text-white font-bold' : 'text-gray-700 dark:text-gray-300'}
        `}
      >
        {day}
      </span>

      {/* Desktop: event pills */}
      <div className="hidden sm:flex flex-col gap-0.5 mt-0.5">
        {events.slice(0, maxVisible).map((event) => (
          <EventPill key={event.id} event={event} compact />
        ))}
        {overflow > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 pl-1">
            +{overflow} {moreLabel}
          </span>
        )}
      </div>

      {/* Mobile: colored dots */}
      {events.length > 0 && (
        <div className="flex sm:hidden gap-0.5 mt-0.5 justify-center flex-wrap">
          {events.slice(0, 4).map((event) => (
            <span
              key={event.id}
              className={`w-1.5 h-1.5 rounded-full ${categoryColors[event.category].dot}`}
            />
          ))}
        </div>
      )}
    </button>
  )
}
