import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Check, House, LayoutGrid, Lock, Play, UserRound } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText'
import Magnet from '../components/reactbits/Magnet'
import { Logo } from '../components/Logo'
import { Thumb } from '../components/Thumb'
import { COURSES, PLANS, courseLessons, newest, vid } from '../data/catalog'
import { cz } from '../lib/czech'
import { goTo } from '../lib/smooth-scroll'

const INTRO = '7DFgjeVmT1Y'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const fresh = newest()[0]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero-pill', { y: 16, opacity: 0, duration: 1 }, 0.1)
          .from(['.hero-sub', '.hero-cta', '.hero-meta'], { y: 24, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.55)
          .from('.hero-stage', { y: 120, opacity: 0, duration: 1.8 }, 0.75)

        // Okno aplikace se při scrollu narovná (Apple styl).
        gsap.fromTo(
          '.device',
          { rotateX: 24, scale: 0.9 },
          {
            rotateX: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top 92%', end: 'top 12%', scrub: 0.6 },
          },
        )
        // Štítky kolem okna plují různou rychlostí.
        gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
          gsap.to(el, {
            y: () => -window.innerHeight * Number(el.dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="hero" id="top">
      <div className="wrap">
        {fresh && (
          <Link className="hero-pill" to={`/app/lekce/${fresh.v}`}>
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
          Videokurzy zateplení natočené na skutečných stavbách ZOFI. Od lešení po poslední zatočení omítky, v pořadí, v
          jakém se opravdu staví.
        </p>
        <div className="hero-cta">
          <Magnet padding={40} magnetStrength={7}>
            <a className="btn btn-lg" href="#cenik" onClick={goTo('#cenik')}>
              Předplatit od {PLANS.rok.monthly} Kč měsíčně
            </a>
          </Magnet>
          <Link className="btn btn-lg btn-ghost" to={`/app/lekce/${INTRO}`}>
            <Play aria-hidden fill="currentColor" />
            Pustit úvod zdarma
          </Link>
        </div>
        <div className="hero-meta">
          <span>
            <Check aria-hidden /> Natočeno na stavbě, ne ve studiu
          </span>
          <span>
            <Check aria-hidden /> V počítači i v mobilu
          </span>
          <span>
            <Check aria-hidden /> Zrušíte kdykoliv
          </span>
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-glow" aria-hidden />
        <div className="device-wrap">
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
