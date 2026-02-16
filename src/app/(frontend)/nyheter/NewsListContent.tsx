'use client';

import { NewsCard } from '@/components/NewsCard';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/Button';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface NewsDoc {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: string | null;
  featuredImage?: {
    url?: string | null;
    alt?: string;
    sizes?: {
      card?: { url?: string | null };
      thumbnail?: { url?: string | null };
    };
  } | null;
}

interface NewsListContentProps {
  news: NewsDoc[];
  totalPages: number;
  currentPage: number;
}

export function NewsListContent({ news, totalPages, currentPage }: NewsListContentProps) {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageTitle title={t.news.title} subtitle={t.news.subtitle} />

      {news.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{t.news.noNews}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                publishedAt={article.publishedAt}
                category={article.category}
                featuredImage={article.featuredImage as NewsDoc['featuredImage']}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {currentPage > 1 && (
                <Button href={`/nyheter?page=${currentPage - 1}`} variant="outlined" compact>
                  &larr;
                </Button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  href={`/nyheter?page=${page}`}
                  variant={page === currentPage ? 'contained' : 'outlined'}
                  compact
                >
                  {page}
                </Button>
              ))}
              {currentPage < totalPages && (
                <Button href={`/nyheter?page=${currentPage + 1}`} variant="outlined" compact>
                  &rarr;
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
