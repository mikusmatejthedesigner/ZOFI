import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { initSmoothScroll } from './lib/smooth-scroll'

gsap.registerPlugin(useGSAP)

export default function App() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => initSmoothScroll(), [])

  useGSAP(
    () => {
      gsap.from('[data-intro]', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 })
    },
    { scope: root },
  )

  return (
    <main ref={root} style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <h1 data-intro style={{ fontSize: 'clamp(40px, 7vw, 80px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
          Fasádní akademie ZOFI
        </h1>
        <p data-intro style={{ color: 'var(--ink-2)', marginTop: 16 }}>
          Základ projektu je připravený: React, GSAP a Lenis.
        </p>
      </div>
    </main>
  )
}
