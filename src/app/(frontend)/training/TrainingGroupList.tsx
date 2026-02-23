'use client'

import { PageTitle } from '@/components/PageTitle'
import { TrainingGroupCard } from '@/components/training/TrainingGroupCard'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'

interface GroupDoc {
  id: number
  name: string
  semester?: string | null
  description?: string | null
  hasTournament?: boolean | null
  participants?: { active?: boolean | null }[] | null
}

interface TrainingGroupListProps {
  groups: GroupDoc[]
}

export function TrainingGroupList({ groups }: TrainingGroupListProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageTitle title={t.training.title} subtitle={t.training.subtitle} />

      {groups.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{t.training.noGroups}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <TrainingGroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              semester={group.semester}
              description={group.description}
              participantCount={
                group.participants?.filter((p) => p.active !== false).length ?? 0
              }
              hasTournament={group.hasTournament}
            />
          ))}
        </div>
      )}
    </div>
  )
}
