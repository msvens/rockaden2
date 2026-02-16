'use client';

import { PageTitle } from '@/components/PageTitle';
import { RichText } from '@/components/RichText';

interface PageDoc {
  title: string;
  content?: unknown;
}

export function PageContent({ page }: { page: PageDoc }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageTitle title={page.title} />
      {page.content ? (
        <RichText content={page.content as Parameters<typeof RichText>[0]['content']} />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No content yet.</p>
      )}
    </div>
  );
}
