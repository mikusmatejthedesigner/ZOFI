import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Bookmark, Check, GraduationCap, Heart, Lock, Play, PlaySquare, Search } from 'lucide-react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import SplitText from '../components/reactbits/SplitText'
import { Logo } from '../components/Logo'
import { Thumb } from '../components/Thumb'
import { COURSES, FEED_COUNT, PLANS, courseLessons, feed, fmtAgo, fmtTime, lessonInfo, videoHref } from '../data/catalog'
import { TOPICS } from '../data/feed'
import { cz } from '../lib/czech'
import { goTo } from '../lib/smooth-scroll'
import talirDrevostavba from '../assets/renders/talir-drevostavba-800.webp'
import talirRender from '../assets/renders/talir-zofitherm.webp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// three.js je velký, načte se až po vykreslení úvodu
const WasherScene = lazy(() => import('./washer/WasherScene'))
const INTRO = '7DFgjeVmT1Y'
// rozkoukaná lekce na štítcích u okna: Lepení šedého polystyrenu (lekce 4)
const RESUME = 'Er5tVaQ3u2U'

/** Umí prohlížeč WebGL? Bez něj se místo 3D ukáže render. */
function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Úvod webu: nabídka a aplikace v okně, ze které vystupuje 3D talíř ZOFITHERM. */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const [live] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && hasWebGL())
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const fresh = feed()[0]
  const lessons = COURSES.reduce((a, c) => a + courseLessons(c).length, 0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (ref.current) io.observe(ref.current)
    return () => {
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (s) => {
          progress.current = s.progress
        },
      })
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // okno aplikace se při scrollu narovná
        gsap.fromTo(
          '.device-tilt',
          { rotateX: 24, scale: 0.9, y: 40 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top 85%', end: 'top 12%', scrub: 0.6 },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
          gsap.to(el, {
            y: () => -window.innerHeight * Number(el.dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: '.hero-stage', start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
        gsap.from('.hero-copy > *:not(h1)', { opacity: 0, y: 24, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.35 })
      })
      // naklánění okna za myší (jen myš, ne dotyk)
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const stage = ref.current?.querySelector<HTMLElement>('.hero-stage')
        const dev = ref.current?.querySelector<HTMLElement>('.device')
        if (!stage || !dev) return
        const rx = gsap.quickTo(dev, 'rotationX', { duration: 0.8, ease: 'power3.out' })
        const ry = gsap.quickTo(dev, 'rotationY', { duration: 0.8, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 7)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 5)
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
    <section ref={ref} id="top" className="hero">
      <div className="hero-bg" aria-hidden />
      <div className="wrap hero-copy">
        {fresh && (
          <Link className="hero-pill" to={videoHref(fresh.v)}>
            <b>Nové</b>
            <span>{fresh.video.t}</span>
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
          Videokurzy zateplení natočené na skutečných stavbách ZOFI. V aplikaci, která ví, kde jste skončili.
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
          <Link className="btn btn-lg btn-ghost" to={videoHref(INTRO)}>
            <Play aria-hidden fill="currentColor" />
            Pustit úvod zdarma
          </Link>
        </div>
        <div className="hero-meta">
          <span>
            <Check aria-hidden strokeWidth={2.5} /> {COURSES.length} kurzy, {lessons} lekcí
          </span>
          <span>
            <Check aria-hidden strokeWidth={2.5} /> Nové video každý týden
          </span>
          <span>
            <Check aria-hidden strokeWidth={2.5} /> Zrušíte kdykoliv
          </span>
        </div>
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

        {/* talíř ZOFITHERM: živé 3D, bez WebGL nebo při omezeném pohybu render */}
        <div className={`hero-washer${ready || !live ? ' ready' : ''}`} aria-hidden>
          {live ? (
            <Suspense fallback={null}>
              <WasherScene
                mode="hero"
                progress={progress}
                pointer={pointer}
                active={visible}
                onReady={() => setReady(true)}
              />
            </Suspense>
          ) : (
            <img src={talirRender} alt="" />
          )}
        </div>
        <div className="washer-tag" data-speed="0.12" aria-hidden>
          <b>ZOFITHERM</b> kotvicí talíř ve 3D
        </div>

        <div className="chip chip-b" data-speed="0.22" aria-hidden>
          <b>Kapitoly ve videu</b>
          <ol>
            {lessonInfo(RESUME).m.slice(0, 4).map(([t, name], i) => (
              <li key={t} className={i === 1 ? 'on' : ''}>
                <span>{fmtTime(t)}</span>
                {name}
              </li>
            ))}
          </ol>
        </div>
        <div className="chip chip-a" data-speed="0.32" aria-hidden>
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

/** Statický náhled aplikace (sekce Videa) v okně prohlížeče, zmenšený na šířku stránky. */
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

  // výška náhledu se mění se šířkou: pozice scrollovaných sekcí pod ním přepočítat
  useEffect(() => {
    const r = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(r)
  }, [width])

  // Na úzkém displeji bez postranního panelu, aby byl náhled čitelný.
  const compact = width < 640
  const design = compact ? 560 : 1240
  const scale = width / design
  const items = feed()
  const [top, ...rest] = items
  const rings = [30, 20, 0]

  return (
    <div ref={outer} className="preview" style={{ height: (compact ? 560 : 760) * scale }} aria-hidden inert>
      <div
        className={`preview-inner${compact ? ' compact' : ''}`}
        style={{ width: design, transform: `scale(${scale})` }}
      >
        <aside className="pv-side">
          <div className="pv-logo">
            <Logo />
            <span>Akademie</span>
          </div>
          <div className="pv-item on">
            <PlaySquare /> Videa <em>{FEED_COUNT}</em>
          </div>
          <div className="pv-item">
            <GraduationCap /> Kurzy <em>{COURSES.length}</em>
          </div>
          <div className="pv-item">
            <Bookmark /> Uložené <em>2</em>
          </div>
          <div className="pv-label">Moje kurzy</div>
          {COURSES.map((c, i) => (
            <div className="pv-item pv-course" key={c.id}>
              <span className="pv-ring" style={{ '--p': rings[i] } as CSSProperties} />
              {c.short}
            </div>
          ))}
          <div className="pv-user">
            <span className="pv-avatar">JN</span>
            <span>
              <b>Jan Novák</b>
              <small>Roční předplatné</small>
            </span>
          </div>
        </aside>
        <div className="pv-main">
          <div className="pv-top">
            <span className="pv-search">
              <Search /> Hledat videa a lekce <kbd>⌘K</kbd>
            </span>
          </div>
          <div className="pv-page">
            <div className="pv-title">
              Videa <span>{FEED_COUNT}</span>
            </div>
            <p className="pv-desc">Novinky, materiály a ukázky ze staveb ZOFI. Nové video každý týden.</p>
            <div className="pv-tabs">
              <span className="on">Vše</span>
              {TOPICS.map((t) => (
                <span key={t}>
                  {t} <em>{items.filter((f) => f.topic === t).length}</em>
                </span>
              ))}
              <span className="pv-sort">
                Řadit <b>Nejnovější</b>
              </span>
            </div>
            <div className="pv-grid">
              <div className="pv-card pv-feat">
                <div className="thumb">
                  <img className="thumb-img" src={talirDrevostavba} alt="" />
                  <span className="pv-new">Nové</span>
                  <span className="dur">{top.video.d}</span>
                </div>
                <b>{top.video.t}</b>
                <p>{top.video.desc}</p>
                <small>
                  {top.topic} · {fmtAgo(top.date)} · <Heart /> {top.likes}
                </small>
              </div>
              {rest.slice(0, compact ? 2 : 8).map((f) => (
                <div className="pv-card" key={f.v}>
                  <div className="thumb">
                    <Thumb video={f.video} eager />
                    <span className="dur">{f.video.d}</span>
                  </div>
                  <b>{f.video.t}</b>
                  <small>
                    {f.topic} · {fmtAgo(f.date)}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
