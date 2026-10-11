import { useEffect, useRef } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router'
import { CircleUserRound, GraduationCap, PlaySquare } from 'lucide-react'
import { Logo } from '../components/Logo'
import { USER, videoHref, vid } from '../data/catalog'
import { useCzechTypography } from '../lib/czech'
import { Avatar, ToastProvider } from './ui'
import { Videos } from './pages/Videos'
import { Watch } from './pages/Watch'
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
          <Route index element={<ToVideos />} />
          <Route path="videa" element={<Videos />} />
          <Route path="videa/:videoId" element={<Watch />} />
          <Route path="kurzy" element={<Courses />} />
          <Route path="kurzy/:courseId" element={<CourseDetail />} />
          <Route path="kurzy/:courseId/:lessonId" element={<Lesson />} />
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

/* Dvě hlavní sekce aplikace. Účet je pod avatarem. */
const SECTIONS = [
  { to: '/app/videa', label: 'Videa', icon: PlaySquare },
  { to: '/app/kurzy', label: 'Kurzy', icon: GraduationCap },
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

  const name = `${USER.first} ${USER.last}`
  return (
    <div ref={root} className="app">
      <header className="topnav">
        <div className="topnav-in">
          <Link className="brand-app" to="/app/videa" aria-label="Akademie ZOFI">
            <Logo />
            <span>Akademie</span>
          </Link>
          <nav className="seg-nav" aria-label="Sekce">
            {SECTIONS.map(({ to, label }) => (
              <NavLink key={to} to={to} className="seg-link">
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/app/ucet" className="topnav-user" aria-label="Účet">
            <Avatar name={name} size={32} />
          </NavLink>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Sekce">
        {[...SECTIONS, { to: '/app/ucet', label: 'Účet', icon: CircleUserRound }].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="tab">
            <Icon aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
