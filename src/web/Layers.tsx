import { useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollToTarget } from '../lib/smooth-scroll'

/* Skladba kontaktního zateplovacího systému (texty z prototypu, k ověření technikem ZOFI). */
const LAYERS = [
  {
    n: 'Podklad',
    mm: 'zdivo, omítka nebo břízolit',
    t: 'Pevný, suchý a soudržný. Starý břízolit nebo omítku je potřeba nejdřív prověřit, jinak celá fasáda drží jen na prachu.',
    cls: 'l-wall',
    h: 30,
  },
  {
    n: 'Lepicí tmel',
    mm: 'cca 10 mm',
    t: 'Po obvodu desky pruh, uprostřed terče. Lepidlo má pokrýt nejméně 40 % plochy desky, jinak se deska může prohýbat a odtrhnout.',
    cls: 'l-glue',
    h: 6,
  },
  {
    n: 'Izolant',
    mm: 'např. 160 mm šedého EPS',
    t: 'Desky se kladou na vazbu jako cihly, bez průběžných spár. Spáry mezi deskami se nesmí zalít lepidlem, vznikl by tepelný most.',
    cls: 'l-eps',
    h: 40,
  },
  {
    n: 'Hmoždinka',
    mm: 'zápustná montáž',
    t: 'Hmoždinka se zapustí do izolantu a otvor se zakryje zátkou. Na hotové fasádě pak nejsou vidět světlé tečky v místech kotvení.',
    cls: 'l-dowel',
    h: 0,
  },
  {
    n: 'Armovací vrstva',
    mm: 'stěrka se síťovinou, cca 4 mm',
    t: 'Síťovina musí být zatlačená ve stěrce, ne ležet na izolantu. Pruhy se překrývají aspoň o 10 cm a v rozích otvorů patří diagonály.',
    cls: 'l-mesh',
    h: 6,
  },
  {
    n: 'Penetrace',
    mm: 'podkladní nátěr',
    t: 'Sjednotí savost podkladu pod omítkou. Omítka pak tuhne všude stejně a nevzniknou na ní mapy.',
    cls: 'l-primer',
    h: 2,
  },
  {
    n: 'Omítka',
    mm: 'silikonová, zrno 1,5 až 2 mm',
    t: 'Natahuje se v jednom záběru od rohu k rohu. Přerušená práce uprostřed stěny je na fasádě vidět navždy.',
    cls: 'l-render',
    h: 6,
  },
]

const GAP = 30
/** Výška horní plochy každé vrstvy: rozložená (s mezerami) a složená. */
const zAt = (gap: number) => {
  let z = 0
  return LAYERS.map((l, i) => (z += l.h + (i ? gap : 0)))
}
const EXPLODED = zAt(GAP)
const ASSEMBLED = zAt(0)

export function Layers() {
  const ref = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        const slabs = gsap.utils.toArray<HTMLElement>('.slab')
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: '.layers-pin',
            start: 'top top',
            end: `+=${LAYERS.length * 70}%`,
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              const t = self.progress * LAYERS.length
              setActive(Math.min(LAYERS.length - 1, Math.round(t)))
              setDone(t > LAYERS.length - 0.4)
            },
          },
        })
        st.current = tl.scrollTrigger ?? null
        // Vrstvy dopadají jedna po druhé, nakonec se složí do hotové fasády.
        slabs.forEach((el, i) => {
          if (i === 0) return
          // Průhlednost jen krátce: s opacity < 1 prohlížeč zplošťuje 3D boky vrstvy.
          tl.fromTo(el, { z: EXPLODED[i] + 320 }, { z: EXPLODED[i], duration: 1 }, i - 1)
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, i - 1)
        })
        tl.to(slabs, { z: (i: number) => ASSEMBLED[i], duration: 1, ease: 'power2.inOut' }, LAYERS.length - 1)
        return () => {
          st.current = null
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  // Klik na vrstvu v seznamu dojede na její místo ve scrollu.
  const jump = (i: number) => {
    const s = st.current
    if (!s) return
    scrollToTarget(s.start + ((s.end - s.start) * i) / LAYERS.length + 2, 0)
  }

  return (
    <section ref={ref} id="vrstvy" className="layers dark">
      <div className="wrap layers-head">
        <span className="eyebrow">Fasáda ve vrstvách</span>
        <h2 className="h2">Sedm vrstev. Každá musí sedět.</h2>
        <p className="lead">
          Kontaktní zateplovací systém je skladba, ve které jedna chyba pokazí všechno nad ní. Projděte si ji vrstvu po
          vrstvě. Ke každé najdete v akademii lekci.
        </p>
      </div>
      <div className="layers-pin">
        <div className="wrap layers-grid">
          <ol className="layers-list">
            {LAYERS.map((l, i) => (
              <li key={l.n} className={i === active ? 'on' : ''} onClick={() => jump(i)}>
                <span className="ln">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>
                    {l.n} <small>{l.mm}</small>
                  </h3>
                  <div className="desc">
                    <div>
                      <p>{l.t}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="stack-stage" aria-hidden>
            <div className="stack">
              {LAYERS.map((l, i) => (
                <div
                  key={l.n}
                  className={`slab ${l.cls}${i === active && !done ? ' on' : ''}`}
                  style={{ '--h': `${l.h}px`, transform: `translateZ(${EXPLODED[i]}px)` } as CSSProperties}
                />
              ))}
            </div>
            <div className="stack-count">
              {done ? (
                <b>Hotová fasáda</b>
              ) : (
                <>
                  <b>{String(active + 1).padStart(2, '0')}</b> / {String(LAYERS.length).padStart(2, '0')}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
