import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { SessionDetail } from './SessionDetail'
import { generateRoundRobin } from '@/lib/roundRobin'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string; date: string }>
}

export default async function SessionPage({ params }: Props) {
  const { id, date } = await params
  const groupId = Number(id)
  if (isNaN(groupId)) notFound()

  const payload = await getPayloadClient()

  const group = await payload.findByID({
    collection: 'training-groups',
    id: groupId,
    depth: 2,
  }).catch(() => null)

  if (!group) notFound()

  // Payload date fields store full ISO timestamps that may be timezone-shifted.
  // Fetch all sessions and compare normalized local dates.
  const toDateKey = (d: string) => {
    if (d.length === 10) return d
    const dt = new Date(d)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  }

  const allSessionsResult = await payload.find({
    collection: 'training-sessions',
    where: {
      group: { equals: groupId },
    },
    sort: 'sessionDate',
    limit: 100,
  })

  let session = allSessionsResult.docs.find((s) => toDateKey(s.sessionDate) === date)

  if (!session) {
    // Auto-create session for this date
    session = await payload.create({
      collection: 'training-sessions',
      data: {
        group: groupId,
        sessionDate: date,
      },
    })
    // Insert into sorted list for round number calculation
    allSessionsResult.docs.push(session)
    allSessionsResult.docs.sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
  }

  const sessionIndex = allSessionsResult.docs.findIndex((s) => s.id === session!.id)
  const roundNumber = sessionIndex + 1

  // Generate round-robin pairings if tournament enabled
  let roundPairings: ReturnType<typeof generateRoundRobin>[number] | null = null
  if (group.hasTournament) {
    const activeParticipants = (group.participants || []).filter(
      (p) => p.active !== false && p.id,
    )
    const ids = activeParticipants.map((p) => p.id!)
    const rounds = generateRoundRobin(ids)
    roundPairings = rounds[roundNumber - 1] ?? null
  }

  return (
    <SessionDetail
      groupId={groupId}
      groupName={group.name}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session={session as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      participants={(group.participants || []) as any[]}
      date={date}
      roundNumber={roundNumber}
      roundPairings={roundPairings}
      hasTournament={group.hasTournament ?? false}
    />
  )
}
