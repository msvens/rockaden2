'use client';

import { PageTitle } from '@/components/PageTitle';
import { RichText } from '@/components/RichText';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface PageDoc {
  title: string;
  content?: unknown;
}

export function AboutContent({ page }: { page: PageDoc | null }) {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageTitle title={t.about.title} />

      {page?.content ? (
        <RichText content={page.content as Parameters<typeof RichText>[0]['content']} />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">{t.about.fallback}</p>
      )}
    </div>
  );
}
