import { getPayloadClient } from '@/lib/payload'
import { CalendarContent } from './CalendarContent'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const payload = await getPayloadClient()

  const eventsResult = await payload.find({
    collection: 'events',
    where: {
      status: { equals: 'published' },
    },
    sort: 'startDate',
    limit: 200,
  })

  return (
    <CalendarContent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events={eventsResult.docs as any[]}
    />
  )
}
