'use client'

interface CalendarHeaderProps {
  month: number
  year: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  todayLabel: string
  locale?: string
}

export function CalendarHeader({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
  todayLabel,
  locale = 'sv',
}: CalendarHeaderProps) {
  const monthName = new Date(year, month).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 capitalize min-w-[12rem] text-center">
          {monthName}
        </h2>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {todayLabel}
        </button>
        {/* Placeholder for future view switcher */}
      </div>
    </div>
  )
}
