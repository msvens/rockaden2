'use client'

import { useState } from 'react'
import { Link } from '@/components/Link'
import { Button } from '@/components/Button'
import { AttendanceForm } from '@/components/training/AttendanceForm'
import { PairingsPanel } from '@/components/training/PairingsPanel'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { useAuth } from '@/hooks/useAuth'
import { updateSessionNotes } from '@/app/(frontend)/training/actions'
import { useRouter } from 'next/navigation'
import type { Round } from '@/lib/roundRobin'

interface Participant {
  id?: string | null
  name: string
  ssfId: number
  active?: boolean | null
}

interface SessionDoc {
  id: number
  sessionDate: string
  notes?: string | null
  attendance?: { participantId: string; present?: boolean | null }[] | null
  games?:
    | {
        round: number
        whiteId: string
        blackId: string
        result?: string | null
      }[]
    | null
}

interface SessionDetailProps {
  groupId: number
  groupName: string
  session: SessionDoc
  participants: Participant[]
  date: string
  roundNumber: number
  roundPairings: Round | null
  hasTournament: boolean
}

export function SessionDetail({
  groupId,
  groupName,
  session,
  participants,
  date,
  roundNumber,
  roundPairings,
  hasTournament,
}: SessionDetailProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const { isEditor } = useAuth()
  const router = useRouter()
  const [notes, setNotes] = useState(session.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)

  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString(
    language === 'sv' ? 'sv-SE' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  )

  async function handleSaveNotes() {
    setSavingNotes(true)
    await updateSessionNotes(session.id, notes)
    setSavingNotes(false)
  }

  // Build games array for this round if tournament and no games exist yet
  const games = session.games || []
  const roundGames =
    hasTournament && roundPairings && games.length === 0
      ? roundPairings.pairings.map((p) => ({
          round: roundNumber,
          whiteId: p.whiteId,
          blackId: p.blackId,
          result: null as string | null,
        }))
      : games

  const nameMap = new Map(
    participants.filter((p) => p.id).map((p) => [p.id!, p.name]),
  )

  const attendanceRecords = (session.attendance || []).map((a) => ({
    participantId: a.participantId,
    present: a.present ?? false,
  }))

  const presentCount = attendanceRecords.filter((a) => a.present).length
  const activeParticipants = participants.filter((p) => p.active !== false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href={`/training/${groupId}`}
        color="gray"
        className="text-sm mb-6 inline-block"
      >
        &larr; {t.training.backToGroup}
      </Link>

      <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-900 dark:text-gray-200">
        {groupName}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 capitalize">{formattedDate}</p>

      {/* Attendance */}
      <section className="mb-8">
        <h2 className="text-xl font-light tracking-wide mb-4 text-gray-900 dark:text-gray-200">
          {t.training.attendance}
        </h2>
        {isEditor ? (
          <AttendanceForm
            sessionId={session.id}
            participants={participants}
            initialAttendance={attendanceRecords}
            onSaved={() => router.refresh()}
          />
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {presentCount}/{activeParticipants.length} {t.training.present.toLowerCase()}
            {attendanceRecords.length > 0 && (
              <ul className="mt-2 space-y-1">
                {attendanceRecords
                  .filter((a) => a.present)
                  .map((a) => (
                    <li key={a.participantId}>
                      {nameMap.get(a.participantId) || a.participantId}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Pairings */}
      {hasTournament && roundPairings && (
        <section className="mb-8">
          <h2 className="text-xl font-light tracking-wide mb-4 text-gray-900 dark:text-gray-200">
            {t.training.pairings}
          </h2>
          {isEditor ? (
            <PairingsPanel
              sessionId={session.id}
              games={roundGames.map((g) => ({
                round: g.round ?? roundNumber,
                whiteId: g.whiteId,
                blackId: g.blackId,
                result: (g.result as '1-0' | '0.5-0.5' | '0-1' | 'bye-white' | 'bye-black' | null) ?? null,
              }))}
              participants={participants}
              roundNumber={roundNumber}
              bye={roundPairings.bye}
              onSaved={() => router.refresh()}
            />
          ) : (
            <div className="space-y-2">
              {roundGames
                .filter((g) => (g.round ?? roundNumber) === roundNumber)
                .map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 px-3 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-sm text-gray-900 dark:text-gray-200 flex-1 text-right">
                      {nameMap.get(g.whiteId) || g.whiteId}
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-2">
                      {g.result || t.training.notPlayed}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-200 flex-1">
                      {nameMap.get(g.blackId) || g.blackId}
                    </span>
                  </div>
                ))}
              {roundPairings.bye && (
                <div className="flex items-center gap-3 py-2 px-3 rounded bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {nameMap.get(roundPairings.bye) || roundPairings.bye} — {t.training.bye}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Notes */}
      <section>
        <h2 className="text-xl font-light tracking-wide mb-4 text-gray-900 dark:text-gray-200">
          {t.training.notes}
        </h2>
        {isEditor ? (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              placeholder={t.training.notes}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSaveNotes}
                variant="outlined"
                compact
                disabled={savingNotes}
              >
                {t.training.saveNotes}
              </Button>
            </div>
          </>
        ) : notes ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{notes}</p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">—</p>
        )}
      </section>
    </div>
  )
}
