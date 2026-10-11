import { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { Bookmark, Check, Heart, ListVideo, Play } from 'lucide-react'
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Thumb } from '../components/Thumb'
import {
  courseLessons,
  courseSecs,
  fmtDuration,
  plural,
  videoHref,
  vid,
  type Course,
  type Video,
} from '../data/catalog'
import { progress, useProgress } from '../lib/progress'
import { ToastCtx, useCourseProgress, useMounted, useToast, videoMeta } from './hooks'

/* ---------- průběh ---------- */
export function Bar({ pct }: { pct: number }) {
  const on = useMounted()
  return (
    <div className="pbar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${on ? pct : 0}%` }} />
    </div>
  )
}

/** Malý kroužek průběhu do postranního panelu. */
export function MiniRing({ pct }: { pct: number }) {
  const on = useMounted()
  const c = 2 * Math.PI * 7
  return (
    <svg className={`mini-ring${pct >= 100 ? ' full' : ''}`} viewBox="0 0 18 18" aria-hidden>
      <circle className="track" cx="9" cy="9" r="7" />
      <circle className="val" cx="9" cy="9" r="7" strokeDasharray={c} strokeDashoffset={c * (1 - (on ? pct : 0) / 100)} />
    </svg>
  )
}

/** Kruhový ukazatel průběhu kurzu (Magic UI), při načtení se doplní od nuly. */
export function Gauge({ pct, className = 'size-12 text-[12px]' }: { pct: number; className?: string }) {
  const on = useMounted()
  return (
    <AnimatedCircularProgressBar
      value={on ? pct : 0}
      gaugePrimaryColor="var(--accent)"
      gaugeSecondaryColor="var(--fill)"
      className={`${className} shrink-0 font-semibold tabular-nums`}
    />
  )
}

