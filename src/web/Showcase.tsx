import { useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/reactbits/ScrollReveal'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Thumb } from '../components/Thumb'
import {
  COURSES,
  VIDEOS,
  courseLessons,
  courseSecs,
  fmtDuration,
  plural,
  totalSecs,
  vid,
} from '../data/catalog'
import { cz } from '../lib/czech'

/* ---------- čísla ---------- */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const o = { n: 0 }
      el.textContent = '0'
      gsap.to(o, {
        n: to,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = Math.round(o.n).toLocaleString('cs-CZ')
        },
      })
      return () => {
        el.textContent = to.toLocaleString('cs-CZ')
      }
    })
    return () => mm.revert()
  })
  return (
    <span className="stat-n">
      <span ref={ref}>{to.toLocaleString('cs-CZ')}</span>
      {suffix && <em>{suffix}</em>}
    </span>
  )
}

export function Stats() {
  const lessons = COURSES.reduce((a, c) => a + courseLessons(c).length, 0)
  return (
    <section className="stats">
      <div className="wrap stats-grid">
        <div className="stat" data-reveal>
          <Counter to={VIDEOS.length} />
          <p>videí ze skutečných staveb</p>
        </div>
        <div className="stat" data-reveal>
          <Counter to={lessons} />
          <p>lekcí ve {COURSES.length} kurzech, v pořadí, jak se staví</p>
        </div>
        <div className="stat" data-reveal>
          <Counter to={Math.round(totalSecs() / 60)} />
          <p>minut postupů a detailů</p>
        </div>
        <div className="stat" data-reveal>
          <Counter to={850} suffix="+" />
          <p>zateplených domů za námi</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- výrok ---------- */
export function Statement() {
  return (
    <section className="statement">
      <div className="wrap">
        <ScrollReveal baseOpacity={0.12} baseRotation={2} blurStrength={6} wordAnimationEnd="bottom 55%">
          {cz('Fasádu zateplujete jednou za třicet let. Chybu v ní ale uvidíte každý den.')}
        </ScrollReveal>
        <p className="lead" data-reveal>
          Proto jsme natočili všechno, co o fasádách víme. <strong>Žádné studio.</strong> Každá lekce vzniká na skutečné
          zakázce ZOFI, s lešením, větrem i tím, co se nepovede napoprvé.
        </p>
      </div>
    </section>
  )
}

/* ---------- kurzy ---------- */
export function Courses() {
  const ref = useRef<HTMLElement>(null)

  // karta se za myší nakloní ve 3D a přejede po ní odlesk
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const offs = gsap.utils.toArray<HTMLElement>('.ccard').map((card) => {
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' })
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' })
          gsap.set(card, { transformPerspective: 900 })
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width
            const y = (e.clientY - r.top) / r.height
            ry((x - 0.5) * 12)
            rx(-(y - 0.5) * 10)
            card.style.setProperty('--gx', `${x * 100}%`)
            card.style.setProperty('--gy', `${y * 100}%`)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', leave)
          return () => {
            card.removeEventListener('pointermove', move)
            card.removeEventListener('pointerleave', leave)
          }
        })
        return () => offs.forEach((off) => off())
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="kurzy" className="sec">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <span className="eyebrow">Kurzy</span>
          <h2 className="h2">Tři kurzy. Od lešení po předání.</h2>
          <p className="lead">
            Lekce jdou v pořadí, v jakém se na stavbě opravdu pracuje. Začnete u přípravy podkladu a skončíte u
            přejímky hotové fasády.
          </p>
        </header>
        <div className="course-grid">
          {COURSES.map((c) => {
            const n = courseLessons(c).length
            return (
              <article className="ccard" key={c.id} data-reveal>
                <div className="ccard-media">
                  <Thumb video={vid(c.cover)!} size="lg" />
                  <span className="ccard-level">{c.level}</span>
                </div>
                <div className="ccard-body">
                  <span className="ccard-meta">
                    {n} {plural(n, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(courseSecs(c))}
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.tag}</p>
                  <ol className="ccard-chapters">
                    {c.chapters.map((ch, i) => (
                      <li key={ch.t}>
                        <span>{i + 1}</span>
                        {ch.t}
                        <em>
                          {ch.l.length} {plural(ch.l.length, 'lekce', 'lekce', 'lekcí')}
                        </em>
                      </li>
                    ))}
                  </ol>
                  <Link className="link-more" to={`/app/kurzy/${c.id}`}>
                    Prohlédnout kurz <ArrowRight aria-hidden />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- 3D stěna všech videí ---------- */
export function VideoWall() {
  const ref = useRef<HTMLElement>(null)
  // čtyři řady, každá jinak posunutá, aby se náhledy neopakovaly pod sebou
  const rows = [0, 1, 2, 3].map((r) => {
    const shifted = [...VIDEOS.slice(r * 7), ...VIDEOS.slice(0, r * 7)]
    return [...shifted, ...shifted].slice(0, 22)
  })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trig = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        gsap.utils.toArray<HTMLElement>('.vwall-row').forEach((row, i) => {
          const dir = i % 2 ? 1 : -1
          gsap.fromTo(row, { xPercent: dir * -6 - 4 }, { xPercent: dir * 6 - 4, ease: 'none', scrollTrigger: trig })
        })
        gsap.fromTo(
          '.vwall-plane',
          { rotateX: 42, rotateZ: -18, scale: 1.05 },
          { rotateX: 24, rotateZ: -10, scale: 1.18, ease: 'none', scrollTrigger: trig },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="vwall dark" aria-label="Všechna videa">
      <div className="vwall-stage" aria-hidden>
        <div className="vwall-plane">
          {rows.map((row, r) => (
            <div className="vwall-row" key={r}>
              {row.map((x, i) => (
                <div className="vwall-item" key={`${x.v}-${i}`}>
                  <div className="thumb">
                    <Thumb video={x} size="sm" />
                    <span className="dur">{x.d}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="vwall-fade" aria-hidden />
      <div className="wrap vwall-copy" data-reveal>
        <h2 className="h2">
          <NumberTicker value={VIDEOS.length} className="vwall-n" /> videí ze skutečných staveb.
        </h2>
        <p className="lead">
          Lepení, kotvení, armování, sokl, hromosvody i míchárna omítek. Nová videa přibývají průběžně a jsou v ceně.
        </p>
      </div>
    </section>
  )
}
