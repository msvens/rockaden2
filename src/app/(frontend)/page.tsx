import { getPayloadClient } from '@/lib/payload';
import { HomeContent } from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const payload = await getPayloadClient();

  const newsResult = await payload.find({
    collection: 'news',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <HomeContent recentNews={newsResult.docs as any[]} />;
}
