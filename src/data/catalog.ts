import { VIDEOS, type Video } from './videos'
import { COURSES, type Course } from './courses'
import { LESSONS, type LessonInfo } from './lessons'

export { VIDEOS, COURSES }
export type { Video, Course, LessonInfo }

const byId = new Map(VIDEOS.map((x) => [x.v, x]))

export const vid = (id: string) => byId.get(id)
export const course = (id: string) => COURSES.find((c) => c.id === id)
export const courseLessons = (c: Course) => c.chapters.flatMap((ch) => ch.l)
export const courseOf = (id: string) => COURSES.find((c) => courseLessons(c).includes(id))
export const chapterOf = (c: Course, id: string) => c.chapters.findIndex((ch) => ch.l.includes(id))
export const standalone = () => VIDEOS.filter((x) => !courseOf(x.v))
export const newest = () => VIDEOS.filter((x) => x.isNew)

/** "m:ss" → sekundy */
export const secs = (d: string) => d.split(':').reduce((a, b) => a * 60 + Number(b), 0)
export const courseSecs = (c: Course) => courseLessons(c).reduce((a, id) => a + secs(vid(id)?.d ?? '0:00'), 0)
export const totalSecs = () => VIDEOS.reduce((a, x) => a + secs(x.d), 0)

/** 3725 → "1 h 2 min" */
export const fmtDuration = (s: number) => {
  const m = Math.round(s / 60)
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`
}
/** 75 → "1:15" */
export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const NBSP = String.fromCharCode(160)
export const kc = (n: number) => `${n.toLocaleString('cs-CZ').replace(/\s/g, NBSP)}${NBSP}Kč`

/** Česká koncovka: 1 lekce, 2–4 lekce, 5 lekcí */
export const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many

export type ThumbSize = 'sm' | 'md' | 'lg'
export const thumb = (x: Video, size: ThumbSize = 'md') => {
  const name = size === 'sm' ? 'mqdefault' : size === 'lg' && x.hq ? 'maxresdefault' : 'hqdefault'
  return `https://i.ytimg.com/vi/${x.v}/${name}.jpg`
}

export const lessonInfo = (id: string): LessonInfo => {
  const known = LESSONS[id]
  if (known) return known
  const x = vid(id)
  const d = x ? secs(x.d) : 0
  return {
    m: [
      [0, 'Úvod'],
      [Math.round(d * 0.3), 'Postup krok za krokem'],
      [Math.round(d * 0.78), 'Shrnutí'],
    ],
    k: x ? [x.desc] : [],
  }
}

/* Předplatné (ceny jsou zástupné, převzato z prototypu) */
export const PLANS = {
  rok: { name: 'Ročně', price: 2290, unit: 'rok', monthly: 191 },
  mesic: { name: 'Měsíčně', price: 249, unit: 'měsíc', monthly: 249 },
} as const
export const yearlySaving = PLANS.mesic.price * 12 - PLANS.rok.price

/* Ukázkový uživatel prototypu */
export const USER = {
  first: 'Jan',
  vocative: 'Jane',
  last: 'Novák',
  email: 'jan.novak@email.cz',
  plan: 'rok' as const,
}
