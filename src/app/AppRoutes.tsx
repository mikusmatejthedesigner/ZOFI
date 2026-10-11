import { useEffect, useRef } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Bookmark, ChevronRight, CircleUserRound, GraduationCap, PlaySquare } from 'lucide-react'
import { Logo } from '../components/Logo'
import { COURSES, FEED_COUNT, USER, course, courseLessons, videoHref, vid } from '../data/catalog'
import { useCzechTypography } from '../lib/czech'
import { useProgress } from '../lib/progress'
import { Avatar, MiniRing, ToastProvider } from './ui'
import { useCourseProgress } from './hooks'
import { Search } from './Search'
import { Videos } from './pages/Videos'
import { Watch } from './pages/Watch'
import { Saved } from './pages/Saved'
import { Courses } from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { Lesson } from './pages/Lesson'
import { Account } from './pages/Account'
import './app.css'

gsap.registerPlugin(useGSAP)

export default function AppRoutes() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<ToVideos />} />
          <Route path="videa" element={<Videos />} />
          <Route path="videa/:videoId" element={<Watch />} />
          <Route path="kurzy" element={<Courses />} />
          <Route path="kurzy/:courseId" element={<CourseDetail />} />
          <Route path="kurzy/:courseId/:lessonId" element={<Lesson />} />
          <Route path="ulozene" element={<Saved />} />
          <Route path="ucet" element={<Account />} />
          {/* starší odkazy z webu: /app/lekce/<id> */}
          <Route path="lekce/:videoId" element={<LegacyLesson />} />
          <Route path="*" element={<Navigate to="/app/videa" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

/** /app vede na Videa a zachová parametry (např. ?vitejte=1 z ceníku). */
function ToVideos() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/app/videa', search }} replace />
}

function LegacyLesson() {
  const { videoId = '' } = useParams()
  return <Navigate to={vid(videoId) ? videoHref(videoId) : '/app/videa'} replace />
}

/* ---------- rozvržení: postranní panel, horní lišta, obsah ---------- */
function Shell() {
  const root = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  useCzechTypography(root)

  // Tmavý režim podle systému se týká jen aplikace, ne prodejního webu.
  useEffect(() => {
    document.documentElement.classList.add('in-app')
    return () => document.documentElement.classList.remove('in-app')
  }, [])

  // Nová stránka začíná nahoře a jemně se vynoří.
  useGSAP(
    () => {
      window.scrollTo(0, 0)
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          main.current,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out', clearProps: 'all' },
        )
      })
      return () => mm.revert()
    },
    { dependencies: [pathname] },
  )

  return (
    <div ref={root} className="app shell">
      <Sidebar />
      <div className="content">
        <header className="topbar">
          <Link className="mobile-brand" to="/app/videa" aria-label="Akademie ZOFI">
            <Logo mark className="mobile-logo" />
          </Link>
          <Crumbs />
          <div className="topbar-end">
            <Search />
          </div>
        </header>
        <main ref={main}>
          <Outlet />
        </main>
      </div>
      <TabBar />
    </div>
  )
}

function Sidebar() {
  const { saved } = useProgress()
  return (
    <aside className="sidebar" aria-label="Navigace">
      <Link className="sb-brand" to="/app/videa" aria-label="Akademie ZOFI">
        <Logo />
        <span>Akademie</span>
      </Link>

      <nav className="sb-nav" aria-label="Sekce">
        <NavLink className="sb-item" to="/app/videa">
          <PlaySquare aria-hidden /> Videa <em>{FEED_COUNT}</em>
        </NavLink>
        <NavLink className="sb-item" to="/app/kurzy" end>
          <GraduationCap aria-hidden /> Kurzy <em>{COURSES.length}</em>
        </NavLink>
        <NavLink className="sb-item" to="/app/ulozene">
          <Bookmark aria-hidden /> Uložené {saved.length > 0 && <em>{saved.length}</em>}
        </NavLink>
      </nav>

      <div className="sb-label">Moje kurzy</div>
      <nav className="sb-nav" aria-label="Kurzy">
        {COURSES.map((c) => (
          <SideCourse key={c.id} id={c.id} />
        ))}
      </nav>

      <div className="sb-foot">
        <Link className="sb-item" to="/">
          <ArrowUpRight aria-hidden /> Web akademie
        </Link>
        <NavLink className="sb-user" to="/app/ucet">
          <Avatar name={`${USER.first} ${USER.last}`} size={30} />
          <span>
            <b>
              {USER.first} {USER.last}
            </b>
            <small>Roční předplatné</small>
          </span>
        </NavLink>
      </div>
    </aside>
  )
}

function SideCourse({ id }: { id: string }) {
  const c = course(id)!
  const p = useCourseProgress(c)
  return (
    <NavLink className="sb-course" to={`/app/kurzy/${c.id}`} title={`${c.title}: ${p.done} z ${p.total} lekcí`}>
      <MiniRing pct={p.pct} />
      <span>{c.short}</span>
    </NavLink>
  )
}

/** Drobečková navigace podle adresy. */
function Crumbs() {
  const { pathname } = useLocation()
  const [, , section, a, b] = pathname.split('/')
  const parts: { label: string; to?: string }[] = []
  if (section === 'videa') {
    parts.push({ label: 'Videa', to: '/app/videa' })
    if (a && vid(a)) parts.push({ label: vid(a)!.t })
  } else if (section === 'kurzy') {
    parts.push({ label: 'Kurzy', to: '/app/kurzy' })
    const c = a ? course(a) : undefined
    if (c) {
      parts.push({ label: c.short, to: `/app/kurzy/${c.id}` })
      if (b && vid(b)) parts.push({ label: `Lekce ${courseLessons(c).indexOf(b) + 1}` })
    }
  } else if (section === 'ulozene') parts.push({ label: 'Uložené' })
  else if (section === 'ucet') parts.push({ label: 'Účet' })
  // na hlavních stránkách je název v nadpisu, drobečky jen u vnořených
  if (parts.length < 2) return <div className="crumbs" />

  return (
    <nav className="crumbs" aria-label="Umístění">
      {parts.map((p, i) => {
        const last = i === parts.length - 1
        return (
          <span key={i} className="crumb">
            {i > 0 && <ChevronRight aria-hidden />}
            {last || !p.to ? <b aria-current="page">{p.label}</b> : <Link to={p.to}>{p.label}</Link>}
          </span>
        )
      })}
    </nav>
  )
}

function TabBar() {
  const items = [
    { to: '/app/videa', label: 'Videa', icon: PlaySquare },
    { to: '/app/kurzy', label: 'Kurzy', icon: GraduationCap },
    { to: '/app/ulozene', label: 'Uložené', icon: Bookmark },
    { to: '/app/ucet', label: 'Účet', icon: CircleUserRound },
  ]
  return (
    <nav className="tabbar" aria-label="Sekce">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to}>
          <Icon aria-hidden />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
