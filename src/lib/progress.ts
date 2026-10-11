import { useSyncExternalStore } from 'react'

/* Průběh lekcí, „Líbí se“ a uložená videa. V prototypu se ukládá jen do prohlížeče. */
export type Progress = { watched: string[]; last?: string; liked: string[]; saved: string[] }

const KEY = 'zofi.progress.v2'
const DEMO: Progress = {
  watched: ['7DFgjeVmT1Y', '9w69d0tfcNU', 'lcx6Xk41iSg', 'etar5LJJeCY', 'Jgf9IC6I0gU'],
  last: 'Er5tVaQ3u2U',
  liked: [],
  saved: ['2SlGQlGqOak'],
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEMO, ...(JSON.parse(raw) as Partial<Progress>) }
  } catch {
    /* úložiště není dostupné */
  }
  return DEMO
}

let state = load()
const listeners = new Set<() => void>()

function set(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* úložiště není dostupné */
  }
  listeners.forEach((l) => l())
}

const toggleIn = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export const progress = {
  get: () => state,
  toggle(id: string) {
    set({ ...state, watched: toggleIn(state.watched, id) })
  },
  markWatched(id: string) {
    if (!state.watched.includes(id)) set({ ...state, watched: [...state.watched, id] })
  },
  setLast(id: string) {
    if (state.last !== id) set({ ...state, last: id })
  },
  like(id: string) {
    set({ ...state, liked: toggleIn(state.liked, id) })
  },
  save(id: string) {
    set({ ...state, saved: toggleIn(state.saved, id) })
  },
  reset() {
    set({ watched: [], liked: [], saved: [] })
  },
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}
