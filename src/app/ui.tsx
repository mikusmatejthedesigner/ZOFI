import { useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router'
import { Bookmark, ChevronLeft, ChevronRight, Heart, ListVideo, Play } from 'lucide-react'
import { Thumb } from '../components/Thumb'
import {
  courseSecs,
  fmtDuration,
  fmtTime,
  plural,
  secs,
  videoHref,
  vid,
  type Course,
  type Video,
} from '../data/catalog'
import { progress, useProgress } from '../lib/progress'
import { ToastCtx, playerDemo, useCourseProgress, useToast, videoMeta } from './hooks'

/* ====================================================================
   Stavební kameny aplikace. Jedna karta videa, jedna karta kurzu,
   vodorovná řada a velký banner. Nic není postavené na počtu videí.
   ==================================================================== */

/** Tenký pruh průběhu ve spodní části náhledu (jako na YouTube). */
function Prog({ pct }: { pct: number }) {
  return (
    <span className="prog" aria-hidden>
      <i style={{ width: `${pct}%` }} />
    </span>
  )
}

/* ---------- karta videa: náhled, název, jeden řádek popisku ---------- */
export function VCard({ x, sub, pct }: { x: Video; sub?: string; pct?: number }) {
  const { watched } = useProgress()
  const m = videoMeta(x)
  const seen = watched.includes(x.v)
  const bar = pct ?? (seen ? 100 : undefined)
  return (
    <Link className="vc" to={videoHref(x.v)}>
      <span className="thumb">
        <Thumb video={x} />
        <span className="dur">{x.d}</span>
        {bar !== undefined && <Prog pct={bar} />}
      </span>
      <span className="vc-title">{x.t}</span>
      <span className="vc-meta">
        {x.isNew && !seen && !sub && <em>Nové</em>}
        {sub ?? [m.label, m.sub].filter(Boolean).join(' · ')}
      </span>
    </Link>
  )
}

/* ---------- karta kurzu: plakát s názvem (jako seriál) ---------- */
export function CCard({ c }: { c: Course }) {
  const p = useCourseProgress(c)
  return (
    <Link className="cc" to={`/app/kurzy/${c.id}`}>
      <span className="thumb">
        <Thumb video={vid(c.cover)!} size="lg" />
        <span className="cc-in">
          <small>
            <ListVideo aria-hidden />
            {p.total} {plural(p.total, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(courseSecs(c))}
          </small>
          <b>{c.title}</b>
        </span>
        {p.done > 0 && <Prog pct={p.pct} />}
      </span>
    </Link>
  )
}

/* ---------- řádek videa vedle přehrávače a ve výsledcích ---------- */
export function VRow({ x, big = false }: { x: Video; big?: boolean }) {
  const m = videoMeta(x)
  const { watched } = useProgress()
  return (
    <Link className={big ? 'vr vr-big' : 'vr'} to={videoHref(x.v)}>
      <span className="thumb">
        <Thumb video={x} size={big ? 'md' : 'sm'} />
        <span className="dur">{x.d}</span>
        {watched.includes(x.v) && <Prog pct={100} />}
      </span>
      <span>
        <b>{x.t}</b>
        <small>{[m.label, m.sub].filter(Boolean).join(' · ')}</small>
        {big && <p>{x.desc}</p>}
      </span>
    </Link>
  )
}

/* ---------- vodorovná řada (Netflix, Apple TV): unese libovolný počet ---------- */
export function Shelf({ title, to, wide = false, children }: { title: string; to?: string; wide?: boolean; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: true })
  const update = useCallback(() => {
    const el = row.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
  }, [])
  useEffect(() => {
    const el = row.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])
  const go = (dir: number) => {
    const el = row.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }
  return (
    <section className="shelf">
      <h2 className="shelf-title">
        {to ? (
          <Link to={to}>
            {title}
            <ChevronRight aria-hidden />
          </Link>
        ) : (
          title
        )}
      </h2>
      <div className="shelf-wrap">
        <div className={`shelf-row${wide ? ' wide' : ''}`} ref={row} onScroll={update}>
          {children}
        </div>
        {!edge.start && (
          <button className="shelf-btn prev" onClick={() => go(-1)} aria-label="Posunout zpět">
            <ChevronLeft />
          </button>
        )}
        {!edge.end && (
          <button className="shelf-btn next" onClick={() => go(1)} aria-label="Posunout dál">
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  )
}

/* ---------- velký banner nahoře (Apple TV): střídá pár zvýrazněných položek ---------- */
export type FeatureItem = {
  key: string
  kicker: string
  title: string
  meta: string
  text: string
  video: Video
  to: string
  cta: string
  /** druhé tlačítko: odkaz (např. osnova kurzu), jinak Uložit */
  more?: { to: string; label: string }
}

export function Feature({ items }: { items: FeatureItem[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || items.length < 2) return
    const t = window.setTimeout(() => setI((n) => (n + 1) % items.length), 8000)
    return () => window.clearTimeout(t)
  }, [i, paused, items.length])
  const cur = items[Math.min(i, items.length - 1)]
  if (!cur) return null
  return (
    <section
      className={`feat${paused ? ' paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {items.map((it, k) => (
        <div key={it.key} className={`feat-slide${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
          <Thumb video={it.video} size="lg" eager={k === 0} />
        </div>
      ))}
      <div className="feat-shade" aria-hidden />
      <div className="feat-in" key={cur.key}>
        <span className="feat-kicker">{cur.kicker}</span>
        <h1>{cur.title}</h1>
        <p className="feat-meta">{cur.meta}</p>
        <p className="feat-text">{cur.text}</p>
        <div className="feat-cta">
          <Link className="b b-light b-lg" to={cur.to}>
            <Play aria-hidden fill="currentColor" strokeWidth={0} />
            {cur.cta}
          </Link>
          {cur.more ? (
            <Link className="b b-glass b-lg" to={cur.more.to}>
              {cur.more.label}
            </Link>
          ) : (
            <SaveBtn id={cur.video.v} glass />
          )}
        </div>
      </div>
      {items.length > 1 && (
        <div className="feat-dots">
          {items.map((it, k) => (
            <button
              key={it.key}
              className={k === i ? 'on' : ''}
              onClick={() => setI(k)}
              aria-label={`Ukázat: ${it.title}`}
              aria-current={k === i}
            >
              <i />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

/* ---------- tlačítka u videa ---------- */
export function SaveBtn({ id, glass = false }: { id: string; glass?: boolean }) {
  const { saved } = useProgress()
  const toast = useToast()
  const on = saved.includes(id)
  return (
    <button
      className={`b ${glass ? 'b-glass b-lg' : 'b-pill'}${on ? ' on' : ''}`}
      aria-pressed={on}
      onClick={() => {
        progress.save(id)
        toast(on ? 'Odebráno z knihovny.' : 'Uloženo do knihovny.')
      }}
    >
      <Bookmark aria-hidden fill={on ? 'currentColor' : 'none'} />
      {on ? 'Uloženo' : 'Uložit'}
    </button>
  )
}

export function LikeBtn({ id, likes }: { id: string; likes: number }) {
  const { liked } = useProgress()
  const on = liked.includes(id)
  return (
    <button className={`b b-pill${on ? ' on' : ''}`} aria-pressed={on} onClick={() => progress.like(id)}>
      <Heart aria-hidden fill={on ? 'currentColor' : 'none'} />
      {likes + (on ? 1 : 0)}
      <span className="sr-only">To se mi líbí</span>
    </button>
  )
}

/* ---------- přehrávač YouTube ---------- */
export type PlayerHandle = { seek: (t: number) => void }

/** Náhled s tlačítkem přehrát; po kliknutí se načte přehrávač YouTube. */
export function Player({ video, ref, onPlay }: { video: Video; ref?: Ref<PlayerHandle>; onPlay?: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [start, setStart] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)

  const play = (t = 0) => {
    setStart(t)
    setPlaying(true)
    onPlay?.()
  }

  // Skok na okamžik ve videu: běžící přehrávač posuneme, jinak ho spustíme od dané vteřiny.
  useImperativeHandle(ref, () => ({
    seek(t: number) {
      const w = frame.current?.contentWindow
      if (playing && w) {
        w.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [t, true] }), '*')
        w.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
      } else play(t)
      frame.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    },
  }))

  return (
    <div className="player">
      {playing && playerDemo.on ? (
        // ukázka na webu: místo YouTube náhled, posuvník a čas
        <div className="poster demo-playing">
          <Thumb video={video} size="lg" eager />
          <span className="demo-scrub">
            <i style={{ width: `${Math.min(100, (start / Math.max(1, secs(video.d))) * 100)}%` }} />
          </span>
          <span className="poster-dur">
            {fmtTime(start)} / {video.d}
          </span>
        </div>
      ) : playing ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${video.v}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=${start}&origin=${encodeURIComponent(window.location.origin)}`}
          title={video.t}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button className="poster" onClick={() => play()} aria-label={`Přehrát: ${video.t}`}>
          <Thumb video={video} size="lg" eager />
          <span className="poster-play">
            <Play fill="currentColor" aria-hidden />
          </span>
          <span className="poster-dur">{video.d}</span>
        </button>
      )}
    </div>
  )
}

/* ---------- oznámení (toast) ---------- */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = useCallback((m: string) => {
    setMsg(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(null), 2800)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={`toast${msg ? ' on' : ''}`} role="status" aria-live="polite">
        {msg}
      </div>
    </ToastCtx.Provider>
  )
}

export function Avatar({ name, team = false, size = 32 }: { name: string; team?: boolean; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className={`avatar${team ? ' team' : ''}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden
    >
      {team ? 'Z' : initials}
    </span>
  )
}

/** Prázdný stav seznamu. */
export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      {icon}
      <b>{title}</b>
      {children && <p>{children}</p>}
    </div>
  )
}
