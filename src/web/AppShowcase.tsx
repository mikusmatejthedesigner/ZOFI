import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Check, House, LayoutGrid, Lock, Play, UserRound } from 'lucide-react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Logo } from '../components/Logo'
import { Thumb } from '../components/Thumb'
import { COURSES, courseLessons, vid } from '../data/catalog'

/** Ukázka aplikace: okno se při scrollu narovná a za myší se jemně naklání ve 3D. */
export function AppShowcase() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.device-tilt',
          { rotateX: 28, scale: 0.86, y: 60 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top 95%', end: 'top 20%', scrub: 0.6 },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
          gsap.to(el, {
            y: () => -window.innerHeight * Number(el.dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })
      // naklánění za myší (jen myš, ne dotyk)
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const stage = ref.current?.querySelector<HTMLElement>('.hero-stage')
        const dev = ref.current?.querySelector<HTMLElement>('.device')
        if (!stage || !dev) return
        const rx = gsap.quickTo(dev, 'rotationX', { duration: 0.8, ease: 'power3.out' })
        const ry = gsap.quickTo(dev, 'rotationY', { duration: 0.8, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 9)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 7)
        }
        const onLeave = () => {
          rx(0)
          ry(0)
        }
        stage.addEventListener('pointermove', onMove)
        stage.addEventListener('pointerleave', onLeave)
        return () => {
          stage.removeEventListener('pointermove', onMove)
          stage.removeEventListener('pointerleave', onLeave)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="aplikace-ukazka" className="sec showcase">
      <div className="wrap sec-head center" data-reveal>
        <span className="eyebrow">Aplikace</span>
        <h2 className="h2">Celá stavba v jedné aplikaci.</h2>
        <p className="lead">
          Kurzy v pořadí, v jakém se staví. Rozkoukaná lekce na první obrazovce. V počítači, tabletu i telefonu.
        </p>
      </div>
      <div className="hero-stage">
        <div className="hero-glow" aria-hidden />
        <div className="device-wrap">
          <div className="device-tilt">
            <div className="device">
              <div className="device-bar" aria-hidden>
                <i />
                <i />
                <i />
                <span className="device-url">
                  <Lock /> akademie.zofi.cz
                </span>
              </div>
              <AppPreview />
              <BorderBeam size={260} duration={9} colorFrom="#e62152" colorTo="#ffb020" borderWidth={2} />
            </div>
          </div>
        </div>

        <div className="chip chip-a" data-speed="0.16" aria-hidden>
          <span className="chip-ico">
            <Check strokeWidth={3} />
          </span>
          <span>
            <b>Lekce dokončena</b>
            <small>Příprava břízolitového podkladu</small>
          </span>
        </div>
        <div className="chip chip-b" data-speed="0.3" aria-hidden>
          <b>Kapitoly ve videu</b>
          <ol>
            <li>
              <span>0:00</span>Příprava lepicího tmelu
            </li>
            <li className="on">
              <span>0:58</span>Obvodový pruh a terče
            </li>
            <li>
              <span>1:50</span>Přiložení desky
            </li>
            <li>
              <span>2:35</span>Kontrola roviny latí
            </li>
          </ol>
        </div>
        <div className="chip chip-c" data-speed="0.22" aria-hidden>
          <span className="chip-ico" style={{ background: 'var(--red)' }}>
            <Play fill="currentColor" />
          </span>
          <span>
            <b>Pokračovat · Lekce 4 z 10</b>
            <small>Zateplení krok za krokem</small>
          </span>
        </div>
      </div>
    </section>
  )
}

/** Statický náhled aplikace v okně prohlížeče, zmenšený na šířku stránky. */
function AppPreview() {
  const outer = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1200)

  useLayoutEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Na úzkém displeji bez postranního panelu, aby byl náhled čitelný.
  const compact = width < 640
  const design = compact ? 820 : 1200
  const scale = width / design

  const cont = vid('Er5tVaQ3u2U')!
  const rings = [40, 22, 8]

  return (
    <div ref={outer} className="preview" style={{ height: (compact ? 600 : 740) * scale }} aria-hidden inert>
      <div
        className={`preview-inner${compact ? ' compact' : ''}`}
        style={{ width: design, transform: `scale(${scale})` }}
      >
        <aside className="pv-side">
          <div className="pv-logo">
            <Logo />
            <span>Akademie</span>
          </div>
          <div className="pv-search">Hledat</div>
          <div className="pv-item on">
            <House /> Domů
          </div>
          <div className="pv-item">
            <LayoutGrid /> Kurzy
          </div>
          <div className="pv-item">
            <UserRound /> Účet
          </div>
          <div className="pv-label">Moje kurzy</div>
          {COURSES.map((c, i) => (
            <div className="pv-item" key={c.id}>
              <span className="pv-ring" style={{ '--p': rings[i] } as CSSProperties} />
              {c.short}
            </div>
          ))}
        </aside>
        <div className="pv-main">
          <div className="pv-date">Sobota 10. října</div>
          <div className="pv-hello">Dobrý večer, Jane.</div>
          <div className="pv-hero">
            <Thumb video={cont} size="lg" eager />
            <div className="pv-hero-in">
              <small>Pokračovat · Lekce 4 z 10</small>
              <h4>{cont.t}</h4>
              <p>Zateplení krok za krokem · Izolant a kotvení</p>
              <div className="pv-bar">
                <i />
              </div>
              <span className="pv-btn">
                <Play fill="currentColor" /> Pokračovat
              </span>
            </div>
          </div>
          <div className="pv-row-title">Moje kurzy</div>
          <div className="pv-cards">
            {COURSES.map((c, i) => (
              <div className="pv-card" key={c.id}>
                <div className="thumb">
                  <Thumb video={vid(c.cover)!} eager />
                </div>
                <b>{c.short}</b>
                <small>
                  {Math.round((rings[i] / 100) * courseLessons(c).length)} z {courseLessons(c).length} lekcí
                </small>
                <div className="bar">
                  <i style={{ width: `${rings[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
