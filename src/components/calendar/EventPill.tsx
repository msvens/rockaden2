'use client'

import { type CalendarEvent, categoryColors } from './types'

interface EventPillProps {
  event: CalendarEvent
  compact?: boolean
}

export function EventPill({ event, compact }: EventPillProps) {
  const colors = categoryColors[event.category]
  const time = new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (compact) {
    return (
      <div className={`${colors.bg} ${colors.text} rounded px-1.5 py-0.5 text-xs truncate`}>
        {event.title}
      </div>
    )
  }

  return (
    <div className={`${colors.bg} ${colors.text} rounded px-2 py-1 text-sm`}>
      <span className="font-medium">{time}</span>
      <span className="mx-1">·</span>
      <span className="truncate">{event.title}</span>
    </div>
  )
}
