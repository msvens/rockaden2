import { getPayloadClient } from '@/lib/payload'
import { TrainingGroupList } from './TrainingGroupList'

export const dynamic = 'force-dynamic'

export default async function TrainingPage() {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'training-groups',
    where: {
      status: { equals: 'active' },
    },
    sort: '-createdAt',
    limit: 50,
  })

  return (
    <TrainingGroupList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groups={result.docs as any[]}
    />
  )
}
