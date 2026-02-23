import { getPayload } from 'payload';
import config from '../src/payload.config';

async function seed() {
  const payload = await getPayload({ config });

  console.log('Seeding database...');

  // Create admin user
  let adminUser;
  try {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@rockaden.se' } },
    });
    if (existing.docs.length > 0) {
      adminUser = existing.docs[0];
      console.log('Admin user already exists, skipping.');
    } else {
      adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@rockaden.se',
          password: 'rockaden123',
          name: 'Admin',
          role: 'admin',
        },
      });
      console.log('Created admin user: admin@rockaden.se');
    }
  } catch (e) {
    console.error('Error creating admin user:', e);
    return;
  }

  // Create news articles
  const newsArticles = [
    {
      title: 'Välkommen till nya hemsidan',
      slug: 'valkommen-till-nya-hemsidan',
      status: 'published' as const,
      publishedAt: new Date('2026-02-01').toISOString(),
      excerpt: 'SK Rockaden lanserar sin nya moderna hemsida byggd med PayloadCMS och Next.js.',
      category: 'nyheter' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Vi är glada att kunna presentera SK Rockadens nya hemsida! Den nya sidan är byggd med modern teknik och ger oss möjlighet att enkelt uppdatera nyheter och information.',
                },
              ],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Genom det nya adminverktyget kan styrelsemedlemmar och redaktörer logga in och skapa nyhetsartiklar, uppdatera sidor och hantera bilder direkt i webbläsaren.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: 'Allsvenskan 2026 - Laguppställning klar',
      slug: 'allsvenskan-2026-laguppstallning',
      status: 'published' as const,
      publishedAt: new Date('2026-01-28').toISOString(),
      excerpt: 'Laguppställningen för Allsvenskan 2026 är nu fastställd. SK Rockaden ställer upp med två lag.',
      category: 'allsvenskan' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Inför Allsvenskan 2026 har SK Rockaden satt samman två starka lag. Lag 1 siktar på att försvara sin position i Division 1 medan Lag 2 spelar i Division 3.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: 'Vårterminens träning startar',
      slug: 'varterminens-traning-startar',
      status: 'published' as const,
      publishedAt: new Date('2026-01-15').toISOString(),
      excerpt: 'Träningen på tisdagskvällar startar igen den 21 januari. Välkomna tillbaka!',
      category: 'training' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Vårterminens träning startar tisdagen den 21 januari kl 18:00. Vi träffas som vanligt i klubblokalen. Alla medlemmar är välkomna, oavsett spelstyrka.',
                },
              ],
              version: 1,
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Schema',
                },
              ],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Tisdagar 18:00 - 21:00: Öppen träning och partier. Torsdagar 17:00 - 19:00: Juniorträning.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: 'Skolschack-turnering på Montessoriskolan',
      slug: 'skolschack-turnering-montessori',
      status: 'published' as const,
      publishedAt: new Date('2026-01-10').toISOString(),
      excerpt: 'SK Rockaden arrangerar en skolschack-turnering i samarbete med Montessoriskolan Centrum.',
      category: 'skolschack' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Den 15 februari arrangerar SK Rockaden en skolschack-turnering på Montessoriskolan Centrum. Turneringen är öppen för alla elever i årskurs 1-6.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: 'Rockadens interna snabbschack-turnering',
      slug: 'intern-snabbschack-turnering',
      status: 'draft' as const,
      publishedAt: null,
      excerpt: 'Planerad snabbschack-turnering för klubbmedlemmar i mars.',
      category: 'turneringar' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Vi planerar en intern snabbschack-turnering i mars. Mer information kommer snart.',
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ];

  for (const article of newsArticles) {
    try {
      const existing = await payload.find({
        collection: 'news',
        where: { slug: { equals: article.slug } },
      });
      if (existing.docs.length > 0) {
        console.log(`News "${article.title}" already exists, skipping.`);
        continue;
      }
      await payload.create({
        collection: 'news',
        data: {
          ...article,
          author: adminUser.id,
        },
      });
      console.log(`Created news: ${article.title}`);
    } catch (e) {
      console.error(`Error creating news "${article.title}":`, e);
    }
  }

  // Create About page
  try {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'om-rockaden' } },
    });
    if (existing.docs.length > 0) {
      console.log('About page already exists, skipping.');
    } else {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Om SK Rockaden',
          slug: 'om-rockaden',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'SK Rockaden är en av Stockholms äldsta schackklubbar, grundad 1936. Klubben har sitt säte i centrala Stockholm och erbjuder schackverksamhet för alla åldrar och nivåer.',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [
                    {
                      type: 'text',
                      text: 'Vår verksamhet',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Vi bedriver träning för juniorer och seniorer, deltar i Allsvenskan och andra lagturneringar, och arrangerar interna turneringar och schackevenemang.',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [
                    {
                      type: 'text',
                      text: 'Skolschack',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'SK Rockaden driver ett aktivt skolschackprogram i samarbete med flera skolor i Stockholmsområdet. Vi erbjuder schackundervisning och arrangerar turneringar för barn och ungdomar.',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [
                    {
                      type: 'text',
                      text: 'Bli medlem',
                    },
                  ],
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Är du intresserad av att bli medlem? Kom förbi på en träningskväll så berättar vi mer! Du hittar oss i vår klubblokal på tisdagskvällar.',
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
      });
      console.log('Created About page');
    }
  } catch (e) {
    console.error('Error creating About page:', e);
  }

  // Create events
  const now = new Date();
  function futureDate(daysFromNow: number, hour: number, minute: number = 0): string {
    const d = new Date(now);
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  // Find the next occurrence of a specific weekday (0=Sun, 1=Mon, 2=Tue, ...)
  function nextWeekday(targetDay: number, hour: number, minute: number = 0): string {
    const d = new Date(now);
    const currentDay = d.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    d.setDate(d.getDate() + daysUntil);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  function nextWeekdayEndDate(targetDay: number, weeksAhead: number): string {
    const d = new Date(now);
    const currentDay = d.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    d.setDate(d.getDate() + daysUntil + weeksAhead * 7);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  const events = [
    {
      title: 'Tisdagsträning',
      slug: 'tisdagstraning',
      status: 'published' as const,
      description: 'Öppen träning för alla medlemmar. Kom och spela partier eller analysera med tränare.',
      startDate: nextWeekday(2, 18, 0),  // Tuesday 18:00
      endDate: nextWeekday(2, 21, 0),    // Tuesday 21:00
      location: 'Klubblokalen',
      category: 'training' as const,
      isRecurring: true,
      recurrenceType: 'weekly' as const,
      recurrenceEndDate: nextWeekdayEndDate(2, 8),
      excludedDates: [],
    },
    {
      title: 'Juniorträning',
      slug: 'juniortraning',
      status: 'published' as const,
      description: 'Schackträning för juniorer upp till 18 år. Nybörjare och avancerade välkomna.',
      startDate: nextWeekday(4, 17, 0),  // Thursday 17:00
      endDate: nextWeekday(4, 19, 0),    // Thursday 19:00
      location: 'Klubblokalen',
      category: 'junior' as const,
      isRecurring: true,
      recurrenceType: 'weekly' as const,
      recurrenceEndDate: nextWeekdayEndDate(4, 8),
      excludedDates: [],
    },
    {
      title: 'Allsvenskan Omgång 5 – Rockaden vs Kung',
      slug: 'allsvenskan-omgang-5',
      status: 'published' as const,
      description: 'Hemmamatch i Allsvenskan Division 1. Kom och heja på laget!',
      startDate: futureDate(8, 10, 0),
      endDate: futureDate(8, 17, 0),
      location: 'Klubblokalen',
      category: 'allsvenskan' as const,
    },
    {
      title: 'Rockadens blixtmästerskap',
      slug: 'rockadens-blixtmasterskap',
      status: 'published' as const,
      description: 'Intern blitzturnering 3+2. Anmälan på plats senast kl 17:45.',
      startDate: futureDate(12, 18, 0),
      endDate: futureDate(12, 21, 30),
      location: 'Klubblokalen',
      category: 'tournament' as const,
    },
    {
      title: 'Skolschack på Eriksdalsskolan',
      slug: 'skolschack-eriksdalsskolan',
      status: 'published' as const,
      description: 'Schacklektioner för elever i åk 3-5 i samarbete med Eriksdalsskolan.',
      startDate: futureDate(6, 13, 0),
      endDate: futureDate(6, 14, 30),
      location: 'Eriksdalsskolan',
      category: 'skolschack' as const,
    },
  ];

  for (const event of events) {
    try {
      const existing = await payload.find({
        collection: 'events',
        where: { slug: { equals: event.slug } },
      });
      if (existing.docs.length > 0) {
        console.log(`Event "${event.title}" already exists, skipping.`);
        continue;
      }
      await payload.create({
        collection: 'events',
        data: event,
      });
      console.log(`Created event: ${event.title}`);
    } catch (e) {
      console.error(`Error creating event "${event.title}":`, e);
    }
  }

  // Create training group
  try {
    const existingGroup = await payload.find({
      collection: 'training-groups',
      where: { slug: { equals: 'tisdagsgruppen-vt2026' } },
    });

    if (existingGroup.docs.length > 0) {
      console.log('Training group already exists, skipping.');
    } else {
      // Find the Tisdagsträning event to link
      const trainingEvent = await payload.find({
        collection: 'events',
        where: { slug: { equals: 'tisdagstraning' } },
        limit: 1,
      });

      const group = await payload.create({
        collection: 'training-groups',
        data: {
          name: 'Tisdagsgruppen VT2026',
          slug: 'tisdagsgruppen-vt2026',
          status: 'active',
          description: 'Tisdagsträningens rundturneringsgrupp för vårterminen 2026.',
          semester: 'VT2026',
          hasTournament: true,
          event: trainingEvent.docs[0]?.id ?? undefined,
          createdBy: adminUser.id,
          participants: [
            { name: 'Erik Lindström', ssfId: 100001, active: true },
            { name: 'Anna Bergqvist', ssfId: 100002, active: true },
            { name: 'Lars Johansson', ssfId: 100003, active: true },
            { name: 'Maria Nilsson', ssfId: 100004, active: true },
            { name: 'Karl Svensson', ssfId: 100005, active: true },
            { name: 'Sofia Andersson', ssfId: 100006, active: true },
          ],
        },
      });
      console.log('Created training group: Tisdagsgruppen VT2026');

      // Update the event with a link back to the training group
      if (trainingEvent.docs[0]) {
        await payload.update({
          collection: 'events',
          id: trainingEvent.docs[0].id,
          data: {
            link: `/training/${group.id}`,
            linkLabel: 'Tisdagsgruppen VT2026',
          },
        });
        console.log('Updated Tisdagsträning event with training group link');
      }

      // Get participant IDs from created group
      const participants = group.participants || [];
      const pIds = participants.map((p: { id?: string | null }) => p.id!);

      // Create past training sessions with attendance and game results
      // Find previous Tuesdays for session dates
      function pastTuesday(weeksAgo: number): string {
        const d = new Date(now);
        const currentDay = d.getDay();
        // Days since last Tuesday
        let daysSinceTuesday = currentDay - 2;
        if (daysSinceTuesday < 0) daysSinceTuesday += 7;
        d.setDate(d.getDate() - daysSinceTuesday - (weeksAgo - 1) * 7);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }

      // Session 1: 3 weeks ago — Round 1
      await payload.create({
        collection: 'training-sessions',
        data: {
          group: group.id,
          sessionDate: pastTuesday(3),
          notes: 'Bra start på terminen! Alla närvarande.',
          attendance: pIds.map((id: string) => ({ participantId: id, present: true })),
          games: [
            { round: 1, whiteId: pIds[0], blackId: pIds[5], result: '1-0' },
            { round: 1, whiteId: pIds[1], blackId: pIds[4], result: '0.5-0.5' },
            { round: 1, whiteId: pIds[2], blackId: pIds[3], result: '0-1' },
          ],
        },
      });
      console.log('Created training session 1');

      // Session 2: 2 weeks ago — Round 2
      await payload.create({
        collection: 'training-sessions',
        data: {
          group: group.id,
          sessionDate: pastTuesday(2),
          notes: 'Sofia frånvarande, Karl fick bye.',
          attendance: [
            { participantId: pIds[0], present: true },
            { participantId: pIds[1], present: true },
            { participantId: pIds[2], present: true },
            { participantId: pIds[3], present: true },
            { participantId: pIds[4], present: true },
            { participantId: pIds[5], present: false },
          ],
          games: [
            { round: 2, whiteId: pIds[5], blackId: pIds[4], result: 'bye-black' },
            { round: 2, whiteId: pIds[0], blackId: pIds[3], result: '1-0' },
            { round: 2, whiteId: pIds[1], blackId: pIds[2], result: '1-0' },
          ],
        },
      });
      console.log('Created training session 2');

      // Session 3: 1 week ago — Round 3
      await payload.create({
        collection: 'training-sessions',
        data: {
          group: group.id,
          sessionDate: pastTuesday(1),
          notes: 'Spännande ronder. Erik fortsätter leda.',
          attendance: pIds.map((id: string) => ({ participantId: id, present: true })),
          games: [
            { round: 3, whiteId: pIds[0], blackId: pIds[2], result: '0.5-0.5' },
            { round: 3, whiteId: pIds[5], blackId: pIds[3], result: '1-0' },
            { round: 3, whiteId: pIds[4], blackId: pIds[1], result: '0-1' },
          ],
        },
      });
      console.log('Created training session 3');
    }
  } catch (e) {
    console.error('Error creating training data:', e);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed();
