/* Sekce Videa: samostatná videa mimo kurzy (jako příspěvky na YouTube, Herohero nebo Patreonu).
   Data zveřejnění, témata, počty a komentáře jsou v prototypu zástupné. */
export type Topic = 'Novinky' | 'Materiály' | 'Kotvení' | 'Sokl a povrchy'
export const TOPICS: Topic[] = ['Novinky', 'Materiály', 'Kotvení', 'Sokl a povrchy']

export type FeedMeta = { v: string; date: string; topic: Topic; likes: number; comments: number }

/** Od nejnovějšího. */
export const FEED: FeedMeta[] = [
  { v: 'L-ietmDZFZ8', date: '2026-10-08', topic: 'Novinky', likes: 86, comments: 12 },
  { v: 'cXmpSogRKKY', date: '2026-10-01', topic: 'Kotvení', likes: 64, comments: 9 },
  { v: 'ZoKv93eH8ik', date: '2026-09-24', topic: 'Novinky', likes: 212, comments: 41 },
  { v: 'KPtJJG9cmvo', date: '2026-09-17', topic: 'Kotvení', likes: 58, comments: 7 },
  { v: 'Jgf9IC6I0gU', date: '2026-09-10', topic: 'Novinky', likes: 143, comments: 22 },
  { v: 'IX-1IWWdTcQ', date: '2026-08-27', topic: 'Sokl a povrchy', likes: 119, comments: 16 },
  { v: '2SlGQlGqOak', date: '2026-08-13', topic: 'Materiály', likes: 176, comments: 28 },
  { v: 'ZX89aaMajH4', date: '2026-07-30', topic: 'Sokl a povrchy', likes: 231, comments: 35 },
  { v: 'eQTPR0zh5_E', date: '2026-07-16', topic: 'Kotvení', likes: 74, comments: 11 },
  { v: 'PPLYiow1M0Q', date: '2026-07-02', topic: 'Kotvení', likes: 49, comments: 5 },
  { v: 'ss8zz5Yg6WY', date: '2026-06-18', topic: 'Sokl a povrchy', likes: 97, comments: 14 },
]

/** Ukázkové komentáře (zástupné, v prototypu stejné u všech videí). */
export const SAMPLE_COMMENTS = [
  {
    name: 'Petr Kučera',
    when: 'před 2 dny',
    text: 'Díky za video. Přesně tohle jsme řešili u nás na domě, škoda, že jsem ho neviděl dřív.',
    likes: 14,
  },
  {
    name: 'ZOFI',
    when: 'před 2 dny',
    text: 'Díky, Petře. Kdyby vám něco nebylo jasné, napište nám na info@zofi.cz.',
    likes: 6,
    team: true,
  },
  {
    name: 'Lucie Horáková',
    when: 'před 5 dny',
    text: 'Konečně někdo ukazuje i detaily, ne jen hotovou fasádu. Těším se na další díl.',
    likes: 9,
  },
]
