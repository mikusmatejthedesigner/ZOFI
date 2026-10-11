/* React Bits: SplitText (github.com/DavidHDev/react-bits, MIT + Commons Clause)
   Upraveno pro ZOFI: bez ořezu přes overflow (háčky a čárky), skryté do rozdělení,
   respektuje „omezit pohyb“ a dovoluje vlastní styl. */
import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP)

export interface SplitTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  ease?: string | ((t: number) => number)
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  rootMargin?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  textAlign?: React.CSSProperties['textAlign']
  onLetterAnimationComplete?: () => void
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  style,
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign,
  tag = 'p',
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null)
  const animationCompletedRef = useRef(false)
  const onCompleteRef = useRef(onLetterAnimationComplete)
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(() => document.fonts.status === 'loaded')

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete
  }, [onLetterAnimationComplete])

  useEffect(() => {
    if (!fontsLoaded) document.fonts.ready.then(() => setFontsLoaded(true))
  }, [fontsLoaded])

  useGSAP(
    () => {
      const el = ref.current as (HTMLElement & { _rbsplitInstance?: GSAPSplitText }) | null
      if (!el || !text) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || animationCompletedRef.current) {
        el.classList.add('is-split')
        return
      }
      if (!fontsLoaded) return

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert()
        } catch {
          /* už vráceno */
        }
        el._rbsplitInstance = undefined
      }

      const startPct = (1 - threshold) * 100
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px'
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`
      const start = `top ${startPct}%${sign}`
      let targets: Element[] = []
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars
        if (!targets.length && splitType.includes('words') && self.words.length) targets = self.words
        if (!targets.length && splitType.includes('lines') && self.lines.length) targets = self.lines
        if (!targets.length) targets = self.chars || self.words || self.lines
      }
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self)
          el.classList.add('is-split')
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: { trigger: el, start, once: true, fastScrollEnd: true },
              onComplete: () => {
                animationCompletedRef.current = true
                onCompleteRef.current?.()
              },
              willChange: 'transform, opacity',
              force3D: true,
            },
          )
        },
      })
      el._rbsplitInstance = splitInstance
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill()
        })
        try {
          splitInstance.revert()
        } catch {
          /* už vráceno */
        }
        el._rbsplitInstance = undefined
      }
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: ref,
    },
  )

  // pevný typ značky: obecný ElementType rozbíjí typy JSX z React Three Fiber
  const Tag = tag as 'p'
  return (
    <Tag ref={ref as React.RefObject<HTMLParagraphElement>} style={{ textAlign, ...style }} className={`split-parent ${className}`}>
      {text}
    </Tag>
  )
}

export default SplitText
