import type { Language } from '@/context/LanguageContext';

export interface Translations {
  navbar: {
    navigation: {
      news: string;
      calendar: string;
      training: string;
      members: string;
      about: string;
      play: string;
      material: string;
      leaders: string;
    };
    language: {
      english: string;
      swedish: string;
    };
    more: string;
    lightMode: string;
    darkMode: string;
  };
  footer: {
    navigation: {
      news: string;
      about: string;
      contact: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
    };
    cards: {
      news: { title: string; description: string; link: string };
      about: { title: string; description: string; link: string };
      training: { title: string; description: string; link: string };
      play: { title: string; description: string; link: string };
    };
    recentNews: string;
    viewAll: string;
  };
  news: {
    title: string;
    subtitle: string;
    readMore: string;
    backToList: string;
    publishedAt: string;
    by: string;
    noNews: string;
  };
  about: {
    title: string;
    fallback: string;
  };
  common: {
    loading: string;
  };
  categories: {
    nyheter: string;
    turneringar: string;
    training: string;
    skolschack: string;
    allsvenskan: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    today: string;
    noEvents: string;
    addEvent: string;
    editEvent: string;
    time: string;
    location: string;
    moreEvents: string;
    days: {
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
      sun: string;
    };
    eventCategories: {
      training: string;
      tournament: string;
      junior: string;
      allsvenskan: string;
      skolschack: string;
      other: string;
    };
    recurring: string;
    weekly: string;
    biweekly: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    navbar: {
      navigation: {
        news: 'News',
        calendar: 'Calendar',
        training: 'Training',
        members: 'Members',
        about: 'About',
        play: 'Play Chess',
        material: 'Material',
        leaders: 'Leaders',
      },
      language: {
        english: 'English',
        swedish: 'Svenska',
      },
      more: 'More',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
    },
    footer: {
      navigation: {
        news: 'News',
        about: 'About',
        contact: 'Contact',
      },
    },
    home: {
      hero: {
        title: 'Welcome to SK Rockaden',
        subtitle: 'One of Stockholm\'s oldest and most active chess clubs. We offer training, tournaments, and a welcoming community for players of all levels.',
      },
      cards: {
        news: {
          title: 'News',
          description: 'Stay updated with the latest from the club.',
          link: 'Read News',
        },
        about: {
          title: 'About Rockaden',
          description: 'Learn more about our history and activities.',
          link: 'Read More',
        },
        training: {
          title: 'Training',
          description: 'Information about training sessions and schedules.',
          link: 'Training Info',
        },
        play: {
          title: 'Play Chess',
          description: 'Find out when and where to play.',
          link: 'Play Now',
        },
      },
      recentNews: 'Recent News',
      viewAll: 'View all news',
    },
    news: {
      title: 'News',
      subtitle: 'The latest from SK Rockaden.',
      readMore: 'Read more',
      backToList: 'Back to news',
      publishedAt: 'Published',
      by: 'by',
      noNews: 'No news articles yet.',
    },
    about: {
      title: 'About SK Rockaden',
      fallback: 'Content coming soon. Please create the "om-rockaden" page in the admin panel.',
    },
    common: {
      loading: 'Loading...',
    },
    categories: {
      nyheter: 'News',
      turneringar: 'Tournaments',
      training: 'Training',
      skolschack: 'School Chess',
      allsvenskan: 'Allsvenskan',
    },
    calendar: {
      title: 'Calendar',
      subtitle: 'Upcoming events and activities at SK Rockaden.',
      today: 'Today',
      noEvents: 'No events this day.',
      addEvent: 'Add event',
      editEvent: 'Edit event',
      time: 'Time',
      location: 'Location',
      moreEvents: 'more',
      days: {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
      },
      eventCategories: {
        training: 'Training',
        tournament: 'Tournament',
        junior: 'Junior',
        allsvenskan: 'Allsvenskan',
        skolschack: 'School Chess',
        other: 'Other',
      },
      recurring: 'Recurring',
      weekly: 'Weekly',
      biweekly: 'Biweekly',
    },
  },
  sv: {
    navbar: {
      navigation: {
        news: 'Nyheter',
        calendar: 'Kalender',
        training: 'Träning',
        members: 'Medlemmar',
        about: 'Om Rockaden',
        play: 'Spela Schack',
        material: 'Material',
        leaders: 'Ledare',
      },
      language: {
        english: 'English',
        swedish: 'Svenska',
      },
      more: 'Mer',
      lightMode: 'Ljust Läge',
      darkMode: 'Mörkt Läge',
    },
    footer: {
      navigation: {
        news: 'Nyheter',
        about: 'Om Rockaden',
        contact: 'Kontakt',
      },
    },
    home: {
      hero: {
        title: 'Välkommen till SK Rockaden',
        subtitle: 'En av Stockholms äldsta och mest aktiva schackklubbar. Vi erbjuder träning, turneringar och en välkomnande gemenskap för spelare på alla nivåer.',
      },
      cards: {
        news: {
          title: 'Nyheter',
          description: 'Håll dig uppdaterad med det senaste från klubben.',
          link: 'Läs Nyheter',
        },
        about: {
          title: 'Om Rockaden',
          description: 'Läs mer om vår historia och verksamhet.',
          link: 'Läs Mer',
        },
        training: {
          title: 'Träning',
          description: 'Information om träningstillfällen och scheman.',
          link: 'Träningsinfo',
        },
        play: {
          title: 'Spela Schack',
          description: 'Ta reda på när och var du kan spela.',
          link: 'Spela Nu',
        },
      },
      recentNews: 'Senaste Nytt',
      viewAll: 'Se alla nyheter',
    },
    news: {
      title: 'Nyheter',
      subtitle: 'Det senaste från SK Rockaden.',
      readMore: 'Läs mer',
      backToList: 'Tillbaka till nyheter',
      publishedAt: 'Publicerad',
      by: 'av',
      noNews: 'Inga nyhetsartiklar ännu.',
    },
    about: {
      title: 'Om SK Rockaden',
      fallback: 'Innehållet kommer snart. Skapa sidan "om-rockaden" i adminpanelen.',
    },
    common: {
      loading: 'Laddar...',
    },
    categories: {
      nyheter: 'Nyheter',
      turneringar: 'Turneringar',
      training: 'Träning',
      skolschack: 'Skolschack',
      allsvenskan: 'Allsvenskan',
    },
    calendar: {
      title: 'Kalender',
      subtitle: 'Kommande evenemang och aktiviteter på SK Rockaden.',
      today: 'Idag',
      noEvents: 'Inga händelser denna dag.',
      addEvent: 'Lägg till händelse',
      editEvent: 'Redigera händelse',
      time: 'Tid',
      location: 'Plats',
      moreEvents: 'till',
      days: {
        mon: 'Mån',
        tue: 'Tis',
        wed: 'Ons',
        thu: 'Tor',
        fri: 'Fre',
        sat: 'Lör',
        sun: 'Sön',
      },
      eventCategories: {
        training: 'Träning',
        tournament: 'Turnering',
        junior: 'Junior',
        allsvenskan: 'Allsvenskan',
        skolschack: 'Skolschack',
        other: 'Övrigt',
      },
      recurring: 'Återkommande',
      weekly: 'Varje vecka',
      biweekly: 'Varannan vecka',
    },
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language];
}
