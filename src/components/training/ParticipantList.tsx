'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { removeParticipant } from '@/app/(frontend)/training/actions'

interface Participant {
  id?: string | null
  name: string
  ssfId: number
  active?: boolean | null
}

interface ParticipantListProps {
  groupId: number
  participants: Participant[]
  isEditor?: boolean
  onParticipantChange?: () => void
}

export function ParticipantList({ groupId, participants, isEditor, onParticipantChange }: ParticipantListProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [ratings, setRatings] = useState<Map<number, number | null>>(new Map())

  useEffect(() => {
    async function fetchRatings() {
      try {
        const { RatingsService } = await import('@/lib/ssf')
        const service = new RatingsService()
        const response = await service.getCurrentClubRatingList(38464)
        const players = response.data || []
        const map = new Map<number, number | null>()
        for (const p of players) {
          map.set(p.id, p.lask?.rating ?? null)
        }
        setRatings(map)
      } catch {
        // SSF API unavailable — ratings will show as N/A
      }
    }
    fetchRatings()
  }, [])

  const activeParticipants = participants.filter((p) => p.active !== false)
  const inactiveParticipants = participants.filter((p) => p.active === false)

  async function handleRemove(participantId: string) {
    await removeParticipant(groupId, participantId)
    onParticipantChange?.()
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">{t.training.name}</th>
            <th className="text-right py-2 font-medium text-gray-500 dark:text-gray-400">{t.training.rating}</th>
            {isEditor && <th className="text-right py-2 font-medium text-gray-500 dark:text-gray-400"></th>}
          </tr>
        </thead>
        <tbody>
          {activeParticipants.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 text-gray-900 dark:text-gray-200">{p.name}</td>
              <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                {ratings.get(p.ssfId) ?? t.training.ratingUnavailable}
              </td>
              {isEditor && (
                <td className="py-2 text-right">
                  <button
                    onClick={() => p.id && handleRemove(p.id)}
                    className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    {t.training.removeParticipant}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {inactiveParticipants.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
            {t.training.inactive} ({inactiveParticipants.length})
          </summary>
          <div className="mt-2 space-y-1">
            {inactiveParticipants.map((p) => (
              <div key={p.id} className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {p.name}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
