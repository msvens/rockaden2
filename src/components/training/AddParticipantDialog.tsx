'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/Button'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { addParticipant } from '@/app/(frontend)/training/actions'

interface RatingEntry {
  id: number
  name: string
  rating: number | null
}

interface AddParticipantDialogProps {
  groupId: number
  existingSsfIds: number[]
  onClose: () => void
  onAdded: () => void
}

export function AddParticipantDialog({
  groupId,
  existingSsfIds,
  onClose,
  onAdded,
}: AddParticipantDialogProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [ratingList, setRatingList] = useState<RatingEntry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    async function fetchClubRatings() {
      try {
        const { RatingsService } = await import('@/lib/ssf')
        const service = new RatingsService()
        const response = await service.getCurrentClubRatingList(38464)
        const players = response.data || []
        setRatingList(
          players.map((p) => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            rating: p.lask?.rating ?? null,
          })),
        )
      } catch {
        setRatingList([])
      }
      setLoading(false)
    }
    fetchClubRatings()
  }, [])

  const existingSet = useMemo(() => new Set(existingSsfIds), [existingSsfIds])

  const filtered = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return ratingList
      .filter(
        (entry) =>
          entry.name.toLowerCase().includes(q) && !existingSet.has(entry.id),
      )
      .slice(0, 20)
  }, [search, ratingList, existingSet])

  async function handleAdd(entry: RatingEntry) {
    setAdding(true)
    await addParticipant(groupId, entry.name, entry.id)
    setAdding(false)
    onAdded()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
            {t.training.addParticipant}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.training.search}
          className="w-full px-3 py-2 border rounded-lg mb-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t.common.loading}
            </p>
          ) : filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleAdd(entry)}
                  disabled={adding}
                  className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left disabled:opacity-50"
                >
                  <span className="text-sm text-gray-900 dark:text-gray-200">
                    {entry.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.rating ?? t.training.ratingUnavailable}
                  </span>
                </button>
              ))}
            </div>
          ) : search.trim() ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t.training.noGroups}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="outlined" compact>
            {language === 'sv' ? 'Stäng' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  )
}
