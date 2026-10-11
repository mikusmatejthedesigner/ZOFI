import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Bookmark, GraduationCap, ListVideo, Moon, Search, Smartphone } from 'lucide-react'
import type { Scene } from '../demo/director'
import { scrollToTarget } from '../lib/smooth-scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Demo = { play: (s: Scene) => void; show: (path: string) => void; stop: () => void }

const STEPS: { scene: Scene; icon: typeof Search; t: string; d: string }[] = [
  {
    scene: 'hledani',
    icon: Search,
    t: 'Najdete cokoli za vteřinu.',
    d: 'Hledání projde videa i lekce všech kurzů. Napíšete „kotvení“ a máte všechno pohromadě.',
  },
  {
    scene: 'lekce',
    icon: ListVideo,
    t: 'Kapitoly a hlavní body u každé lekce.',
    d: 'Klepnete na kapitolu a video skočí přesně tam. Další lekce je hned vedle.',
  },
  {
    scene: 'pokracovat',
    icon: GraduationCap,
    t: 'Pokračujete tam, kde jste skončili.',
    d: 'Na úvodní obrazovce čekají rozkoukané kurzy. Jedno klepnutí a jedete dál.',
  },
  {
    scene: 'ulozit',
    icon: Bookmark,
    t: 'Detaily si uložíte na stavbu.',
    d: 'Video uložíte jedním klepnutím. V Knihovně ho pak máte po ruce i na lešení.',
  },
  {
    scene: 'tma',
    icon: Moon,
    t: 'Spousta videí, čisté prostředí.',
    d: 'Videa v přehledných řadách, které rostou s obsahem. Světlý i tmavý režim podle zařízení.',
  },
  {
    scene: 'mobil',
    icon: Smartphone,
    t: 'A celé to máte v telefonu.',
    d: 'Stejná aplikace v počítači, tabletu i telefonu. Lekce, kapitoly i průběh.',
  },
]
const N = STEPS.length
const LAPTOP = { w: 1200, h: 750 }
const PHONE = { w: 390, h: 844 }
const src = (touch: boolean, start: string) =>
  `${import.meta.env.BASE_URL}demo.html?start=${encodeURIComponent(start)}${touch ? '&touch=1' : ''}`

/** Počká, až se v okně načte ukázka a nabídne ovládání. */
function demoOf(frame: HTMLIFrameElement | null): Promise<Demo> {
  return new Promise((resolve) => {
    let tries = 0
    const tick = () => {
      const d = (frame?.contentWindow as (Window & { zofiDemo?: Demo }) | null)?.zofiDemo
      if (d) resolve(d)
      else if (++tries < 200) setTimeout(tick, 120)
    }
    tick()
  })
}

/** Okno se ukázkou zmenšené na šířku rodiče. */
function Screen({ size, touch, load, start, frameRef }: {
  size: { w: number; h: number }
  touch: boolean
  load: boolean
  start: string
  frameRef: RefObject<HTMLIFrameElement | null>
}) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / size.w))
    ro.observe(el)
    return () => ro.disconnect()
  }, [size.w])
  // výška okna se mění se šířkou: přepočítat připnuté sekce
  useEffect(() => {
    const r = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(r)
  }, [scale])
  return (
    <div ref={box} className="atour-screen" style={{ height: size.h * scale }}>
      {load && (
        <iframe
          ref={frameRef}
          src={src(touch, start)}
          title="Ukázka aplikace Fasádní akademie"
          width={size.w}
          height={size.h}
          style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}
          tabIndex={-1}
          aria-hidden
        />
      )}
    </div>
  )
}

