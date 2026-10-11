import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { VIDEOS, courseLessons, courseOf, feedMeta, fmtAgo, type Course, type Video } from '../data/catalog'
import { useProgress } from '../lib/progress'

/* ---------- název stránky ---------- */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Fasádní akademie ZOFI`
  }, [title])
}

/** true až po prvním vykreslení: ukazatele průběhu se pak plynule doplní od nuly. */
export function useMounted() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(r)
  }, [])
  return on
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

/** Hledání napříč aplikací: samostatná videa a lekce kurzů. */
export function useVideoSearch(q: string) {
  return useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    if (!words.length) return { videos: [], lessons: [] }
    const hits = VIDEOS.filter((x) => {
      const c = courseOf(x.v)
      const hay = norm(`${x.t} ${x.desc} ${feedMeta(x.v)?.topic ?? ''} ${c?.title ?? ''}`)
      return words.every((w) => hay.includes(w))
    })
    return {
      videos: hits.filter((x) => !courseOf(x.v)).slice(0, 5),
      lessons: hits.filter((x) => courseOf(x.v)).slice(0, 5),
    }
  }, [q])
}

/** Odpovídá text dotazu? (všechna slova, bez ohledu na diakritiku) */
export const matchText = (q: string, hay: string) => {
  const words = norm(q).split(/\s+/).filter(Boolean)
  const h = norm(hay)
  return words.every((w) => h.includes(w))
}

/* ---------- popisek videa: téma a datum, nebo kurz a lekce ---------- */
export function videoMeta(x: Video) {
  const m = feedMeta(x.v)
  if (m) return { label: m.topic, sub: fmtAgo(m.date), likes: m.likes }
  const c = courseOf(x.v)
  if (c) return { label: c.short, sub: `Lekce ${courseLessons(c).indexOf(x.v) + 1}`, likes: undefined }
  return { label: 'Video', sub: '', likes: undefined }
}
