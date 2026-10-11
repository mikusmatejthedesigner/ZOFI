import { useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Check, Play } from 'lucide-react'
import ScrollReveal from '../components/reactbits/ScrollReveal'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import { Thumb } from '../components/Thumb'
import {
  COURSES,
  VIDEOS,
  courseLessons,
  courseSecs,
  fmtDuration,
  lessonInfo,
  plural,
  secs,
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
  return (
    <section id="kurzy" className="sec">
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

/* ---------- pás všech videí ---------- */
export function Rail() {
  const half = Math.ceil(VIDEOS.length / 2)
  const rows = [VIDEOS.slice(0, half), VIDEOS.slice(half)]
  return (
    <section className="sec rail" aria-label="Všechna videa">
      <div className="wrap sec-head center" data-reveal>
        <h2 className="h2">{VIDEOS.length} videí ze skutečných staveb.</h2>
        <p className="lead">
          Lepení, kotvení, armování, sokl, hromosvody i míchárna omítek. Nová videa přibývají průběžně a jsou v ceně.
        </p>
      </div>
      <div className="rail-rows">
        {rows.map((row, r) => (
          <div className={`rail-row${r ? ' rev' : ''}`} key={r}>
            <div className="rail-track">
              {[...row, ...row].map((x, i) => (
                <figure className="rail-item" key={`${x.v}-${i}`} aria-hidden={i >= row.length || undefined}>
                  <div className="thumb">
                    <Thumb video={x} size="sm" />
                    <span className="dur">{x.d}</span>
                  </div>
                  <figcaption>{x.t}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- co aplikace umí ---------- */
export function Bento() {
  const ref = useRef<HTMLElement>(null)
  const lesson = vid('Er5tVaQ3u2U')!
  const info = lessonInfo(lesson.v)
  const series = courseLessons(COURSES[0]).slice(0, 5)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.ring-big .fg', {
          strokeDashoffset: 2 * Math.PI * 62,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ring-big', start: 'top 85%', once: true },
        })
        gsap.from('.mini-track b', {
          scaleY: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: '.mini-track', start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const circ = 2 * Math.PI * 62
  return (
    <section ref={ref} id="aplikace" className="sec mist">
      <div className="wrap">
        <header className="sec-head center" data-reveal>
          <span className="eyebrow">Aplikace</span>
          <h2 className="h2">Všechno pro fasádu. Nic navíc.</h2>
          <p className="lead">
            Čistá aplikace v počítači, tabletu i telefonu. Otevřete ji a pokračujete přesně tam, kde jste skončili.
          </p>
        </header>
        <div className="bento">
          <SpotlightCard className="tile tile-4" theme="light" spotlightColor="#e62152" data-reveal>
            <h3>
              Kurzy jako seriál. <span>Kapitoly a lekce v pořadí, v jakém se staví. Vždy víte, co je na řadě.</span>
            </h3>
            <div className="tile-vis">
              <ol className="mini-list">
                {series.map((id, i) => {
                  const x = vid(id)!
                  const state = i < 3 ? 'done' : i === 3 ? 'now' : ''
                  return (
                    <li key={id} className={state}>
                      <span className={`mini-check ${state}`}>
                        {state === 'done' && <Check strokeWidth={3} />}
                        {state === 'now' && <Play fill="currentColor" strokeWidth={0} />}
                      </span>
                      {x.t}
                      <em>{x.d}</em>
                    </li>
                  )
                })}
              </ol>
            </div>
          </SpotlightCard>

          <SpotlightCard className="tile tile-2" theme="light" spotlightColor="#e62152" data-reveal>
            <h3>
              Kapitoly ve videu. <span>Klepnete a jste přesně tam, kde se ukazuje to podstatné.</span>
            </h3>
            <div className="tile-vis">
              <div className="mini-player">
                <div className="thumb">
                  <Thumb video={lesson} />
                  <div className="mini-track">
                    <i />
                    {info.m.map(([s]) => (
                      <b key={s} style={{ left: `${(s / secs(lesson.d)) * 100}%` }} />
                    ))}
                  </div>
                </div>
                <ol className="mini-marks">
                  {info.m.slice(0, 3).map(([s, name], i) => (
                    <li key={s} className={i === 1 ? 'on' : ''}>
                      <span>
                        {Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')}
                      </span>
                      {name}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="tile tile-2 tile-ring" theme="light" spotlightColor="#e62152" data-reveal>
            <h3>
              Pamatuje si, <span>kde jste skončili.</span>
            </h3>
            <div className="tile-vis">
              <div className="ring-big">
                <svg viewBox="0 0 150 150">
                  <circle className="bg" cx="75" cy="75" r="62" />
                  <circle className="fg" cx="75" cy="75" r="62" strokeDasharray={circ} strokeDashoffset={circ * 0.6} />
                </svg>
                <div>
                  <strong>40 %</strong>
                  <small>4 z 10 lekcí</small>
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="tile tile-2" theme="light" spotlightColor="#e62152" data-reveal>
            <h3>
              Hlavní body <span>ke každé lekci. Na stavbě je najdete za pár vteřin.</span>
            </h3>
            <div className="tile-vis">
              <ol className="mini-points">
                {info.k.map((k, i) => (
                  <li key={k}>
                    <b>{i + 1}</b>
                    {k}
                  </li>
                ))}
              </ol>
            </div>
          </SpotlightCard>

          <SpotlightCard className="tile tile-2 tile-zero" theme="light" spotlightColor="#e62152" data-reveal>
            <h3>
              Bez reklam. <span>Žádná doporučená videa, která vás odvedou jinam.</span>
            </h3>
            <div className="tile-vis">
              <div className="big-zero">0</div>
              <p>reklam a rozptylování</p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="tile tile-6 tile-devices" theme="light" spotlightColor="#e62152" data-reveal>
            <div>
              <h3>V počítači, tabletu i telefonu.</h3>
              <p>Na stavbě v mobilu, večer v klidu na velké obrazovce. Průběh máte všude stejný.</p>
            </div>
            <div className="devices" aria-hidden>
              <div className="dev-laptop">
                <div className="thumb">
                  <Thumb video={vid('bCudN8yMi64')!} />
                </div>
              </div>
              <div className="dev-phone">
                <div className="dev-phone-in">
                  <div className="thumb">
                    <Thumb video={lesson} size="sm" />
                  </div>
                  <b>{lesson.t}</b>
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
