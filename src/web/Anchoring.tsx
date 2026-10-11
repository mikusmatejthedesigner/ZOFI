import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Rotate3d } from 'lucide-react'
import { course, courseLessons, plural } from '../data/catalog'
import talir800 from '../assets/renders/talir-drevostavba-800.webp'
import talir1600 from '../assets/renders/talir-drevostavba-1600.webp'
import beton800 from '../assets/renders/hmozdinka-beton-800.webp'
import beton1600 from '../assets/renders/hmozdinka-beton-1600.webp'
import talirRender from '../assets/renders/talir-zofitherm.webp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WasherScene = lazy(() => import('./washer/WasherScene'))

/** Kotvení: 3D talíř ZOFITHERM k otočení a rendery z praxe, odkaz na kurz Kotvení. */
export function Anchoring() {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [live] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [drag] = useState(() => window.matchMedia('(hover: hover)').matches)
  const k = course('kotveni')!
  const n = courseLessons(k).length

  // 3D se načte až kousek před sekcí a mimo obrazovku se nekreslí
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '600px' })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    pre.observe(el)
    io.observe(el)
    return () => {
      pre.disconnect()
      io.disconnect()
    }
  }, [])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (s) => {
          progress.current = s.progress
        },
      })
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // rendery se při scrollu pomalu přibližují
        gsap.utils.toArray<HTMLElement>('.anc-shot img').forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.18, yPercent: -4 },
            {
              scale: 1.02,
              yPercent: 4,
              ease: 'none',
              scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="kotveni" className="sec anc">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <span className="eyebrow">ZOFITHERM</span>
          <h2 className="h2">Detaily, které na YouTube neuvidíte.</h2>
          <p className="lead">
            Kotvení rozhoduje, jestli fasáda vydrží. V kurzu {k.title} ukazujeme vlastní prvky ZOFITHERM přímo na
            stavbě, krok za krokem.
          </p>
        </header>

        <div className="anc-grid">
          <div className="anc-3d" data-reveal>
            <div className="anc-stage">
              {live && near ? (
                <Suspense fallback={<img className="anc-poster" src={talirRender} alt="" />}>
                  <WasherScene mode="inspect" progress={progress} active={visible} drag={drag} />
                </Suspense>
              ) : (
                <img className="anc-poster" src={talirRender} alt="Kotvicí talíř ZOFITHERM" />
              )}
            </div>
            <div className="anc-caption">
              <span>
                <b>Kotvicí talíř ZOFITHERM</b>
                {drag && live ? 'Chyťte ho myší a otočte si ho.' : 'Model ve 3D, otáčí se při scrollu.'}
              </span>
              {drag && live && <Rotate3d aria-hidden />}
            </div>
          </div>

          <figure className="anc-shot" data-reveal>
            <img
              src={talir1600}
              srcSet={`${talir800} 800w, ${talir1600} 1600w`}
              sizes="(max-width: 900px) 100vw, 40vw"
              alt="Kotvení izolantu do dřevostavby šroubem s talířem ZOFITHERM"
              loading="lazy"
            />
            <figcaption>
              <b>Dřevostavba</b>
              Izolant přichycený šroubem s talířem ZOFITHERM.
            </figcaption>
          </figure>

          <figure className="anc-shot" data-reveal>
            <img
              src={beton1600}
              srcSet={`${beton800} 800w, ${beton1600} 1600w`}
              sizes="(max-width: 900px) 100vw, 40vw"
              alt="Kotvení do betonu hmoždinkou se závitovou tyčí"
              loading="lazy"
            />
            <figcaption>
              <b>Beton</b>
              Kotvení prvků přes zateplení do nosné stěny.
            </figcaption>
          </figure>
        </div>

        <div className="anc-cta" data-reveal>
          <Link className="btn btn-lg" to={`/app/kurzy/${k.id}`}>
            Kurz {k.short}: {n} {plural(n, 'lekce', 'lekce', 'lekcí')} <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
