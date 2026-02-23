'use client'

import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import type { StandingRow } from '@/lib/roundRobin'

interface Participant {
  id?: string | null
  name: string
}

interface StandingsTableProps {
  standings: StandingRow[]
  participants: Participant[]
}

export function StandingsTable({ standings, participants }: StandingsTableProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const nameMap = new Map(participants.map((p) => [p.id, p.name]))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400 w-8">
              {t.training.rank}
            </th>
            <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">
              {t.training.name}
            </th>
            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400 w-12">
              {t.training.played}
            </th>
            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400 w-10">
              {t.training.wins}
            </th>
            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400 w-10">
              {t.training.draws}
            </th>
            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400 w-10">
              {t.training.losses}
            </th>
            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400 w-14">
              {t.training.points}
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr
              key={row.participantId}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="py-2 text-gray-500 dark:text-gray-400">{i + 1}</td>
              <td className="py-2 text-gray-900 dark:text-gray-200">
                {nameMap.get(row.participantId) || row.participantId}
              </td>
              <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                {row.played}
              </td>
              <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                {row.wins}
              </td>
              <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                {row.draws}
              </td>
              <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                {row.losses}
              </td>
              <td className="py-2 text-center font-medium text-gray-900 dark:text-gray-200">
                {row.points % 1 === 0 ? row.points : row.points.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
