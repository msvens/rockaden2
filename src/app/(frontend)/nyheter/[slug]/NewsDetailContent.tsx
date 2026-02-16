'use client';

import { Link } from '@/components/Link';
import { RichText } from '@/components/RichText';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface Author {
  name?: string;
}

interface FeaturedImage {
  url?: string | null;
  alt?: string;
  sizes?: {
    hero?: { url?: string | null };
    card?: { url?: string | null };
  };
}

export interface NewsArticle {
  title: string;
  slug: string;
  publishedAt?: string | null;
  category?: string | null;
  excerpt?: string | null;
  content?: unknown;
  author?: Author | string | null;
  featuredImage?: FeaturedImage | string | null;
}

export function NewsDetailContent({ article }: { article: NewsArticle }) {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const featuredImage = typeof article.featuredImage === 'object' ? article.featuredImage : null;
  const imageUrl = featuredImage?.sizes?.hero?.url || featuredImage?.url;
  const author = typeof article.author === 'object' ? article.author : null;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const categoryLabel = article.category
    ? t.categories[article.category as keyof typeof t.categories] || article.category
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/nyheter" color="gray" className="text-sm mb-6 inline-block">
        &larr; {t.news.backToList}
      </Link>

      {imageUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={featuredImage?.alt || article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        {categoryLabel && (
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
            {categoryLabel}
          </span>
        )}
        {formattedDate && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {categoryLabel && '\u00B7'} {t.news.publishedAt} {formattedDate}
          </span>
        )}
        {author?.name && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            \u00B7 {t.news.by} {author.name}
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-6 text-gray-900 dark:text-gray-200">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">{article.excerpt}</p>
      )}

      <RichText content={article.content as Parameters<typeof RichText>[0]['content']} />
    </div>
  );
}
