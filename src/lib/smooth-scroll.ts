import type { MouseEvent } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Plynulé scrollování (Lenis) řízené tickerem GSAP, aby ScrollTrigger držel krok. */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const instance = new Lenis({ anchors: false })
  lenis = instance
  instance.on('scroll', ScrollTrigger.update)

  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

/** Posune stránku na prvek, plynule přes Lenis, nebo nativně. */
export function scrollToTarget(target: string | HTMLElement | number, offset = -64) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' })
  else if (el instanceof HTMLElement)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

/** Klik na kotvu (#cenik) posune stránku plynule a nezmění URL. */
export const goTo = (target: string | number) => (e: MouseEvent) => {
  e.preventDefault()
  scrollToTarget(target, typeof target === 'number' ? 0 : -64)
}
