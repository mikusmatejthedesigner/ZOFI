import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Logo } from '../components/Logo'
import { initSmoothScroll, goTo } from '../lib/smooth-scroll'
import { useCzechTypography } from '../lib/czech'
import { Hero } from './Hero'
import { Layers } from './Layers'
import { Stats, Statement, Courses, Rail, Bento } from './Showcase'
import { Audience, Compare, Pricing, Faq, FinalCta } from './Sell'
import './web.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Landing() {
  const root = useRef<HTMLDivElement>(null)
  useCzechTypography(root)

  useEffect(() => {
    document.title = 'Fasádní akademie ZOFI'
    window.scrollTo(0, 0)
    return initSmoothScroll()
  }, [])

  // Prvky s [data-reveal] vyjedou zespodu, jakmile se objeví.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('[data-reveal]', { opacity: 0, y: 48 })
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 94%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="site">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Statement />
        <Layers />
        <Courses />
        <Rail />
        <Bento />
        <Audience />
        <Compare />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

function Nav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 8)
      setHidden(y > last && y > 560)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${solid ? ' solid' : ''}${hidden ? ' hide' : ''}`}>
      <div className="wrap nav-in">
        <a className="brand" href="#top" onClick={goTo(0)} aria-label="Fasádní akademie ZOFI, nahoru">
          <Logo />
          <span>Akademie</span>
        </a>
        <nav className="nav-links" aria-label="Hlavní">
          <a href="#kurzy" onClick={goTo('#kurzy')}>
            Kurzy
          </a>
          <a href="#vrstvy" onClick={goTo('#vrstvy')}>
            Jak na fasádu
          </a>
          <a href="#aplikace" onClick={goTo('#aplikace')}>
            Aplikace
          </a>
          <a href="#cenik" onClick={goTo('#cenik')}>
            Ceník
          </a>
          <a href="#otazky" onClick={goTo('#otazky')}>
            Otázky
          </a>
        </nav>
        <div className="nav-end">
          <Link className="nav-login" to="/app">
            Přihlásit se
          </Link>
          <a className="btn btn-sm" href="#cenik" onClick={goTo('#cenik')}>
            Předplatit
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const [year] = useState(() => new Date().getFullYear())
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <span className="brand">
              <Logo />
              <span>Akademie</span>
            </span>
            <p>Videokurzy zateplení natočené na skutečných stavbách. Od ZOFI, specialisty na fasády z Olomouce.</p>
          </div>
          <div>
            <h4>Akademie</h4>
            <ul>
              <li>
                <a href="#kurzy" onClick={goTo('#kurzy')}>
                  Kurzy
                </a>
              </li>
              <li>
                <a href="#cenik" onClick={goTo('#cenik')}>
                  Ceník
                </a>
              </li>
              <li>
                <a href="#otazky" onClick={goTo('#otazky')}>
                  Časté otázky
                </a>
              </li>
              <li>
                <Link to="/app">Přihlásit se</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>ZOFI</h4>
            <ul>
              <li>
                <a href="https://www.zofi.cz" target="_blank" rel="noreferrer">
                  zofi.cz
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@zofifasady" target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  E-shop s materiálem
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>
                <a href="mailto:info@zofi.cz">info@zofi.cz</a>
              </li>
              <li>
                <a href="tel:+420800464646">800 46 46 46</a>
              </li>
              <li>Olomouc-Holice</li>
            </ul>
          </div>
        </div>
        <div className="foot-legal">
          <span>Copyright © {year} ZOFI GROUP. Všechna práva vyhrazena.</span>
          <nav aria-label="Právní informace">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Obchodní podmínky
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Ochrana osobních údajů
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Cookies
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
