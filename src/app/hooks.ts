import { createContext, useContext, useEffect, useMemo } from 'react'
import { COURSES, VIDEOS, courseLessons, courseOf, feedMeta, fmtAgo, type Course, type Video } from '../data/catalog'
import { useProgress } from '../lib/progress'

/** Ukázka aplikace na webu (demo.html): přehrávač nenačítá YouTube. */
export const playerDemo = { on: false }

/* ---------- název stránky ---------- */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Fasádní akademie ZOFI`
  }, [title])
}

/* ---------- průběh kurzu ---------- */
export function useCourseProgress(c: Course) {
  const { watched } = useProgress()
  const ids = courseLessons(c)
  const done = ids.filter((id) => watched.includes(id)).length
  const next = ids.find((id) => !watched.includes(id)) ?? ids[0]
  return { done, total: ids.length, pct: Math.round((done / ids.length) * 100), next }
}

/* ---------- oznámení (toast) ---------- */
export const ToastCtx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

/* ---------- hledání ve videích ---------- */
export const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/** Všechna videa a lekce, které odpovídají dotazu (název, popis, téma, kurz). */
export function searchAll(q: string) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return VIDEOS.filter((x) => {
    const c = courseOf(x.v)
    const hay = norm(`${x.t} ${x.desc} ${feedMeta(x.v)?.topic ?? ''} ${c?.title ?? ''}`)
    return words.every((w) => hay.includes(w))
  })
}

/** Našeptávač v horní liště: prvních pár videí a lekcí, celkový počet. */
export function useVideoSearch(q: string) {
  return useMemo(() => {
    const hits = searchAll(q)
    return {
      videos: hits.filter((x) => !courseOf(x.v)).slice(0, 4),
      lessons: hits.filter((x) => courseOf(x.v)).slice(0, 4),
      total: hits.length,
    }
  }, [q])
}

/* ---------- pokračovat ve sledování ---------- */
export type Resume = { c: Course; at: string; index: number; done: number; total: number; pct: number }

/** Rozkoukané kurzy: kde pokračovat, naposledy otevřený kurz první. */
export function useContinue(): Resume[] {
  const { watched, last } = useProgress()
  const lastCourse = last ? courseOf(last) : undefined
  return COURSES.flatMap((c) => {
    const ids = courseLessons(c)
    const done = ids.filter((id) => watched.includes(id)).length
    if (done === 0 || done === ids.length) return []
    const next = ids.find((id) => !watched.includes(id)) ?? ids[0]
    const at = last && ids.includes(last) && !watched.includes(last) ? last : next
    return [{ c, at, index: ids.indexOf(at), done, total: ids.length, pct: Math.round((done / ids.length) * 100) }]
  }).sort((a, b) => Number(b.c === lastCourse) - Number(a.c === lastCourse))
}

/* ---------- popisek videa: téma a datum, nebo kurz a lekce ---------- */
export function videoMeta(x: Video) {
  const m = feedMeta(x.v)
  if (m) return { label: m.topic, sub: fmtAgo(m.date), likes: m.likes }
  const c = courseOf(x.v)
  if (c) return { label: c.short, sub: `Lekce ${courseLessons(c).indexOf(x.v) + 1}`, likes: undefined }
  return { label: 'Video', sub: '', likes: undefined }
}

/** Pořadí lekce v kurzu (1…n). */
export const lessonNo = (c: Course, id: string) => courseLessons(c).indexOf(id) + 1
