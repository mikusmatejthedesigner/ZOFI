import { useEffect, useRef } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { GraduationCap, House, Library as LibraryIcon, PlaySquare } from 'lucide-react'
import { Logo } from '../components/Logo'
import { USER, videoHref, vid } from '../data/catalog'
import { useCzechTypography } from '../lib/czech'
import { Avatar, ToastProvider } from './ui'
import { Search } from './Search'
import { Home } from './pages/Home'
import { Videos } from './pages/Videos'
import { Watch } from './pages/Watch'
import { Courses } from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { Library } from './pages/Library'
import { Results } from './pages/Results'
import { Account } from './pages/Account'
import './app.css'

gsap.registerPlugin(useGSAP)

export default function AppRoutes() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="videa" element={<Videos />} />
          <Route path="videa/:videoId" element={<Watch />} />
          <Route path="kurzy" element={<Courses />} />
          <Route path="kurzy/:courseId" element={<CourseDetail />} />
          <Route path="kurzy/:courseId/:lessonId" element={<Watch />} />
          <Route path="knihovna" element={<Library />} />
          <Route path="hledat" element={<Results />} />
          <Route path="ucet" element={<Account />} />
          {/* starší odkazy */}
          <Route path="ulozene" element={<Navigate to="/app/knihovna" replace />} />
          <Route path="lekce/:videoId" element={<LegacyLesson />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

function LegacyLesson() {
  const { videoId = '' } = useParams()
  return <Navigate to={vid(videoId) ? videoHref(videoId) : '/app'} replace />
}

/* Čtyři místa, víc není potřeba. Účet je pod avatarem vpravo nahoře. */
const NAV = [
  { to: '/app', label: 'Domů', icon: House, end: true },
  { to: '/app/videa', label: 'Videa', icon: PlaySquare, end: false },
  { to: '/app/kurzy', label: 'Kurzy', icon: GraduationCap, end: false },
  { to: '/app/knihovna', label: 'Knihovna', icon: LibraryIcon, end: false },
]

/* ---------- rozvržení: horní lišta s hledáním, úzký pruh vlevo, obsah ---------- */
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
        gsap.fromTo(main.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out', clearProps: 'all' })
      })
      return () => mm.revert()
    },
    { dependencies: [pathname] },
  )

  return (
    <div ref={root} className="app">
      <header className="tb">
        <Link className="tb-logo" to="/app" aria-label="Akademie ZOFI, domů">
          <Logo />
          <span>Akademie</span>
        </Link>
        <Search />
        <NavLink className="tb-me" to="/app/ucet" aria-label="Účet">
          <Avatar name={`${USER.first} ${USER.last}`} size={32} />
        </NavLink>
      </header>

      <nav className="rail" aria-label="Hlavní">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <span className="rail-ico">
              <Icon aria-hidden />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <main ref={main} className="main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Hlavní">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
