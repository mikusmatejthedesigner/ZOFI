import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Play, Rotate3d } from 'lucide-react'
import { course, courseLessons, plural, videoHref, vid } from '../data/catalog'
import type { Product } from './washer/WasherScene'
import talir800 from '../assets/renders/talir-drevostavba-800.webp'
import talir1600 from '../assets/renders/talir-drevostavba-1600.webp'
import beton800 from '../assets/renders/hmozdinka-beton-800.webp'
import beton1600 from '../assets/renders/hmozdinka-beton-1600.webp'
import talirRender from '../assets/renders/talir-zofitherm.webp'
import kotvaRender from '../assets/renders/kotva-zofitherm.webp'
import hromosvod800 from '../assets/renders/hromosvod-800.webp'
import hromosvod1600 from '../assets/renders/hromosvod-1600.webp'
import montaz800 from '../assets/renders/montaz-prvku-800.webp'
import montaz1600 from '../assets/renders/montaz-prvku-1600.webp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WasherScene = lazy(() => import('./washer/WasherScene'))

/* Produkty ve 3D a rendery z praxe. Popisky ověřit s technikem ZOFI. */
const PRODUCTS: Record<Product, { name: string; text: string; poster: string }> = {
  talir: { name: 'Talíř ZOFITHERM', text: 'Kotvení izolantu šroubem, například u dřevostaveb.', poster: talirRender },
  kotva: { name: 'Spirálová kotva', text: 'Montáž prvků přímo do izolantu.', poster: kotvaRender },
}
const SHOTS = [
  {
    t: 'Hromosvod',
    d: 'Držák hromosvodu na spirálové kotvě v izolantu.',
    alt: 'Držák hromosvodu na spirálové kotvě ZOFITHERM v zateplení',
    big: hromosvod1600,
    small: hromosvod800,
    lesson: 'aEtE0ip0ZkM',
  },
  {
    t: 'Prvky na fasádě',
    d: 'Montáž prvků do izolantu spirálovými kotvami.',
    alt: 'Montáž prvku na zateplenou fasádu spirálovými kotvami a aku vrtačkou',
    big: montaz1600,
    small: montaz800,
    lesson: 'Xzvpp_Q29Yc',
  },
  {
    t: 'Dřevostavba',
    d: 'Izolant přichycený šroubem s talířem ZOFITHERM.',
    alt: 'Kotvení izolantu do dřevostavby šroubem s talířem ZOFITHERM',
    big: talir1600,
    small: talir800,
    lesson: '',
  },
  {
    t: 'Beton',
    d: 'Kotvení prvků přes zateplení do nosné stěny.',
    alt: 'Kotvení do betonu hmoždinkou se závitovou tyčí',
    big: beton1600,
    small: beton800,
    lesson: '',
  },
]

/** Kotvení: 3D talíř ZOFITHERM k otočení a rendery z praxe, odkaz na kurz Kotvení. */
export function Anchoring() {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [live] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [drag] = useState(() => window.matchMedia('(hover: hover)').matches)
  const [product, setProduct] = useState<Product>('kotva')
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

  const info = PRODUCTS[product]
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
            <div className="anc-switch" role="group" aria-label="Produkt ve 3D">
              {(Object.keys(PRODUCTS) as Product[]).map((p) => (
                <button key={p} className={p === product ? 'on' : ''} aria-pressed={p === product} onClick={() => setProduct(p)}>
                  {PRODUCTS[p].name}
                </button>
              ))}
            </div>
            <div className="anc-stage">
              {live && near ? (
                <Suspense fallback={<img className="anc-poster" src={info.poster} alt="" />}>
                  <WasherScene mode="inspect" progress={progress} active={visible} drag={drag} product={product} />
                </Suspense>
              ) : (
                <img className="anc-poster" src={info.poster} alt={info.name} />
              )}
            </div>
            <div className="anc-caption">
              <span>
                <b>{info.name}</b>
                {info.text} {drag && live ? 'Chyťte ho myší a otočte si ho.' : ''}
              </span>
              {drag && live && <Rotate3d aria-hidden />}
            </div>
          </div>

          {SHOTS.map((sh) => {
            const x = sh.lesson ? vid(sh.lesson) : undefined
            return (
              <Link
                key={sh.t}
                className="anc-shot"
                to={x ? videoHref(x.v) : `/app/kurzy/${k.id}`}
                data-reveal
              >
                <img
                  src={sh.big}
                  srcSet={`${sh.small} 800w, ${sh.big} 1600w`}
                  sizes="(max-width: 900px) 100vw, 40vw"
                  alt={sh.alt}
                  loading="lazy"
                />
                <span className="anc-cap">
                  <b>{sh.t}</b>
                  {sh.d}
                  {x && (
                    <small>
                      <Play aria-hidden fill="currentColor" strokeWidth={0} /> Lekce: {x.t}
                    </small>
                  )}
                </span>
              </Link>
            )
          })}
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
