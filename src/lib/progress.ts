import { useSyncExternalStore } from 'react'

/* Průběh lekcí. V prototypu se ukládá jen do prohlížeče. */
export type Progress = { watched: string[]; last?: string }

const KEY = 'zofi.progress.v1'
const DEMO: Progress = {
  watched: ['7DFgjeVmT1Y', '9w69d0tfcNU', 'lcx6Xk41iSg', 'etar5LJJeCY', 'ss8zz5Yg6WY'],
  last: 'Er5tVaQ3u2U',
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Progress
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

export const progress = {
  get: () => state,
  isWatched: (id: string) => state.watched.includes(id),
  toggle(id: string) {
    const has = state.watched.includes(id)
    set({ ...state, watched: has ? state.watched.filter((x) => x !== id) : [...state.watched, id] })
  },
  markWatched(id: string) {
    if (!state.watched.includes(id)) set({ ...state, watched: [...state.watched, id] })
  },
  setLast(id: string) {
    if (state.last !== id) set({ ...state, last: id })
  },
  reset() {
    set({ watched: [] })
  },
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}
