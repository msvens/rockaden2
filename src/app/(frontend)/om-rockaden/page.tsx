import { getPayloadClient } from '@/lib/payload';
import { AboutContent } from './AboutContent';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'om-rockaden' } },
    limit: 1,
    depth: 2,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = (result.docs[0] as any) || null;

  return <AboutContent page={page} />;
}
