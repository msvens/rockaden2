'use client';

import { Link } from '@/components/Link';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/translations';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="uppercase mx-2 text-xs sm:text-sm font-light text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-6 flex justify-center items-center">
        <FooterLink href="/nyheter">{t.footer.navigation.news}</FooterLink>
        <FooterLink href="/om-rockaden">{t.footer.navigation.about}</FooterLink>
        <FooterLink href="#">{t.footer.navigation.contact}</FooterLink>
      </div>
    </footer>
  );
}
