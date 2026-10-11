/* React Bits: ScrollReveal (github.com/DavidHDev/react-bits, MIT + Commons Clause)
   Upraveno pro ZOFI: platný HTML obal, úklid jen vlastních animací, „omezit pohyb“. */
import React, { useRef, useMemo, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ScrollRevealProps {
  children: ReactNode
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    // nezlomitelná mezera slova nedělí (české předložky)
    return text.split(/([^\S\u00a0]+)/).map((word, index) => {
      if (word.match(/^[^\S\u00a0]+$/)) return word
      return (
        <span className="word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: { trigger: el, start: 'top bottom', end: rotationEnd, scrub: true },
          },
        )
        const words = el.querySelectorAll<HTMLElement>('.word')
        gsap.fromTo(
          words,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
          },
        )
        if (enableBlur) {
          gsap.fromTo(
            words,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'none',
              filter: 'blur(0px)',
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
            },
          )
        }
      })
      return () => mm.revert()
    },
    {
      scope: containerRef,
      dependencies: [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength],
    },
  )

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </div>
  )
}

export default ScrollReveal
