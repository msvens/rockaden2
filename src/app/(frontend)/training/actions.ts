'use server'

import { getPayloadClient } from '@/lib/payload'

export async function addParticipant(groupId: number, name: string, ssfId: number) {
  const payload = await getPayloadClient()

  const group = await payload.findByID({
    collection: 'training-groups',
    id: groupId,
  })

  const participants = group.participants || []

  // Check if already added
  const existing = participants.find((p) => p.ssfId === ssfId)
  if (existing) {
    // If inactive, reactivate
    if (!existing.active) {
      const updated = participants.map((p) =>
        p.ssfId === ssfId ? { ...p, active: true } : p,
      )
      await payload.update({
        collection: 'training-groups',
        id: groupId,
        data: { participants: updated },
      })
    }
    return
  }

  await payload.update({
    collection: 'training-groups',
    id: groupId,
    data: {
      participants: [...participants, { name, ssfId, active: true }],
    },
  })
}

export async function removeParticipant(groupId: number, participantId: string) {
  const payload = await getPayloadClient()

  const group = await payload.findByID({
    collection: 'training-groups',
    id: groupId,
  })

  const participants = (group.participants || []).map((p) =>
    p.id === participantId ? { ...p, active: false } : p,
  )

  await payload.update({
    collection: 'training-groups',
    id: groupId,
    data: { participants },
  })
}

export async function createSession(groupId: number, sessionDate: string) {
  const payload = await getPayloadClient()

  // Payload date fields store full ISO timestamps that may be timezone-shifted.
  // Fetch all sessions for the group and compare normalized local dates.
  const toDateKey = (d: string) => {
    if (d.length === 10) return d
    const dt = new Date(d)
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  }

  const existing = await payload.find({
    collection: 'training-sessions',
    where: {
      group: { equals: groupId },
    },
    limit: 100,
  })

  const match = existing.docs.find((s) => toDateKey(s.sessionDate) === sessionDate)
  if (match) return match

  const session = await payload.create({
    collection: 'training-sessions',
    data: {
      group: groupId,
      sessionDate,
    },
  })

  return session
}

export async function updateAttendance(
  sessionId: number,
  attendance: { participantId: string; present: boolean }[],
) {
  const payload = await getPayloadClient()

  await payload.update({
    collection: 'training-sessions',
    id: sessionId,
    data: { attendance },
  })
}

export async function updateGameResult(
  sessionId: number,
  gameIndex: number,
  result: '1-0' | '0.5-0.5' | '0-1' | 'bye-white' | 'bye-black' | null,
) {
  const payload = await getPayloadClient()

  const session = await payload.findByID({
    collection: 'training-sessions',
    id: sessionId,
  })

  const games = [...(session.games || [])]
  if (games[gameIndex]) {
    games[gameIndex] = { ...games[gameIndex], result: result ?? undefined }
  }

  await payload.update({
    collection: 'training-sessions',
    id: sessionId,
    data: { games },
  })
}

export async function updateSessionNotes(sessionId: number, notes: string) {
  const payload = await getPayloadClient()

  await payload.update({
    collection: 'training-sessions',
    id: sessionId,
    data: { notes },
  })
}
