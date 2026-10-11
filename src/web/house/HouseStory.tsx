import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Check, ChevronDown, Play } from 'lucide-react'
import SplitText from '../../components/reactbits/SplitText'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { PLANS, newest, videoHref } from '../../data/catalog'
import { cz } from '../../lib/czech'
import { goTo, scrollToTarget } from '../../lib/smooth-scroll'
import { LAYERS } from './steps'
import { STEPS, UNITS } from './model'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// three.js je velký, načte se až po vykreslení úvodu
const HouseScene = lazy(() => import('./HouseScene'))
const INTRO = '7DFgjeVmT1Y'

/** Úvod webu: 3D dům, který se při scrollu zateplí vrstvu po vrstvě. */
export function HouseStory() {
  const ref = useRef<HTMLElement>(null)
  // Bez animací (systémové „omezit pohyb“) se ukáže rovnou hotový dům.
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const progress = useRef(still ? 1 : 0)
  const pointer = useRef({ x: 0, y: 0 })
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(-1)
  const [visible, setVisible] = useState(true)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1000px)').matches)
  const fresh = newest()[0]

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1000px)')
    const onMq = () => setWide(mq.matches)
    mq.addEventListener('change', onMq)
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (ref.current) io.observe(ref.current)
    return () => {
      mq.removeEventListener('change', onMq)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [])

  useGSAP(
    () => {
      if (still) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.story-pin',
          start: 'top top',
          end: `+=${UNITS * 70}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress
            const u = self.progress * UNITS
            setActive(u < 0.85 ? -1 : u > UNITS - 0.75 ? STEPS : Math.min(STEPS - 1, Math.max(0, Math.floor(u - 1))))
          },
        },
      })
      st.current = tl.scrollTrigger ?? null
      tl.to('.story-intro', { opacity: 0, y: -90, filter: 'blur(8px)', duration: 0.6 }, 0.08)
        .to('.story-hint', { opacity: 0, duration: 0.2 }, 0)
        .fromTo('.story-panel', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4 }, 0.75)
        .to('.story-panel', { opacity: 0, x: -40, duration: 0.35 }, UNITS - 0.95)
        .fromTo('.story-outro', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, UNITS - 0.7)
        .fromTo('.story-bar i', { scaleY: 0 }, { scaleY: 1, duration: UNITS }, 0)
        .set({}, {}, UNITS)
      return () => {
        st.current = null
      }
    },
    { scope: ref, dependencies: [still] },
  )

  // Klik na vrstvu dojede na její místo v příběhu.
  const jump = (k: number) => {
    const s = st.current
    if (!s) return
    scrollToTarget(s.start + ((s.end - s.start) * (k + 1.5)) / UNITS, 0)
  }

  return (
    <section ref={ref} id="vrstvy" className={`story${still ? ' story-still' : ''}`}>
      <div className="story-pin">
        <div className="story-bg" aria-hidden />
        <div className="story-canvas" aria-hidden>
          <Suspense fallback={null}>
            <HouseScene progress={progress} pointer={pointer} wide={wide} active={visible} />
          </Suspense>
        </div>

        <div className="story-intro wrap">
          {fresh && (
            <Link className="hero-pill" to={videoHref(fresh.v)}>
              <b>Nové</b>
              <span>{fresh.t}</span>
              <ArrowRight aria-hidden />
            </Link>
          )}
          <h1 className="hero-title">
            <SplitText
              tag="span"
              className="l1"
              text={cz('Fasáda se dělá jednou.')}
              splitType="words"
              delay={80}
              duration={1.3}
              ease="expo.out"
              from={{ opacity: 0, y: 48, filter: 'blur(12px)' }}
              to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              threshold={0}
              rootMargin="0px"
            />
            <SplitText
              tag="span"
              className="l2"
              text={cz('Udělejte ji pořádně.')}
              splitType="words"
              delay={80}
              duration={1.3}
              ease="expo.out"
              from={{ opacity: 0, y: 48, filter: 'blur(12px)' }}
              to={{ opacity: 1, y: 0, filter: 'blur(0px)', delay: 0.28 }}
              threshold={0}
              rootMargin="0px"
            />
          </h1>
          <p className="hero-sub">
            Videokurzy zateplení natočené na skutečných stavbách ZOFI. Od podkladu po poslední zatočení omítky.
          </p>
          <div className="hero-cta">
            <ShimmerButton
              className="shimmer-cta"
              background="#e62152"
              shimmerColor="#ffd2dd"
              shimmerDuration="2.6s"
              onClick={goTo('#cenik')}
            >
              Předplatit od {PLANS.rok.monthly} Kč měsíčně
            </ShimmerButton>
            <Link className="btn btn-lg btn-ghost btn-blur" to={videoHref(INTRO)}>
              <Play aria-hidden fill="currentColor" />
              Pustit úvod zdarma
            </Link>
          </div>
        </div>

        <div className="story-hint" aria-hidden>
          Scrollujte a sledujte, jak se dům zateplí
          <ChevronDown />
        </div>

        <aside className="story-panel" aria-label="Vrstvy fasády">
          <span className="eyebrow">Fasáda ve vrstvách</span>
          <h2>Sedm vrstev. Každá musí sedět.</h2>
          <ol>
            {LAYERS.map((l, i) => (
              <li key={l.n} className={i === active ? 'on' : i < active ? 'done' : ''} onClick={() => jump(i)}>
                <span className="ln">{i < active ? <Check strokeWidth={3} /> : String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>
                    {l.n} <small>{l.mm}</small>
                  </h3>
                  <div className="desc">
                    <div>
                      <p>{l.t}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        {/* mobil: jen aktuální vrstva */}
        <div className={`story-card${active >= 0 && active < STEPS ? ' on' : ''}`} aria-live="polite">
          {active >= 0 && active < STEPS && (
            <>
              <span className="ln">
                {String(active + 1).padStart(2, '0')} / {String(STEPS).padStart(2, '0')}
              </span>
              <h3>{LAYERS[active].n}</h3>
              <p>{LAYERS[active].t}</p>
            </>
          )}
        </div>

        <div className="story-outro">
          <h2 className="h2">Hotová fasáda.</h2>
          <p className="lead">
            Přesně takhle ji v akademii projdete. Vrstvu po vrstvě, lekci po lekci, natočené na skutečné stavbě.
          </p>
          <div className="hero-cta">
            <a className="btn btn-lg" href="#kurzy" onClick={goTo('#kurzy')}>
              Prohlédnout kurzy
            </a>
          </div>
        </div>

        <div className="story-bar" aria-hidden>
          <i />
        </div>
      </div>

      {/* bez animací: seznam vrstev pod hotovým domem */}
      {still && (
        <div className="wrap story-list-static">
          <h2 className="h2">Sedm vrstev. Každá musí sedět.</h2>
          <ol>
            {LAYERS.map((l, i) => (
              <li key={l.n}>
                <b>
                  {String(i + 1).padStart(2, '0')} {l.n}
                </b>{' '}
                {l.t}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
