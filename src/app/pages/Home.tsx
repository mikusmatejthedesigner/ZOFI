import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ListVideo, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import {
  COURSES,
  USER,
  chapterOf,
  courseLessons,
  courseOf,
  newest,
  standalone,
  vid,
} from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Bar, CourseCard, VideoCard } from '../ui'
import { useCourseProgress, useTitle, useToast } from '../hooks'

function greeting(h: number) {
  if (h < 10) return 'Dobré ráno'
  if (h < 18) return 'Dobrý den'
  return 'Dobrý večer'
}

export function Home() {
  useTitle('Domů')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const { last, watched } = useProgress()

  // Příchod z ceníku: přivítání a úklid adresy.
  useEffect(() => {
    if (params.get('vitejte')) {
      toast('Vítejte v akademii. Předplatné je aktivní.')
      setParams({}, { replace: true })
    }
  }, [params, setParams, toast])

  const [now] = useState(() => new Date())
  const date = now.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })
  const fallback = courseLessons(COURSES[0]).find((id) => !watched.includes(id)) ?? courseLessons(COURSES[0])[0]
  const currentId = last && vid(last) ? last : fallback

  return (
    <div className="page">
      <header className="page-head">
        <span className="page-kicker">{date.charAt(0).toUpperCase() + date.slice(1)}</span>
        <h1 className="large-title">
          {greeting(now.getHours())}, {USER.vocative}.
        </h1>
      </header>

      <Continue id={currentId} />

      <section className="block">
        <div className="block-head">
          <h2>Moje kurzy</h2>
          <Link to="/app/kurzy">Zobrazit vše</Link>
        </div>
        <div className="grid-3">
          {COURSES.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Nově přidané</h2>
        </div>
        <div className="shelf">
          {newest().map((x) => (
            <VideoCard key={x.v} x={x} />
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Samostatná videa</h2>
          <Link to="/app/kurzy#videa">Zobrazit vše</Link>
        </div>
        <div className="shelf">
          {standalone().map((x) => (
            <VideoCard key={x.v} x={x} />
          ))}
        </div>
      </section>
    </div>
  )
}

/** Velká karta „Pokračovat“ s rozkoukanou lekcí. */
function Continue({ id }: { id: string }) {
  const x = vid(id)!
  const c = courseOf(id)
  const p = useCourseProgress(c ?? COURSES[0])
  const pos = c ? courseLessons(c).indexOf(id) + 1 : 0
  const chapter = c ? c.chapters[chapterOf(c, id)] : undefined

  return (
    <section className="continue">
      <Thumb video={x} size="lg" eager className="continue-bg" />
      <div className="continue-in">
        <span className="continue-kicker">
          Pokračovat{c ? ` · Lekce ${pos} z ${courseLessons(c).length}` : ''}
        </span>
        <h2>{x.t}</h2>
        {c && (
          <p>
            {c.short}
            {chapter ? ` · ${chapter.t}` : ''}
          </p>
        )}
        {c && (
          <div className="continue-progress">
            <Bar pct={p.pct} />
            <span>
              {p.done} z {p.total} lekcí
            </span>
          </div>
        )}
        <div className="continue-cta">
          <Link className="btn btn-light" to={`/app/lekce/${x.v}`}>
            <Play aria-hidden fill="currentColor" />
            Pokračovat
          </Link>
          {c && (
            <Link className="btn btn-glass" to={`/app/kurzy/${c.id}`}>
              <ListVideo aria-hidden />
              Osnova kurzu
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
