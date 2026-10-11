import gsap from 'gsap'
import type { NavigateFunction } from 'react-router'
import { progress } from '../lib/progress'

/* Scénář ukázky: kurzor ovládá skutečnou aplikaci (píše, kliká, přepíná).
   Web volá window.zofiDemo.play('<scéna>'), scéna běží dokola, dokud nepřijde jiná. */

export type Scene = 'hledani' | 'lekce' | 'pokracovat' | 'ulozit' | 'tma' | 'mobil'

class Abort extends Error {}

let nav: NavigateFunction | null = null
let touch = false
let token = 0
let cursor: HTMLDivElement | null = null
let markReady: () => void = () => {}
const isReady = new Promise<void>((r) => (markReady = r))

const norm = (s: string | null) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/* ---------- kurzor ---------- */
function makeCursor() {
  if (cursor) return
  cursor = document.createElement('div')
  cursor.className = `demo-cursor${touch ? ' touch' : ''}`
  cursor.innerHTML = touch
    ? ''
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2.5v17.2l4.3-4.1 2.8 6.4 3-1.3-2.8-6.3h6z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  document.body.appendChild(cursor)
  gsap.set(cursor, { x: innerWidth * 0.6, y: innerHeight * 0.7, autoAlpha: 0 })
}

function ripple() {
  if (!cursor) return
  const r = document.createElement('div')
  r.className = 'demo-ripple'
  document.body.appendChild(r)
  gsap.set(r, { x: gsap.getProperty(cursor, 'x'), y: gsap.getProperty(cursor, 'y') })
  gsap.fromTo(r, { scale: 0.2, opacity: 0.7 }, { scale: 1.7, opacity: 0, duration: 0.55, ease: 'power2.out', onComplete: () => r.remove() })
  gsap.fromTo(cursor, { scale: 0.8 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' })
}

/** Světlý nebo tmavý režim, přepnutí s kruhovým odhalením (View Transitions). */
function theme(dark: boolean, animate = true) {
  const html = document.documentElement
  if (html.classList.contains('theme-dark') === dark) return
  const flip = () => {
    html.classList.toggle('theme-dark', dark)
    html.classList.toggle('theme-light', !dark)
  }
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (animate && d.startViewTransition) d.startViewTransition(flip)
  else flip()
}

/* ---------- pomocníci scény (zastaví se, když přijde jiná scéna) ---------- */
function helpers(t: number) {
  const check = () => {
    if (t !== token) throw new Abort()
  }
  const wait = (ms: number) =>
    new Promise<void>((res, rej) => setTimeout(() => (t === token ? res() : rej(new Abort())), ms))

  const visible = (el: HTMLElement) => el.getClientRects().length > 0
  const find = async <E extends HTMLElement = HTMLElement>(sel: string, text?: string): Promise<E> => {
    for (let i = 0; i < 50; i++) {
      check()
      const all = [...document.querySelectorAll<E>(sel)].filter(visible)
      const el = text ? all.find((e) => norm(e.textContent).includes(norm(text))) : all[0]
      if (el) return el
      await wait(100)
    }
    throw new Abort()
  }
  const go = async (path: string) => {
    check()
    nav?.(path)
    await wait(700)
  }
  const scrollTo = async (y: number) => {
    window.scrollTo({ top: y, behavior: 'smooth' })
    await wait(750)
  }
  // prvek mimo obrazovku se nejdřív přiscrolluje
  const reveal = async (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    if (r.top < 70 || r.bottom > innerHeight - 24) await scrollTo(scrollY + r.top - innerHeight * 0.42)
  }
  const point = async (el: HTMLElement, dur = 0.7) => {
    await reveal(el)
    const r = el.getBoundingClientRect()
    const x = r.left + Math.min(r.width / 2, 120)
    const y = r.top + r.height / 2
    if (cursor) gsap.to(cursor, { x, y, autoAlpha: 1, duration: dur, ease: 'power3.inOut', overwrite: true })
    await wait(dur * 1000 + 80)
  }
  const tap = async (el: HTMLElement, dur?: number) => {
    await point(el, dur)
    ripple()
    el.click()
    await wait(260)
  }
  const type = async (input: HTMLInputElement, text: string) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    for (let i = 1; i <= text.length; i++) {
      set.call(input, text.slice(0, i))
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await wait(85 + Math.random() * 70)
    }
  }
  const key = (el: HTMLElement, k: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))
  const hover = (el: Element | null, on = true) => el?.classList.toggle('demo-hover', on)
  const hideCursor = () => cursor && gsap.to(cursor, { autoAlpha: 0, duration: 0.3 })

  return { wait, find, go, scrollTo, point, tap, type, key, hover, hideCursor }
}

type H = ReturnType<typeof helpers>

