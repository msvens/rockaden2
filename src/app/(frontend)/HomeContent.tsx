'use client';

import { Card } from '@/components/Card';
import { Link } from '@/components/Link';
import { NewsCard } from '@/components/NewsCard';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';
import {
  NewspaperIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

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

const cardIcons = {
  news: NewspaperIcon,
  about: InformationCircleIcon,
  training: AcademicCapIcon,
  play: PuzzlePieceIcon,
};

const cardLinks = {
  news: '/nyheter',
  about: '/om-rockaden',
  training: '#',
  play: '#',
};

export function HomeContent({ recentNews }: { recentNews: NewsDoc[] }) {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4 text-gray-900 dark:text-gray-200">
          {t.home.hero.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t.home.hero.subtitle}
        </p>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {(Object.keys(t.home.cards) as Array<keyof typeof t.home.cards>).map((key) => {
          const card = t.home.cards[key];
          const Icon = cardIcons[key];
          const href = cardLinks[key];
          return (
            <Card key={key} hover border>
              <div className="flex flex-col items-center text-center">
                <Icon className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400 stroke-[1.25]" />
                <h3 className="text-lg font-light tracking-wide mb-2 text-gray-900 dark:text-gray-200">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{card.description}</p>
                <Link href={href} color="blue" className="text-sm">
                  {card.link} &rarr;
                </Link>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Recent news */}
      {recentNews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light tracking-wide text-gray-900 dark:text-gray-200">
              {t.home.recentNews}
            </h2>
            <Link href="/nyheter" color="blue" className="text-sm">
              {t.home.viewAll} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNews.map((article) => (
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
        </section>
      )}
    </div>
  );
}
