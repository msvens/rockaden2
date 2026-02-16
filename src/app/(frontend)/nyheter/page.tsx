import { getPayloadClient } from '@/lib/payload';
import { NewsListContent } from './NewsListContent';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 9;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const payload = await getPayloadClient();

  const newsResult = await payload.find({
    collection: 'news',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: ITEMS_PER_PAGE,
    page: currentPage,
  });

  return (
    <NewsListContent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      news={newsResult.docs as any[]}
      totalPages={newsResult.totalPages}
      currentPage={currentPage}
    />
  );
}
