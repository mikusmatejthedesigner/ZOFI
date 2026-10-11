import { useEffect, useRef } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Check, ChevronLeft, Play } from 'lucide-react'
import { chapterOf, course, courseLessons, fmtTime, lessonInfo, videoHref, vid, type Course } from '../../data/catalog'
import { progress, useProgress } from '../../lib/progress'
import { Bar, Player, type PlayerHandle } from '../ui'
import { useCourseProgress, useTitle } from '../hooks'

/** Lekce kurzu: přehrávač, kapitoly ve videu, hlavní body a seznam lekcí. */
export function Lesson() {
  const { courseId = '', lessonId = '' } = useParams()
  const c = course(courseId)
  if (!vid(lessonId)) return <Navigate to={c ? `/app/kurzy/${c.id}` : '/app/kurzy'} replace />
  if (!c || !courseLessons(c).includes(lessonId)) return <Navigate to={videoHref(lessonId)} replace />
  // key: přechod na jinou lekci začne s čistým přehrávačem
  return <LessonView key={lessonId} c={c} id={lessonId} />
}

function LessonView({ c, id }: { c: Course; id: string }) {
  const x = vid(id)!
  useTitle(x.t)
  const nav = useNavigate()
  const { watched } = useProgress()
  const player = useRef<PlayerHandle>(null)
  const list = courseLessons(c)
  const idx = list.indexOf(id)
  const next = idx < list.length - 1 ? list[idx + 1] : undefined
  const info = lessonInfo(id)
  const done = watched.includes(id)
  const ci = chapterOf(c, id)

  useEffect(() => {
    progress.setLast(id)
  }, [id])

  const goNext = () => {
    progress.markWatched(id)
    nav(next ? `/app/kurzy/${c.id}/${next}` : `/app/kurzy/${c.id}`)
  }

  return (
    <div className="page lesson">
      <div className="lesson-main">
        <Link className="back" to={`/app/kurzy/${c.id}`}>
          <ChevronLeft aria-hidden /> {c.short}
        </Link>

        <Player video={x} ref={player} />

        <div className="lesson-head">
          <div>
            <span className="page-kicker">
              Lekce {idx + 1} z {list.length} · Kapitola {ci + 1}: {c.chapters[ci].t}
            </span>
            <h1>{x.t}</h1>
          </div>
          <div className="lesson-actions">
            <button
              className={`btn btn-ghost${done ? ' is-done' : ''}`}
              onClick={() => progress.toggle(id)}
              aria-pressed={done}
            >
              <Check aria-hidden strokeWidth={2.5} />
              {done ? 'Hotovo' : 'Označit jako hotové'}
            </button>
            <button className="btn" onClick={goNext}>
              {next ? 'Další lekce' : 'Dokončit kurz'} <ArrowRight aria-hidden />
            </button>
          </div>
        </div>

        <p className="lesson-desc">{x.desc}</p>

        <div className="lesson-cols">
          <section className="panel">
            <h2>Kapitoly ve videu</h2>
            <ol className="moments">
              {info.m.map(([t, name]) => (
                <li key={t}>
                  <button onClick={() => player.current?.seek(t)}>
                    <span>{fmtTime(t)}</span>
                    {name}
                  </button>
                </li>
              ))}
            </ol>
          </section>
          <section className="panel">
            <h2>Hlavní body</h2>
            <ol className="points">
              {info.k.map((k, i) => (
                <li key={k}>
                  <b>{i + 1}</b>
                  {k}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <aside className="lesson-side">
        <Playlist c={c} current={id} />
      </aside>
    </div>
  )
}

function Playlist({ c, current }: { c: Course; current: string }) {
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const all = courseLessons(c)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest' })
  }, [current])

  return (
    <div className="playlist" ref={ref}>
      <div className="playlist-head">
        <Link to={`/app/kurzy/${c.id}`}>{c.title}</Link>
        <div className="playlist-progress">
          <Bar pct={p.pct} />
          <span>
            {p.done} z {p.total}
          </span>
        </div>
      </div>
      {c.chapters.map((ch, ci) => (
        <div key={ch.t} className="playlist-chapter">
          <h3>
            {ci + 1}. {ch.t}
          </h3>
          <ol>
            {ch.l.map((l) => {
              const v = vid(l)!
              const isDone = watched.includes(l)
              return (
                <li key={l}>
                  <Link
                    to={`/app/kurzy/${c.id}/${l}`}
                    className={l === current ? 'on' : ''}
                    aria-current={l === current ? 'page' : undefined}
                  >
                    <span className={`pl-state${isDone ? ' done' : ''}`}>
                      {l === current ? (
                        <Play fill="currentColor" strokeWidth={0} aria-hidden />
                      ) : isDone ? (
                        <Check strokeWidth={3} aria-label="Hotovo" />
                      ) : (
                        all.indexOf(l) + 1
                      )}
                    </span>
                    <span className="pl-title">{v.t}</span>
                    <span className="pl-dur">{v.d}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
