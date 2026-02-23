import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import { TrainingGroupDetail } from './TrainingGroupDetail'
import { expandRecurringEvents } from '@/lib/expandRecurringEvents'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TrainingGroupPage({ params }: Props) {
  const { id } = await params
  const groupId = Number(id)
  if (isNaN(groupId)) notFound()

  const payload = await getPayloadClient()

  const group = await payload.findByID({
    collection: 'training-groups',
    id: groupId,
    depth: 2,
  }).catch(() => null)

  if (!group) notFound()

  // Get all sessions for this group
  const sessionsResult = await payload.find({
    collection: 'training-sessions',
    where: {
      group: { equals: groupId },
    },
    sort: 'sessionDate',
    limit: 100,
  })

  // Expand event schedule to get session dates
  let scheduleDates: string[] = []
  if (group.event && typeof group.event === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expanded = expandRecurringEvents([group.event as any])
    scheduleDates = expanded.map((e) => {
      const d = new Date(e.startDate)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
  }

  return (
    <TrainingGroupDetail
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      group={group as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sessions={sessionsResult.docs as any[]}
      scheduleDates={scheduleDates}
    />
  )
}
