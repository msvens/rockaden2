'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { GameResultInput } from './GameResultInput'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { updateGameResult } from '@/app/(frontend)/training/actions'

type ResultValue = '1-0' | '0.5-0.5' | '0-1' | 'bye-white' | 'bye-black' | null

interface Game {
  round: number
  whiteId: string
  blackId: string
  result?: ResultValue
}

interface Participant {
  id?: string | null
  name: string
}

interface PairingsPanelProps {
  sessionId: number
  games: Game[]
  participants: Participant[]
  roundNumber: number
  bye?: string
  onSaved?: () => void
}

export function PairingsPanel({
  sessionId,
  games,
  participants,
  roundNumber,
  bye,
  onSaved,
}: PairingsPanelProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [results, setResults] = useState<Map<number, ResultValue>>(() => {
    const map = new Map<number, ResultValue>()
    games.forEach((g, i) => map.set(i, g.result ?? null))
    return map
  })
  const [saving, setSaving] = useState(false)

  const nameMap = new Map(participants.map((p) => [p.id, p.name]))

  function handleResultChange(index: number, result: ResultValue) {
    setResults((prev) => {
      const next = new Map(prev)
      next.set(index, result)
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    for (const [index, result] of results.entries()) {
      const game = games[index]
      if (game && (game.result ?? null) !== result) {
        await updateGameResult(sessionId, index, result)
      }
    }
    setSaving(false)
    onSaved?.()
  }

  const roundGames = games.filter((g) => g.round === roundNumber)

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t.training.round} {roundNumber}
      </h4>

      <div className="space-y-2 mb-4">
        {roundGames.map((game, i) => {
          const globalIndex = games.findIndex(
            (g) => g.whiteId === game.whiteId && g.blackId === game.blackId && g.round === game.round,
          )
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm text-gray-900 dark:text-gray-200 flex-1 text-right">
                {nameMap.get(game.whiteId) || game.whiteId}
              </span>
              <GameResultInput
                value={results.get(globalIndex) ?? null}
                onChange={(result) => handleResultChange(globalIndex, result)}
              />
              <span className="text-sm text-gray-900 dark:text-gray-200 flex-1">
                {nameMap.get(game.blackId) || game.blackId}
              </span>
            </div>
          )
        })}

        {bye && (
          <div className="flex items-center gap-3 py-2 px-3 rounded bg-gray-50 dark:bg-gray-800/50">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nameMap.get(bye) || bye} — {t.training.bye}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} variant="contained" color="primary" compact disabled={saving}>
          {t.training.saveResults}
        </Button>
      </div>
    </div>
  )
}
