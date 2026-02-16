import { getPayloadClient } from '@/lib/payload';
import { notFound } from 'next/navigation';
import { NewsDetailContent, type NewsArticle } from './NewsDetailContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const article = result.docs[0] as unknown as NewsArticle | undefined;
  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} - SK Rockaden`,
    description: article.excerpt || undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const article = result.docs[0] as unknown as NewsArticle | undefined;
  if (!article) notFound();

  return <NewsDetailContent article={article} />;
}
