import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Check, Play } from 'lucide-react'
import { Thumb } from '../components/Thumb'
import { courseLessons, courseOf, fmtDuration, courseSecs, course, videoHref, vid } from '../data/catalog'
import { scrollToTarget } from '../lib/smooth-scroll'
import { STOPS, type Stop } from './tour'
import rez2560 from '../assets/renders/rez-fasady-2560.webp'
import rez1280 from '../assets/renders/rez-fasady-1280.webp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const AR = 16 / 9
const N = STOPS.length
const UNITS = N + 2 // úvod, zastávky, závěr

/** Prohlídka skutečného renderu řezu fasádou: kamera jede vrstvu po vrstvě a u každé ukáže lekci. */
export function FacadeTour() {
  const ref = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [active, setActive] = useState(-1)
  const main = course('zatepleni')!

  useGSAP(
    () => {
      if (still) return
      const pin = ref.current?.querySelector<HTMLElement>('.tour-pin')
      const cam = ref.current?.querySelector<HTMLElement>('.tour-cam')
      if (!pin || !cam) return

      // obrázek pokryje celé okno (jako object-fit: cover)
      const box = () => {
        const vw = pin.clientWidth
        const vh = pin.clientHeight
        const W = Math.max(vw, vh * AR)
        const H = W / AR
        return { vw, vh, W, H, ox: (vw - W) / 2, oy: (vh - H) / 2, wide: vw >= 900 }
      }
      const layout = () => {
        const b = box()
        Object.assign(cam.style, { width: `${b.W}px`, height: `${b.H}px`, left: `${b.ox}px`, top: `${b.oy}px` })
      }
      // posun a přiblížení tak, aby zastávka byla v ohnisku (vpravo od panelu, na mobilu nad kartou)
      const frame = (s: Stop | null) => {
        const b = box()
        if (!s) return { x: 0, y: 0, scale: 1 }
        const z = b.wide ? s.z : 1 + (s.z - 1) * 0.55
        const fx = b.wide ? b.vw * 0.66 : b.vw * 0.5
        const fy = b.wide ? b.vh * 0.5 : b.vh * 0.33
        const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
        return {
          x: clamp(fx - b.ox - z * s.x * b.W, b.vw - b.ox - z * b.W, -b.ox),
          y: clamp(fy - b.oy - z * s.y * b.H, b.vh - b.oy - z * b.H, -b.oy),
          scale: z,
        }
      }
      layout()
      ScrollTrigger.addEventListener('refreshInit', layout)

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onUpdate: () => {
          cam.style.setProperty('--z', String(gsap.getProperty(cam, 'scale')))
          const u = tl.progress() * UNITS
          setActive(u < 1 ? -1 : u >= 1 + N ? N : Math.floor(u - 1))
        },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: `+=${UNITS * 80}%`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      st.current = tl.scrollTrigger ?? null
      tl.to('.tour-intro', { opacity: 0, y: -40, duration: 0.45, ease: 'power1.in' }, 0.35)
        .fromTo('.tour-panel', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4 }, 0.75)
      STOPS.forEach((s, i) => {
        tl.to(cam, { x: () => frame(s).x, y: () => frame(s).y, scale: () => frame(s).scale, duration: 0.75 }, 1 + i)
      })
      tl.to(cam, { x: 0, y: 0, scale: 1, duration: 0.75 }, 1 + N)
        .to('.tour-panel', { opacity: 0, x: -30, duration: 0.3 }, 1 + N)
        .fromTo('.tour-outro', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 1.45 + N)
        .fromTo('.tour-bar i', { scaleX: 0 }, { scaleX: 1, duration: UNITS, ease: 'none' }, 0)
        .set({}, {}, UNITS)

      // jemný 3D náklon za myší
      const mm = gsap.matchMedia()
      mm.add('(hover: hover)', () => {
        const tilt = ref.current?.querySelector<HTMLElement>('.tour-tilt')
        if (!tilt) return
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'power3.out' })
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          ry((e.clientX / window.innerWidth - 0.5) * 3)
          rx(-(e.clientY / window.innerHeight - 0.5) * 2.4)
        }
        pin.addEventListener('pointermove', onMove)
        return () => pin.removeEventListener('pointermove', onMove)
      })

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', layout)
        mm.revert()
        st.current = null
      }
    },
    { scope: ref, dependencies: [still] },
  )

  // klik na vrstvu dojede na její zastávku
  const jump = (i: number) => {
    const s = st.current
    if (!s) return
    scrollToTarget(s.start + ((s.end - s.start) * (1.8 + i)) / UNITS, 0)
  }

  const cur = active >= 0 && active < N ? STOPS[active] : null

  return (
    <section ref={ref} id="vrstvy" className={`tour dark${still ? ' tour-still' : ''}`}>
      <div className="tour-pin">
        <div className="tour-media">
          <div className="tour-tilt">
            <div className="tour-cam">
              <img
                src={rez2560}
                srcSet={`${rez1280} 1280w, ${rez2560} 2560w`}
                sizes="(max-width: 700px) 200vw, 100vw"
                alt="Řez zateplenou fasádou: zdivo, izolant s hmoždinkou, síťovina ve stěrce, omítka a sokl"
                loading="lazy"
                decoding="async"
              />
              {STOPS.map((s, i) => (
                <button
                  key={s.n}
                  className={`tour-dot${i === active ? ' on' : i < active ? ' done' : ''}`}
                  style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
                  onClick={() => jump(i)}
                  aria-label={`${i + 1}. ${s.n}`}
                  tabIndex={-1}
                >
                  <span>{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="tour-shade" aria-hidden />
        </div>

        <div className="tour-intro wrap">
          <span className="eyebrow">Fasáda vrstvu po vrstvě</span>
          <h2 className="h2">Podívejte se fasádě pod kůži.</h2>
          <p className="lead">
            Sedm vrstev, na kterých záleží. Ke každé máme v akademii lekci natočenou na skutečné stavbě.
          </p>
        </div>

        <aside className="tour-panel" aria-label="Vrstvy fasády">
          <span className="eyebrow">Fasáda vrstvu po vrstvě</span>
          <ol>
            {STOPS.map((s, i) => (
              <li key={s.n} className={i === active ? 'on' : i < active ? 'done' : ''}>
                <button className="tour-step" onClick={() => jump(i)}>
                  <span className="ln">{i < active ? <Check strokeWidth={3} /> : i + 1}</span>
                  {s.n}
                </button>
                <div className="tour-more">
                  <div>
                    <p>{s.t}</p>
                    <Lessons ids={s.lessons} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        {/* mobil: jen aktuální vrstva */}
        <div className={`tour-card${cur ? ' on' : ''}`} aria-live="polite">
          {cur && (
            <>
              <span className="ln">
                {active + 1} / {N}
              </span>
              <h3>{cur.n}</h3>
              <p>{cur.t}</p>
              <Lessons ids={cur.lessons.slice(0, 1)} />
            </>
          )}
        </div>

        <div className="tour-outro wrap">
          <h2 className="h2">Celá fasáda. {courseLessons(main).length} lekcí.</h2>
          <p className="lead">
            Kurz {main.title} vás provede všemi vrstvami v pořadí, v jakém se na stavbě opravdu pracuje. Celkem{' '}
            {fmtDuration(courseSecs(main))} videa.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-lg" to={`/app/kurzy/${main.id}`}>
              Prohlédnout kurz <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>

        <div className="tour-bar" aria-hidden>
          <i />
        </div>
      </div>

      {/* bez animací: celý řez a seznam vrstev s lekcemi */}
      {still && (
        <div className="wrap tour-list">
          {STOPS.map((s, i) => (
            <div key={s.n}>
              <b>
                {i + 1}. {s.n}
              </b>
              <p>{s.t}</p>
              <Lessons ids={s.lessons} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/** Odkazy na lekce k vrstvě: náhled, pořadí v kurzu a délka. */
function Lessons({ ids }: { ids: string[] }) {
  return (
    <div className="tour-lessons">
      {ids.map((id) => {
        const x = vid(id)
        if (!x) return null
        const c = courseOf(id)
        return (
          <Link key={id} className="tour-lesson" to={videoHref(id)}>
            <span className="thumb">
              <Thumb video={x} size="sm" />
              <span className="tl-play">
                <Play fill="currentColor" strokeWidth={0} />
              </span>
            </span>
            <span>
              <small>
                {c ? `Lekce ${courseLessons(c).indexOf(id) + 1} · ${c.short}` : 'Video'} · {x.d}
              </small>
              <b>{x.t}</b>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
