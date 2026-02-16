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
      locale: 'sv' as const,
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
      locale: 'sv' as const,
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
      locale: 'sv' as const,
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
      locale: 'sv' as const,
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
      locale: 'sv' as const,
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
          locale: 'sv',
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

  console.log('Seeding complete!');
  process.exit(0);
}

seed();
