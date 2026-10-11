import { useEffect, useRef } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { CircleUserRound, House, LayoutGrid } from 'lucide-react'
import { Logo } from '../components/Logo'
import { COURSES, USER } from '../data/catalog'
import { useCzechTypography } from '../lib/czech'
import { Ring, SearchBox, ToastProvider } from './ui'
import { useCourseProgress } from './hooks'
import { Home } from './pages/Home'
import { Courses } from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { Lesson } from './pages/Lesson'
import { Account } from './pages/Account'
import './app.css'

export default function AppRoutes() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="kurzy" element={<Courses />} />
          <Route path="kurzy/:courseId" element={<CourseDetail />} />
          <Route path="lekce/:videoId" element={<Lesson />} />
          <Route path="ucet" element={<Account />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

const NAV = [
  { to: '/app', label: 'Domů', icon: House, end: true },
  { to: '/app/kurzy', label: 'Kurzy', icon: LayoutGrid, end: true },
  { to: '/app/ucet', label: 'Účet', icon: CircleUserRound, end: false },
]

function Shell() {
  const root = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useCzechTypography(root)

  // Tmavý režim podle systému se týká jen aplikace, ne prodejního webu.
  useEffect(() => {
    document.documentElement.classList.add('in-app')
    return () => document.documentElement.classList.remove('in-app')
  }, [])

  // Nová stránka začíná nahoře.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div ref={root} className="app">
      <aside className="side">
        <Link className="side-brand" to="/app" aria-label="Akademie ZOFI, domů">
          <Logo />
          <span>Akademie</span>
        </Link>
        <SearchBox shortcut />
        <nav className="side-nav" aria-label="Aplikace">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="side-item">
              <Icon aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-label">Moje kurzy</div>
        <nav className="side-nav" aria-label="Moje kurzy">
          {COURSES.map((c) => (
            <SideCourse key={c.id} id={c.id} />
          ))}
        </nav>
        <Link to="/app/ucet" className="side-user">
          <span className="avatar">
            {USER.first[0]}
            {USER.last[0]}
          </span>
          <span>
            <b>
              {USER.first} {USER.last}
            </b>
            <small>Roční předplatné</small>
          </span>
        </Link>
      </aside>

      <header className="topbar">
        <Link className="side-brand" to="/app" aria-label="Akademie ZOFI, domů">
          <Logo />
          <span>Akademie</span>
        </Link>
        <Link to="/app/ucet" className="avatar" aria-label="Účet">
          {USER.first[0]}
          {USER.last[0]}
        </Link>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Aplikace">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/app'} className="tab">
            <Icon aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function SideCourse({ id }: { id: string }) {
  const c = COURSES.find((x) => x.id === id)!
  const p = useCourseProgress(c)
  return (
    <NavLink to={`/app/kurzy/${c.id}`} className="side-item">
      <Ring pct={p.pct} size={18} stroke={3} />
      {c.short}
    </NavLink>
  )
}
