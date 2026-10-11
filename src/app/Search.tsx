import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Search as SearchIcon } from 'lucide-react'
import { Thumb } from '../components/Thumb'
import { videoHref, type Video } from '../data/catalog'
import { useVideoSearch, videoMeta } from './hooks'

/** Hledání v horní liště: videa i lekce kurzů, šipky a Enter, zkratka ⌘K nebo „/“. */
export function Search() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const input = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  // -1 = nic nevybráno, Enter pak otevře všechny výsledky
  const [sel, setSel] = useState(-1)
  const { videos, lessons, total } = useVideoSearch(q)
  const all = [...videos, ...lessons]
  const mac = /Mac|iPhone|iPad/.test(navigator.platform)

  // zkratka pro hledání
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
        e.preventDefault()
        input.current?.focus()
        input.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // po přechodu na jinou stránku hledání zavřít
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
    setQ('')
  }

  const go = (x: Video) => {
    nav(videoHref(x.v))
    input.current?.blur()
  }
  const goAll = () => {
    if (!q.trim()) return
    nav(`/app/hledat?q=${encodeURIComponent(q.trim())}`)
    input.current?.blur()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => Math.min(s + 1, all.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => Math.max(s - 1, -1))
    } else if (e.key === 'Enter') {
      if (all[sel]) go(all[sel])
      else goAll()
    } else if (e.key === 'Escape') {
      setOpen(false)
      input.current?.blur()
    }
  }

  const item = (x: Video, i: number) => {
    const m = videoMeta(x)
    return (
      <Link
        key={x.v}
        to={videoHref(x.v)}
        className={i === sel ? 'sel' : ''}
        onMouseEnter={() => setSel(i)}
        onMouseDown={(e) => e.preventDefault()}
        role="option"
        aria-selected={i === sel}
      >
        <span className="thumb">
          <Thumb video={x} size="sm" />
        </span>
        <span>
          <b>{x.t}</b>
          <small>
            {m.label}
            {m.sub && ` · ${m.sub}`} · {x.d}
          </small>
        </span>
      </Link>
    )
  }

  return (
    <div className="search">
      <SearchIcon aria-hidden />
      <input
        ref={input}
        type="search"
        placeholder="Hledat videa a lekce"
        aria-label="Hledat videa a lekce"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setSel(-1)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open && !!q.trim()}
        aria-controls="search-results"
        autoComplete="off"
      />
      <kbd>{mac ? '⌘K' : 'Ctrl K'}</kbd>
      {open && q.trim() && (
        <div className="search-pop" id="search-results" role="listbox">
          {all.length === 0 && <p>Nic jsme nenašli. Zkuste jiné slovo.</p>}
          {videos.length > 0 && <h4>Videa</h4>}
          {videos.map((x, i) => item(x, i))}
          {lessons.length > 0 && <h4>Lekce v kurzech</h4>}
          {lessons.map((x, i) => item(x, videos.length + i))}
          {total > 0 && (
            <button className="search-all" onMouseDown={(e) => e.preventDefault()} onClick={goAll}>
              Zobrazit všechny výsledky ({total})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
