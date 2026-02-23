export type EventCategory = 'training' | 'tournament' | 'junior' | 'allsvenskan' | 'skolschack' | 'other'

export interface CalendarEvent {
  id: string
  title: string
  startDate: string
  endDate: string
  description?: string
  location?: string
  category: EventCategory
  source: 'cms' | 'ssf'
  parentId?: string
  link?: string
  linkLabel?: string
}

export const categoryColors: Record<EventCategory, { bg: string; text: string; dot: string }> = {
  training: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-200', dot: 'bg-blue-500' },
  tournament: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-500' },
  junior: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500' },
  allsvenskan: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-800 dark:text-purple-200', dot: 'bg-purple-500' },
  skolschack: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-200', dot: 'bg-orange-500' },
  other: { bg: 'bg-gray-100 dark:bg-gray-800/40', text: 'text-gray-800 dark:text-gray-200', dot: 'bg-gray-500' },
}
