import { getPayloadClient } from '@/lib/payload';
import { notFound } from 'next/navigation';
import { PageContent } from './PageContent';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = result.docs[0] as any;
  if (!page) return { title: 'Not Found' };

  return {
    title: `${page.title} - SK Rockaden`,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = result.docs[0] as any;
  if (!page) notFound();

  return <PageContent page={page} />;
}
