'use client';

import {
  NewspaperIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
  DocumentTextIcon,
  StarIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { getTranslation } from '@/lib/translations';
import { Navbar } from '@/components/navbar';
import type { NavLinkItem, NavDropdownItem, NavBrand } from '@/components/navbar';

export default function NavbarConfig() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = getTranslation(language);

  const brand: NavBrand = {
    href: '/',
    lines: ['SK', 'Rockaden'],
    logo: '/logo.png',
  };

  const centerItems: NavLinkItem[] = [
    {
      kind: 'link',
      id: 'news',
      href: '/nyheter',
      icon: NewspaperIcon,
      label: t.navbar.navigation.news,
    },
    {
      kind: 'link',
      id: 'calendar',
      href: '/calendar',
      icon: CalendarIcon,
      label: t.navbar.navigation.calendar,
    },
    {
      kind: 'link',
      id: 'training',
      href: '/traning',
      icon: AcademicCapIcon,
      label: t.navbar.navigation.training,
    },
    {
      kind: 'link',
      id: 'members',
      href: '/medlemmar',
      icon: UserGroupIcon,
      label: t.navbar.navigation.members,
    },
  ];

  const themeLabel = theme === 'dark' ? t.navbar.lightMode : t.navbar.darkMode;
  const themeIcon = theme === 'dark' ? SunIcon : MoonIcon;

  const languageLabel = language === 'en' ? '🇸🇪 Svenska' : '🇺🇸 English';

  const moreDropdown: NavDropdownItem = {
    kind: 'dropdown',
    id: 'more',
    icon: Cog6ToothIcon,
    label: t.navbar.more,
    items: [
      {
        kind: 'link',
        id: 'about',
        href: '/om-rockaden',
        icon: InformationCircleIcon,
        label: t.navbar.navigation.about,
      },
      {
        kind: 'link',
        id: 'play',
        href: '/spela-schack',
        icon: PuzzlePieceIcon,
        label: t.navbar.navigation.play,
      },
      {
        kind: 'link',
        id: 'material',
        href: '/material',
        icon: DocumentTextIcon,
        label: t.navbar.navigation.material,
      },
      {
        kind: 'link',
        id: 'leaders',
        href: '/ledare',
        icon: StarIcon,
        label: t.navbar.navigation.leaders,
      },
      { kind: 'divider' },
      {
        kind: 'action',
        id: 'theme',
        icon: themeIcon,
        label: themeLabel,
        onClick: toggleTheme,
      },
      {
        kind: 'action',
        id: 'language',
        label: languageLabel,
        onClick: () => setLanguage(language === 'en' ? 'sv' : 'en'),
      },
    ],
  };

  return (
    <Navbar
      brand={brand}
      display="text"
      showBorder={false}
      centerItems={centerItems}
      rightItems={[moreDropdown]}
    />
  );
}
