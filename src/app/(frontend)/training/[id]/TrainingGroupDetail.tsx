'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/components/Link'
import { Button } from '@/components/Button'
import { PageTitle } from '@/components/PageTitle'
import { ParticipantList } from '@/components/training/ParticipantList'
import { AddParticipantDialog } from '@/components/training/AddParticipantDialog'
import { SessionTimeline } from '@/components/training/SessionTimeline'
import { StandingsTable } from '@/components/training/StandingsTable'
import { useLanguage } from '@/context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { computeStandings, type GameResult } from '@/lib/roundRobin'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface Participant {
  id?: string | null
  name: string
  ssfId: number
  active?: boolean | null
}

interface SessionDoc {
  id: number
  sessionDate: string
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

interface GroupDoc {
  id: number
  name: string
  semester?: string | null
  description?: string | null
  hasTournament?: boolean | null
  participants?: Participant[] | null
}

interface TrainingGroupDetailProps {
  group: GroupDoc
  sessions: SessionDoc[]
  scheduleDates: string[]
}

type Tab = 'participants' | 'sessions' | 'standings'

export function TrainingGroupDetail({
  group,
  sessions,
  scheduleDates,
}: TrainingGroupDetailProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const { isEditor } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('participants')
  const [showAddDialog, setShowAddDialog] = useState(false)

  const participants = group.participants || []
  const activeParticipants = participants.filter((p) => p.active !== false)

  // Build session date info for timeline
  // Merge schedule dates with any existing sessions (e.g. seeded past sessions)
  const sessionDates = useMemo(() => {
    // Payload date fields return full ISO timestamps that may be timezone-shifted
    // (e.g. "2026-02-02T23:00:00.000Z" for a Feb 3 CET date). Parse and extract
    // local date to match schedule dates which also use local time.
    const toDateKey = (d: string) => {
      if (d.length === 10) return d
      const dt = new Date(d)
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    }

    const sessionMap = new Map(
      sessions.map((s) => [toDateKey(s.sessionDate), s]),
    )

    // Start with schedule dates
    const dateSet = new Set(scheduleDates)

    // Add dates from existing sessions that aren't in the schedule
    for (const s of sessions) {
      dateSet.add(toDateKey(s.sessionDate))
    }

    // Sort all dates
    const allDates = Array.from(dateSet).sort()

    return allDates.map((date) => {
      const session = sessionMap.get(date)
      return {
        date,
        hasSession: !!session,
        sessionId: session?.id,
        attendanceCount: session?.attendance?.filter((a) => a.present).length ?? 0,
      }
    })
  }, [sessions, scheduleDates])

  // Compute standings from all game results across sessions
  const standings = useMemo(() => {
    if (!group.hasTournament) return []

    const participantIds = activeParticipants
      .map((p) => p.id)
      .filter((id): id is string => !!id)

    const allGames: GameResult[] = sessions.flatMap(
      (s) =>
        (s.games || []).map((g) => ({
          whiteId: g.whiteId,
          blackId: g.blackId,
          result: (g.result as GameResult['result']) ?? null,
        })),
    )

    return computeStandings(participantIds, allGames)
  }, [group.hasTournament, activeParticipants, sessions])

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'participants', label: t.training.participants, show: true },
    { key: 'sessions', label: t.training.sessions, show: true },
    { key: 'standings', label: t.training.standings, show: !!group.hasTournament },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/training" color="gray" className="text-sm mb-6 inline-block">
        &larr; {t.training.backToList}
      </Link>

      <PageTitle
        title={group.name}
        subtitle={
          [group.semester, group.description].filter(Boolean).join(' — ') || undefined
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Tab content */}
      {activeTab === 'participants' && (
        <div>
          {isEditor && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setShowAddDialog(true)}
                variant="contained"
                color="primary"
                compact
              >
                {t.training.addParticipant}
              </Button>
            </div>
          )}
          <ParticipantList
            groupId={group.id}
            participants={participants}
            isEditor={isEditor}
            onParticipantChange={() => router.refresh()}
          />
          {showAddDialog && (
            <AddParticipantDialog
              groupId={group.id}
              existingSsfIds={participants.map((p) => p.ssfId)}
              onClose={() => setShowAddDialog(false)}
              onAdded={() => {
                setShowAddDialog(false)
                router.refresh()
              }}
            />
          )}
        </div>
      )}

      {activeTab === 'sessions' && (
        <SessionTimeline groupId={group.id} sessionDates={sessionDates} isEditor={isEditor} />
      )}

      {activeTab === 'standings' && group.hasTournament && (
        <StandingsTable standings={standings} participants={activeParticipants} />
      )}
    </div>
  )
}
