import { useCallback, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router'
import { Bookmark, Check, Heart, MessageCircle, Play } from 'lucide-react'
import { Thumb } from '../components/Thumb'
import {
  courseSecs,
  feedMeta,
  fmtAgo,
  fmtDuration,
  plural,
  videoHref,
  vid,
  type Course,
  type Video,
} from '../data/catalog'
import { progress, useProgress } from '../lib/progress'
import { ToastCtx, useCourseProgress, useToast } from './hooks'

/* ---------- průběh ---------- */
export function Bar({ pct }: { pct: number }) {
  return (
    <div className="pbar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ---------- karta videu v sekci Videa ---------- */
export function VideoCard({ x }: { x: Video }) {
  const { watched, liked } = useProgress()
  const m = feedMeta(x.v)
  return (
    <Link className="vcard" to={videoHref(x.v)}>
      <div className="thumb">
        <Thumb video={x} />
        <span className="dur">{x.d}</span>
        {watched.includes(x.v) && (
          <span className="seen" aria-label="Zhlédnuto">
            <Check strokeWidth={3} />
          </span>
        )}
        {x.isNew && !watched.includes(x.v) && <span className="new">Nové</span>}
      </div>
      <b>{x.t}</b>
      {m && (
        <span className="vcard-meta">
          <span>{m.topic}</span>
          <span>{fmtAgo(m.date)}</span>
          <span className="vcard-stats">
            <Heart aria-hidden /> {m.likes + (liked.includes(x.v) ? 1 : 0)}
            <MessageCircle aria-hidden /> {m.comments}
          </span>
        </span>
      )}
    </Link>
  )
}

/** Malá vodorovná karta do seznamu „Další videa“. */
export function VideoRow({ x, active = false }: { x: Video; active?: boolean }) {
  const m = feedMeta(x.v)
  return (
    <Link className={`vrow${active ? ' on' : ''}`} to={videoHref(x.v)}>
      <span className="thumb">
        <Thumb video={x} size="sm" />
        <span className="dur">{x.d}</span>
      </span>
      <span className="vrow-text">
        <b>{x.t}</b>
        {m && (
          <small>
            {m.topic} · {fmtAgo(m.date)}
          </small>
        )}
      </span>
    </Link>
  )
}

/* ---------- karta kurzu ---------- */
export function CourseCard({ c }: { c: Course }) {
  const p = useCourseProgress(c)
  const cover = vid(c.cover)!
  return (
    <article className="course-card">
      <Link className="course-card-media thumb" to={`/app/kurzy/${c.id}`} tabIndex={-1}>
        <Thumb video={cover} size="lg" />
      </Link>
      <div className="course-card-body">
        <span className="chip-level">{c.level}</span>
        <h3>
          <Link to={`/app/kurzy/${c.id}`}>{c.title}</Link>
        </h3>
        <p>{c.desc}</p>
        <span className="meta">
          {p.total} {plural(p.total, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(courseSecs(c))}
        </span>
        <div className="course-card-foot">
          <div className="course-card-progress">
            <Bar pct={p.pct} />
            <span>{p.done ? `${p.done} z ${p.total} hotovo` : 'Nezačato'}</span>
          </div>
          <Link className="btn btn-sm" to={`/app/kurzy/${c.id}/${p.next}`}>
            <Play aria-hidden fill="currentColor" />
            {p.done === 0 ? 'Začít' : p.done === p.total ? 'Znovu' : 'Pokračovat'}
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ---------- tlačítka u videa ---------- */
export function LikeSaveShare({ id, likes }: { id: string; likes?: number }) {
  const { liked, saved } = useProgress()
  const toast = useToast()
  const isLiked = liked.includes(id)
  const isSaved = saved.includes(id)
  return (
    <div className="actions">
      <button className={`pill${isLiked ? ' on' : ''}`} onClick={() => progress.like(id)} aria-pressed={isLiked}>
        <Heart aria-hidden fill={isLiked ? 'currentColor' : 'none'} />
        {likes !== undefined ? likes + (isLiked ? 1 : 0) : 'Líbí se'}
      </button>
      <button
        className={`pill${isSaved ? ' on' : ''}`}
        onClick={() => {
          progress.save(id)
          toast(isSaved ? 'Odebráno z uložených.' : 'Uloženo. Najdete ho ve Videích pod Uložené.')
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

export function Avatar({ name, team = false, size = 36 }: { name: string; team?: boolean; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <span className={`avatar${team ? ' team' : ''}`} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {team ? 'Z' : initials}
    </span>
  )
}
