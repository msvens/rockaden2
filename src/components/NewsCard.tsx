'use client';

import { Link } from '@/components/Link';
import { Card } from '@/components/Card';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface NewsCardProps {
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

export function NewsCard({ title, slug, excerpt, publishedAt, category, featuredImage }: NewsCardProps) {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const imageUrl = featuredImage?.sizes?.card?.url || featuredImage?.url;
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const categoryLabel = category
    ? t.categories[category as keyof typeof t.categories] || category
    : null;

  return (
    <Card hover border>
      {imageUrl && (
        <div className="relative w-full h-48 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-lg" style={{ width: 'calc(100% + 3rem)' }}>
          <img
            src={imageUrl}
            alt={featuredImage?.alt || title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        {categoryLabel && (
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
            {categoryLabel}
          </span>
        )}
        {formattedDate && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {categoryLabel && '\u00B7'} {formattedDate}
          </span>
        )}
      </div>
      <h3 className="text-lg font-light tracking-wide mb-2 text-gray-900 dark:text-gray-200">
        <Link href={`/nyheter/${slug}`} color="inherit" underline="hover">
          {title}
        </Link>
      </h3>
      {excerpt && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{excerpt}</p>
      )}
      <Link href={`/nyheter/${slug}`} color="blue" className="text-sm">
        {t.news.readMore} &rarr;
      </Link>
    </Card>
  );
}
