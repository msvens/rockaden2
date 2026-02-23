'use client'

import { Card } from '@/components/Card'
import { Link } from '@/components/Link'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'

interface TrainingGroupCardProps {
  id: number
  name: string
  semester?: string | null
  description?: string | null
  participantCount: number
  hasTournament?: boolean | null
}

export function TrainingGroupCard({
  id,
  name,
  semester,
  description,
  participantCount,
  hasTournament,
}: TrainingGroupCardProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <Card hover border>
      <div className="flex items-center gap-2 mb-2">
        {semester && (
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
            {semester}
          </span>
        )}
        {hasTournament && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            {t.training.tournament}
          </span>
        )}
      </div>
      <h3 className="text-lg font-light tracking-wide mb-2 text-gray-900 dark:text-gray-200">
        <Link href={`/training/${id}`} color="inherit" underline="hover">
          {name}
        </Link>
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {participantCount} {t.training.participants.toLowerCase()}
      </div>
    </Card>
  )
}
