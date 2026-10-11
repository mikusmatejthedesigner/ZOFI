import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check, Search as SearchIcon } from 'lucide-react'
import { Thumb } from '../components/Thumb'
import {
  courseOf,
  courseSecs,
  fmtDuration,
  plural,
  vid,
  type Course,
  type Video,
} from '../data/catalog'
import { useProgress } from '../lib/progress'
import { ToastCtx, useCourseProgress, useVideoSearch } from './hooks'

export function Ring({ pct, size = 18, stroke = 3 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg className="pring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} className="pring-bg" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="pring-fg"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
      />
    </svg>
  )
}

export function Bar({ pct }: { pct: number }) {
  return (
    <div className="pbar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ---------- karty ---------- */
export function CourseCard({ c }: { c: Course }) {
  const p = useCourseProgress(c)
  return (
    <Link className="ccard-app" to={`/app/kurzy/${c.id}`}>
      <div className="thumb">
        <Thumb video={vid(c.cover)!} size="lg" />
        <span className="chip-level">{c.level}</span>
      </div>
      <div className="ccard-app-body">
        <h3>{c.title}</h3>
        <p className="meta">
          {p.total} {plural(p.total, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(courseSecs(c))}
        </p>
        <div className="ccard-app-progress">
          <Bar pct={p.pct} />
          <span>{p.done ? `${p.done} z ${p.total}` : 'Nezačato'}</span>
        </div>
      </div>
    </Link>
  )
}

export function VideoCard({ x, sub }: { x: Video; sub?: string }) {
  const { watched } = useProgress()
  const c = courseOf(x.v)
  return (
    <Link className="vcard" to={`/app/lekce/${x.v}`}>
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
      <span className="meta">{sub ?? c?.short ?? 'Samostatné video'}</span>
    </Link>
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

/* ---------- hledání ve videích ---------- */
export function SearchBox({ shortcut = false }: { shortcut?: boolean }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const nav = useNavigate()
  const results = useVideoSearch(q).slice(0, 7)

  useEffect(() => {
    if (!shortcut) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        input.current?.focus()
        input.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcut])

  const go = (x: Video) => {
    nav(`/app/lekce/${x.v}`)
    setQ('')
    setOpen(false)
    input.current?.blur()
  }

  return (
    <div className="search" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <SearchIcon className="search-ico" aria-hidden />
      <input
        ref={input}
        type="search"
        placeholder="Hledat lekce"
        aria-label="Hledat lekce"
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value)
          setSel(0)
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSel((s) => Math.min(s + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSel((s) => Math.max(s - 1, 0))
          } else if (e.key === 'Enter' && results[sel]) go(results[sel])
          else if (e.key === 'Escape') {
            setQ('')
            input.current?.blur()
          }
        }}
      />
      {shortcut && !q && <kbd>⌘K</kbd>}
      {open && q && (
        <div className="search-pop" role="listbox">
          {results.length ? (
            results.map((x, i) => (
              <button
                key={x.v}
                role="option"
                aria-selected={i === sel}
                className={i === sel ? 'on' : ''}
                onMouseEnter={() => setSel(i)}
                onClick={() => go(x)}
              >
                <span className="thumb">
                  <Thumb video={x} size="sm" />
                </span>
                <span>
                  <b>{x.t}</b>
                  <small>
                    {courseOf(x.v)?.short ?? 'Samostatné video'} · {x.d}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <p className="search-empty">Nic jsme nenašli. Zkuste jiné slovo.</p>
          )}
        </div>
      )}
    </div>
  )
}