/** Aplikace naživo: skutečná aplikace v okně, kterou při scrollu ovládá kurzor. */
export function AppTour() {
  const ref = useRef<HTMLElement>(null)
  const laptop = useRef<HTMLIFrameElement>(null)
  const phone = useRef<HTMLIFrameElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const onMq = () => setWide(mq.matches)
    mq.addEventListener('change', onMq)
    const el = ref.current
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1200px' })
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    if (el) {
      pre.observe(el)
      io.observe(el)
    }
    return () => {
      mq.removeEventListener('change', onMq)
      pre.disconnect()
      io.disconnect()
    }
  }, [])

  // aktivní scéna se přehraje v příslušném okně, mimo obrazovku se ukázka zastaví
  useEffect(() => {
    if (!near) return
    let cancelled = false
    const scene = STEPS[active].scene
    const onPhone = !wide || scene === 'mobil'
    Promise.all([wide ? demoOf(laptop.current) : null, demoOf(phone.current)]).then(([lap, ph]) => {
      if (cancelled) return
      if (still) {
        lap?.show('/app/kurzy/zatepleni/gzl2szVtVQo')
        ph.show('/app/kurzy/zatepleni/Er5tVaQ3u2U')
        return
      }
      if (!inView) {
        lap?.stop()
        ph.stop()
        return
      }
      if (onPhone) {
        ph.play(scene)
        // stejná lekce v notebooku i v telefonu
        lap?.show('/app/kurzy/zatepleni/Er5tVaQ3u2U')
      } else {
        lap?.play(scene)
        ph.stop()
      }
    })
    return () => {
      cancelled = true
    }
  }, [active, near, inView, wide, still])

  useGSAP(
    () => {
      if (still) return
      const pin = ref.current?.querySelector<HTMLElement>('.atour-pin')
      if (!pin) return
      const trigger = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: `+=${N * 95}%`,
        pin: true,
        onUpdate: (s) => {
          const u = s.progress * N
          const i = Math.min(N - 1, Math.floor(u))
          setActive(i)
          pin.style.setProperty('--step', String(Math.min(1, u - i)))
        },
      })
      st.current = trigger
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.atour-laptop',
          { rotateX: 16, y: 80, scale: 0.92 },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top top', scrub: 0.6 },
          },
        )
      })
      return () => {
        mm.revert()
        st.current = null
      }
    },
    { scope: ref, dependencies: [still] },
  )

  const jump = (i: number) => {
    const s = st.current
    if (!s) return setActive(i)
    scrollToTarget(s.start + ((s.end - s.start) * (i + 0.15)) / N, 0)
  }

  const step = STEPS[active]
  return (
    <section ref={ref} id="aplikace" className={`atour${still ? ' atour-still' : ''}`}>
      <div className="atour-pin">
        <div className="wrap atour-grid">
          <div className="atour-copy">
            <span className="eyebrow">Aplikace naživo</span>
            <h2 className="h2">Podívejte se dovnitř.</h2>
            <p className="atour-note">
              <span className="live-dot" aria-hidden /> Tohle není video. Je to skutečná aplikace, kterou právě ovládá
              kurzor.
            </p>
            <ol className="atour-steps">
              {STEPS.map((s, i) => (
                <li key={s.scene} className={i === active ? 'on' : i < active ? 'done' : ''}>
                  <button onClick={() => jump(i)}>
                    <s.icon aria-hidden />
                    <span>{s.t}</span>
                  </button>
                  <div className="atour-more">
                    <div>
                      <p>{s.d}</p>
                    </div>
                  </div>
                  <i className="atour-fill" aria-hidden />
                </li>
              ))}
            </ol>
          </div>

          <div className={`atour-stage${wide && step.scene === 'mobil' ? ' phone-on' : ''}`}>
            {wide && (
              <div className="atour-laptop device">
                <div className="device-bar" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <span className="device-url">akademie.zofi.cz</span>
                </div>
                <Screen size={LAPTOP} touch={false} load={near} start="/app" frameRef={laptop} />
              </div>
            )}
            <div className="atour-phone">
              <div className="phone-frame">
                <div className="phone-status" aria-hidden>
                  <b>9:41</b>
                  <span className="phone-island" />
                  <span className="phone-icons">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <Screen size={PHONE} touch load={near} start="/app" frameRef={phone} />
              </div>
            </div>
            {/* mobil: text aktuálního kroku pod telefonem */}
            <div className="atour-caption" aria-live="polite">
              <b>{step.t}</b>
              <p>{step.d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
