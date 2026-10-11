import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Particles } from '@/components/magicui/particles'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Check, Factory, HardHat, Hammer, House, Minus, Paintbrush } from 'lucide-react'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import Magnet from '../components/reactbits/Magnet'
import { COURSES, PLANS, VIDEOS, courseLessons, kc, videoHref, yearlySaving } from '../data/catalog'
import { goTo } from '../lib/smooth-scroll'

const INTRO = '7DFgjeVmT1Y'

/* ---------- pro koho ---------- */
const AUDIENCE = [
  {
    icon: House,
    t: 'Majitel domu',
    d: 'Rozumíte tomu, co vám firma na fasádě dělá. Víte, na co se ptát a kam se při přejímce dívat.',
  },
  {
    icon: Hammer,
    t: 'Stavíte svépomocí',
    d: 'Celý postup od přípravy po přejímku, krok za krokem a s detaily, na kterých záleží nejvíc.',
  },
  {
    icon: HardHat,
    t: 'Fasádník',
    d: 'Detaily a kotvení na úrovni, kterou ocení každý zákazník. Postupy máte po ruce i na lešení.',
  },
]

export function Audience() {
  return (
    <section className="sec">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <span className="eyebrow">Pro koho</span>
          <h2 className="h2">Pro každého, kdo stojí u fasády.</h2>
        </header>
        <div className="aud-grid">
          {AUDIENCE.map(({ icon: Icon, t, d }) => (
            <SpotlightCard key={t} className="aud" theme="light" spotlightColor="#e62152" data-reveal>
              <span className="aud-ico">
                <Icon aria-hidden />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- srovnání s YouTube ---------- */
export function Compare() {
  const lessons = COURSES.reduce((a, c) => a + courseLessons(c).length, 0)
  const yes = <Check className="yes" aria-label="ano" strokeWidth={2.5} />
  const no = <Minus className="no" aria-label="ne" />
  const rows: [string, ReactNode, ReactNode][] = [
    ['Ukázky postupů a novinky', yes, yes],
    ['Celé kurzy v pořadí stavby', 'vybrané díly', `${COURSES.length} kurzy, ${lessons} lekcí`],
    ['Kapitoly a hlavní body u lekcí', no, yes],
    ['Pokračování tam, kde jste skončili', no, yes],
    ['Bez reklam a doporučených videí', no, yes],
  ]
  return (
    <section className="sec mist">
      <div className="wrap">
        <header className="sec-head" data-reveal>
          <span className="eyebrow">Přišli jste z YouTube?</span>
          <h2 className="h2">Na YouTube vidíte jak. V akademii pochopíte proč.</h2>
        </header>
        <div className="cmp-grid">
          <div className="cmp" data-reveal>
            <div className="cmp-row h">
              <span />
              <span>YouTube</span>
              <span className="y">Akademie</span>
            </div>
            {rows.map(([label, a, b]) => (
              <div className="cmp-row" key={label}>
                <span>{label}</span>
                <span>{a}</span>
                <span className="y">{b}</span>
              </div>
            ))}
          </div>
          <div className="trust" data-reveal>
            <div className="trust-n">
              850<em>+</em>
            </div>
            <p>
              <strong>zateplených domů.</strong> Za akademií stojí ZOFI, specialista na fasády z Olomouce. Učíme jen to,
              co sami děláme každý den.
            </p>
            <ul>
              <li>
                <Factory aria-hidden />
                <span>
                  <b>Vlastní značka ZOFITHERM</b>
                  Kotvicí prvky a detaily, které sami vyvíjíme a používáme na stavbách.
                </span>
              </li>
              <li>
                <Paintbrush aria-hidden />
                <span>
                  <b>Prodejna a míchárna omítek</b>V Olomouci vám namícháme odstín a poradíme s materiálem.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- ceník ---------- */
export function Pricing() {
  const nav = useNavigate()
  const [period, setPeriod] = useState<'rok' | 'mesic'>('rok')
  const plan = PLANS[period]
  const free = VIDEOS.filter((x) => x.free).length
  const lessons = COURSES.reduce((a, c) => a + courseLessons(c).length, 0)

  return (
    <section id="cenik" className="sec">
      <div className="wrap">
        <header className="sec-head center" data-reveal>
          <span className="eyebrow">Ceník</span>
          <h2 className="h2">Jedno předplatné. Celá akademie.</h2>
          <p className="lead">Všechny kurzy a videa. Nové lekce bez příplatku. Zrušíte kdykoliv.</p>
          <div className="seg" role="group" aria-label="Období platby">
            <button className={period === 'rok' ? 'on' : ''} onClick={() => setPeriod('rok')} aria-pressed={period === 'rok'}>
              Ročně <small>ušetříte {kc(yearlySaving)}</small>
            </button>
            <button
              className={period === 'mesic' ? 'on' : ''}
              onClick={() => setPeriod('mesic')}
              aria-pressed={period === 'mesic'}
            >
              Měsíčně
            </button>
          </div>
        </header>

        <div className="plans">
          <div className="plan" data-reveal>
            <div className="plan-name">Zdarma</div>
            <div className="plan-price">
              0 Kč <small>navždy</small>
            </div>
            <div className="plan-per">Úvod do seriálu a vybrané ukázky.</div>
            <ul>
              <li>
                <Check aria-hidden /> {free} videí k vyzkoušení
              </li>
              <li>
                <Check aria-hidden /> Bez platební karty
              </li>
            </ul>
            <Link className="btn btn-ghost" to={videoHref(INTRO)}>
              Pustit úvod
            </Link>
          </div>

          <div className="plan pick" data-reveal>
            <BorderBeam size={180} duration={7} colorFrom="#e62152" colorTo="#ffb020" borderWidth={2} />
            <span className="plan-badge">Celá akademie</span>
            <div className="plan-name">Předplatné</div>
            <div className="plan-price" key={period}>
              {kc(plan.price)} <small>/ {plan.unit}</small>
            </div>
            <div className="plan-per">
              {period === 'rok' ? `Vychází na ${kc(plan.monthly)} měsíčně.` : 'Platíte měsíc po měsíci.'} Zrušíte
              kdykoliv.
            </div>
            <ul>
              <li>
                <Check aria-hidden /> {COURSES.length} kurzy, {lessons} lekcí a {VIDEOS.length} videí
              </li>
              <li>
                <Check aria-hidden /> Kapitoly a hlavní body u každé lekce
              </li>
              <li>
                <Check aria-hidden /> Průběh v počítači i v mobilu
              </li>
              <li>
                <Check aria-hidden /> Nové lekce bez příplatku
              </li>
              <li>
                <Check aria-hidden /> Bez reklam
              </li>
            </ul>
            <ShimmerButton
              className="shimmer-cta"
              background="#e62152"
              shimmerColor="#ffd2dd"
              shimmerDuration="2.6s"
              onClick={() => nav('/app/videa?vitejte=1')}
            >
              Předplatit {period === 'rok' ? 'na rok' : 'na měsíc'}
            </ShimmerButton>
          </div>
        </div>
        <p className="team-note" data-reveal>
          Jste realizační firma? Pro celou partu nabízíme týmové licence.{' '}
          <a className="link-more" href="mailto:info@zofi.cz">
            Napište nám
          </a>
        </p>
      </div>
    </section>
  )
}

/* ---------- časté otázky ---------- */
const FAQ: [string, string][] = [
  [
    'Pro koho je akademie?',
    'Pro majitele domů, kteří chtějí rozumět tomu, co jim firma na fasádě dělá, pro stavebníky, kteří zateplují svépomocí, a pro fasádníky, kteří chtějí mít postupy a detaily po ruce i na stavbě.',
  ],
  [
    'Čím se liší od videí na YouTube?',
    'Na YouTube najdete ukázky a vybrané díly. V akademii jsou celé kurzy v pořadí, ve kterém se staví, kapitoly a hlavní body u každé lekce a aplikace, která si pamatuje, kde jste skončili. Bez reklam.',
  ],
  [
    'Jak funguje kurz?',
    'Kurz je rozdělený do kapitol a lekcí. Každá lekce má video, kapitoly, na které klepnete, a hlavní body. Aplikace ukazuje, kolik vám zbývá.',
  ],
  ['Můžu předplatné zrušit?', 'Ano, kdykoliv v nastavení účtu. Přístup vám zůstane do konce zaplaceného období.'],
  [
    'Vystavíte fakturu na firmu?',
    'Ano. Při objednávce zadáte IČO a fakturu pošleme e-mailem. Pro realizační firmy s více lidmi nabízíme týmové licence.',
  ],
  [
    'Funguje to i v mobilu?',
    'Ano. Akademie funguje v počítači, tabletu i telefonu a průběh se mezi nimi synchronizuje.',
  ],
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="otazky" className="sec mist">
      <div className="wrap">
        <header className="sec-head center" data-reveal>
          <h2 className="h2">Časté otázky</h2>
        </header>
        <div className="faq" data-reveal>
          {FAQ.map(([q, a], i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={q}>
              <button
                className="faq-q"
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {q}
                <i aria-hidden />
              </button>
              <div className="faq-a" id={`faq-${i}`} role="region">
                <div>
                  <p>{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- závěrečná výzva ---------- */
export function FinalCta() {
  return (
    <section className="final dark">
      <div className="final-glow" aria-hidden />
      <Particles className="final-particles" quantity={140} ease={70} color="#ff6a88" staticity={40} />
      <div className="wrap" data-reveal>
        <h2 className="h2">Začněte první lekcí.</h2>
        <p className="lead">Úvod do seriálu je zdarma. Zbytek odemkne předplatné a celou akademii máte v kapse.</p>
        <div className="hero-cta">
          <Magnet padding={40} magnetStrength={7}>
            <a className="btn btn-lg" href="#cenik" onClick={goTo('#cenik')}>
              Předplatit
            </a>
          </Magnet>
          <Link className="btn btn-lg btn-glass" to={videoHref(INTRO)}>
            Pustit úvod zdarma
          </Link>
        </div>
      </div>
    </section>
  )
}
