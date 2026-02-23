'use client'

import { useState, useMemo, useCallback } from 'react'
import type { CalendarEvent } from './types'
import type { Translations } from '@/lib/translations'
import { CalendarHeader } from './CalendarHeader'
import { CalendarDay } from './CalendarDay'
import { DayDetail } from './DayDetail'

interface CalendarMonthProps {
  events: CalendarEvent[]
  isEditor?: boolean
  translations: Translations['calendar']
  locale?: string
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  // 0 = Sunday in JS, convert to Monday-based (0 = Monday)
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function CalendarMonth({ events, isEditor = false, translations, locale = 'sv' }: CalendarMonthProps) {
  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth)

  // Previous month's trailing days
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  const dayNames = [
    translations.days.mon,
    translations.days.tue,
    translations.days.wed,
    translations.days.thu,
    translations.days.fri,
    translations.days.sat,
    translations.days.sun,
  ]

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {}
    for (const event of events) {
      const start = new Date(event.startDate)
      if (start.getMonth() === currentMonth && start.getFullYear() === currentYear) {
        const day = start.getDate()
        if (!map[day]) map[day] = []
        map[day].push(event)
      }
    }
    // Sort events within each day by start time
    for (const day in map) {
      map[day].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    }
    return map
  }, [events, currentMonth, currentYear])

  const goToPrevMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }, [currentMonth, currentYear])

  const goToNextMonth = useCallback(() => {
    setSelectedDay(null)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }, [currentMonth, currentYear])

  const goToToday = useCallback(() => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDay(today.getDate())
  }, [today])

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

  // Build grid cells: prev month trailing + current month + next month leading
  const cells: { day: number; isCurrentMonth: boolean }[] = []

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true })
  }
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, isCurrentMonth: false })
    }
  }

  return (
    <div>
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        todayLabel={translations.today}
        locale={locale}
      />

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => (
          <CalendarDay
            key={idx}
            day={cell.day}
            events={cell.isCurrentMonth ? (eventsByDay[cell.day] || []) : []}
            isToday={cell.isCurrentMonth && isToday(cell.day)}
            isSelected={cell.isCurrentMonth && selectedDay === cell.day}
            isCurrentMonth={cell.isCurrentMonth}
            onClick={() => {
              if (cell.isCurrentMonth) {
                setSelectedDay(selectedDay === cell.day ? null : cell.day)
              }
            }}
            moreLabel={translations.moreEvents}
          />
        ))}
      </div>

      {/* Day detail panel */}
      {selectedDay !== null && (
        <div className="mt-4">
          <DayDetail
            day={selectedDay}
            month={currentMonth}
            year={currentYear}
            events={eventsByDay[selectedDay] || []}
            isEditor={isEditor}
            translations={translations}
            locale={locale}
          />
        </div>
      )}
    </div>
  )
}