/* ---------- karta videa ---------- */
export function VideoCard({ x, eager = false }: { x: Video; eager?: boolean }) {
  const { watched, saved, liked } = useProgress()
  const toast = useToast()
  const m = videoMeta(x)
  const seen = watched.includes(x.v)
  const isSaved = saved.includes(x.v)
  return (
    <article className="vcard">
      <div className="thumb">
        <Thumb video={x} size="lg" eager={eager} />
        <span className="dur">{x.d}</span>
        {x.isNew && !seen && <span className="badge-new">Nové</span>}
        {seen && (
          <span className="thumb-seen" aria-label="Zhlédnuto">
            <Check strokeWidth={3.5} />
          </span>
        )}
      </div>
      <button
        className={`vcard-save${isSaved ? ' on' : ''}`}
        aria-label={isSaved ? 'Odebrat z uložených' : 'Uložit'}
        aria-pressed={isSaved}
        onClick={() => {
          progress.save(x.v)
          toast(isSaved ? 'Odebráno z uložených.' : 'Uloženo do knihovny.')
        }}
      >
        <Bookmark fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
      </button>
      <div className="vcard-body">
        <h3 className="vcard-title">
          <Link className="stretch" to={videoHref(x.v)}>
            {x.t}
          </Link>
        </h3>
        <p className="vcard-desc">{x.desc}</p>
        <div className="vcard-meta">
          <b>{m.label}</b>
          {m.sub && (
            <>
              <span className="dot" aria-hidden />
              <span>{m.sub}</span>
            </>
          )}
          {m.likes !== undefined && (
            <>
              <span className="dot" aria-hidden />
              <span className="likes" aria-label="To se mi líbí">
                <Heart aria-hidden />
                {m.likes + (liked.includes(x.v) ? 1 : 0)}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

/** Malý řádek videa (další videa). */
export function VideoRow({ x }: { x: Video }) {
  const m = videoMeta(x)
  return (
    <Link className="vrow" to={videoHref(x.v)}>
      <span className="thumb">
        <Thumb video={x} size="sm" />
        <span className="dur">{x.d}</span>
      </span>
      <span>
        <b>{x.t}</b>
        <small>
          {m.label}
          {m.sub && ` · ${m.sub}`}
        </small>
      </span>
    </Link>
  )
}

/* ---------- kurzy ---------- */
export function CourseCard({ c }: { c: Course }) {
  const p = useCourseProgress(c)
  return (
    <Link className="ctile" to={`/app/kurzy/${c.id}`}>
      <div className="thumb">
        <Thumb video={vid(c.cover)!} size="lg" />
        <span className="ctile-lessons">
          <ListVideo aria-hidden />
          {p.total} {plural(p.total, 'lekce', 'lekce', 'lekcí')}
        </span>
      </div>
      <div className="ctile-body">
        <span className="ctile-level">{c.level}</span>
        <h3>{c.title}</h3>
        <p>{c.desc}</p>
        <div className="ctile-foot">
          <Bar pct={p.pct} />
          <span>{p.done ? `${p.done} z ${p.total}` : 'Nezačato'}</span>
          <span className="dot" aria-hidden />
          <span>{fmtDuration(courseSecs(c))}</span>
        </div>
      </div>
    </Link>
  )
}

/** Rozkoukaný kurz: kde jste skončili a kolik zbývá. */
export function ResumeCard({ c, at }: { c: Course; at: string }) {
  const p = useCourseProgress(c)
  const x = vid(at)!
  return (
    <Link className="resume-card" to={`/app/kurzy/${c.id}/${at}`}>
      <span className="thumb">
        <Thumb video={x} size="sm" eager />
      </span>
      <span>
        <small>
          {c.short} · Lekce {courseLessons(c).indexOf(at) + 1} z {p.total}
        </small>
        <b>{x.t}</b>
        <Bar pct={p.pct} />
      </span>
      <span className="play-dot" aria-hidden>
        <Play fill="currentColor" strokeWidth={0} />
      </span>
    </Link>
  )
}

/* ---------- záložky s posuvným podtržením (GSAP) ---------- */
export type TabItem<T extends string> = { id: T; label: string; count?: number }

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className = '',
}: {
  items: TabItem<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const ink = useRef<HTMLSpanElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const btn = box.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!btn || !ink.current) return
    const to = { x: btn.offsetLeft + 10, width: btn.offsetWidth - 20 }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (first.current || reduce) gsap.set(ink.current, to)
    else gsap.to(ink.current, { ...to, duration: 0.45, ease: 'expo.out', overwrite: true })
    first.current = false
    // aktivní záložka viditelná i na úzkém displeji (posouvá jen řádek záložek)
    const row = box.current!
    const l = btn.offsetLeft
    const r = l + btn.offsetWidth
    if (l < row.scrollLeft) row.scrollLeft = l - 16
    else if (r > row.scrollLeft + row.clientWidth) row.scrollLeft = r - row.clientWidth + 16
  }, [value, items.length])

  return (
    <div className={`tabs ${className}`} role="tablist" aria-label={label} ref={box}>
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          className={`tab-btn${value === t.id ? ' on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.count !== undefined && <em>{t.count}</em>}
        </button>
      ))}
      <span className="tab-ink" ref={ink} aria-hidden />
    </div>
  )
}

/* ---------- Líbí se a Uložit (spojená tlačítka) ---------- */
export function LikeSave({ id, likes }: { id: string; likes?: number }) {
  const { liked, saved } = useProgress()
  const toast = useToast()
  const isLiked = liked.includes(id)
  const isSaved = saved.includes(id)
  return (
    <div className="group">
      <button className={`b${isLiked ? ' on' : ''}`} onClick={() => progress.like(id)} aria-pressed={isLiked}>
        <Heart aria-hidden fill={isLiked ? 'currentColor' : 'none'} />
        {likes !== undefined ? (
          <NumberTicker value={likes + (isLiked ? 1 : 0)} startValue={Math.max(0, likes - 12)} className="tabular-nums" />
        ) : (
          'Líbí se'
        )}
        <span className="sr-only">To se mi líbí</span>
      </button>
      <button
        className={`b${isSaved ? ' on' : ''}`}
        onClick={() => {
          progress.save(id)
          toast(isSaved ? 'Odebráno z uložených.' : 'Uloženo do knihovny.')
        }}
        aria-pressed={isSaved}
      >
        <Bookmark aria-hidden fill={isSaved ? 'currentColor' : 'none'} />
        {isSaved ? 'Uloženo' : 'Uložit'}
      </button>
    </div>
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
      {playing ? (
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