/* ---------- scény ---------- */
const SCENES: Record<Scene, (h: H) => Promise<void>> = {
  // hledání napříč videi i lekcemi, výběr šipkami a Enter otevře lekci
  async hledani({ go, find, point, type, key, wait, scrollTo }) {
    await go('/app/videa')
    const box = await find('.search')
    const input = await find<HTMLInputElement>('.search input')
    await point(input)
    ripple()
    box.classList.add('demo-focus')
    await wait(250)
    await type(input, 'kotvení')
    await wait(900)
    for (let i = 0; i < 4; i++) {
      key(input, 'ArrowDown')
      await wait(280)
    }
    await point(await find('.search-pop a.sel'), 0.5)
    await wait(300)
    ripple()
    key(input, 'Enter')
    box.classList.remove('demo-focus')
    await wait(1700)
    await scrollTo(240)
    await wait(1400)
  },

  // lekce: kapitoly ve videu (skok v přehrávači) a označení jako hotové
  async lekce({ go, find, tap, hover, wait }) {
    await go('/app/kurzy/zatepleni/gzl2szVtVQo')
    await tap(await find('.tab-btn', 'Kapitoly'))
    await wait(500)
    for (const i of [1, 2]) {
      const items = [...document.querySelectorAll<HTMLElement>('.moments li button')]
      const el = items[Math.min(i, items.length - 1)]
      hover(el)
      await tap(el)
      hover(el, false)
      await wait(900)
    }
    await tap(await find('.l-head .group .b'))
    await wait(1800)
  },

  // Kurzy: rozkoukané kurzy a pokračování jedním klepnutím
  async pokracovat({ go, find, point, tap, hover, wait }) {
    await go('/app/kurzy')
    await wait(700)
    const card = await find('.resume-card')
    hover(card)
    await point(card)
    await wait(500)
    await tap(card, 0.3)
    hover(card, false)
    await wait(2200)
  },

  // uložení videa na později: záložka, oznámení, počet v Uložených
  async ulozit({ go, find, point, tap, hover, wait }) {
    await go('/app/videa')
    await wait(400)
    const card = [...document.querySelectorAll<HTMLElement>('.vgrid .vcard')][1] ?? (await find('.vgrid .vcard'))
    hover(card)
    await point(card.querySelector<HTMLElement>('.thumb') ?? card)
    await wait(350)
    await tap(card.querySelector<HTMLElement>('.vcard-save') ?? card)
    await wait(1400)
    hover(card, false)
    await tap(await find('.sb-item[href$="/ulozene"], .tabbar a[href$="/ulozene"]'))
    await wait(2200)
  },

  // tmavý režim: celá aplikace se přebarví
  async tma({ go, find, tap, wait, scrollTo, hideCursor }) {
    await go('/app/kurzy/zatepleni')
    await wait(900)
    hideCursor()
    theme(true)
    await wait(1600)
    await scrollTo(300)
    await wait(600)
    await tap(await find('.chapter-head'))
    await wait(1800)
  },

  // telefon: lekce, kapitoly a seznam lekcí pod videem
  async mobil({ go, find, tap, wait, scrollTo }) {
    await go('/app/kurzy/zatepleni/Er5tVaQ3u2U')
    await wait(500)
    await tap(await find('.tab-btn', 'Kapitoly'))
    await wait(500)
    const items = [...document.querySelectorAll<HTMLElement>('.moments li button')]
    if (items[1]) await tap(items[1])
    await wait(1100)
    await scrollTo(document.documentElement.scrollHeight)
    await wait(1600)
    await scrollTo(0)
    await wait(800)
  },
}

/** Výchozí stav před každou scénou. */
function reset() {
  progress.restore()
  theme(false, false)
  document.querySelectorAll('.demo-hover, .demo-focus').forEach((el) => el.classList.remove('demo-hover', 'demo-focus'))
  window.scrollTo(0, 0)
}

const api = {
  /** Spustí scénu dokola, dokud web nepošle jinou. */
  async play(scene: Scene) {
    const t = ++token
    await isReady
    try {
      for (;;) {
        if (t !== token) return
        reset()
        await SCENES[scene](helpers(t))
        await helpers(t).wait(2200)
      }
    } catch (e) {
      if (!(e instanceof Abort)) console.error(e)
    }
  },
  /** Bez animací (omezit pohyb): jen ukáže obrazovku scény. */
  async show(path: string) {
    token++
    await isReady
    reset()
    nav?.(path)
  },
  stop() {
    token++
    if (cursor) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 })
  },
}

;(window as unknown as { zofiDemo: typeof api }).zofiDemo = api

/** Napojí router aplikace a připraví kurzor (volá main.tsx). */
export function attach(n: NavigateFunction, isTouch: boolean) {
  nav = n
  touch = isTouch
  makeCursor()
  markReady()
  return () => {
    nav = null
  }
}
