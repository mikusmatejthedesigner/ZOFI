import { createContext, useContext, useEffect, useMemo } from 'react'
import { VIDEOS, courseLessons, type Course } from '../data/catalog'
import { useProgress } from '../lib/progress'

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

export function useVideoSearch(q: string) {
  return useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return VIDEOS.filter((x) => {
      const hay = norm(`${x.t} ${x.desc}`)
      return words.every((w) => hay.includes(w))
    })
  }, [q])
}


/** Odpovídá text dotazu? (všechna slova, bez ohledu na diakritiku) */
export const matchText = (q: string, hay: string) => {
  const words = norm(q).split(/\s+/).filter(Boolean)
  const h = norm(hay)
  return words.every((w) => h.includes(w))
}
