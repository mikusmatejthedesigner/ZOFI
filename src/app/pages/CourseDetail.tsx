import { Link, Navigate, useParams } from 'react-router'
import { Check, ChevronLeft, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import { course, courseLessons, courseSecs, fmtDuration, plural, secs, vid } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Bar } from '../ui'
import { useCourseProgress, useTitle } from '../hooks'

export function CourseDetail() {
  const { courseId = '' } = useParams()
  const c = course(courseId)
  if (!c) return <Navigate to="/app/kurzy" replace />
  return <CourseView id={c.id} />
}

function CourseView({ id }: { id: string }) {
  const c = course(id)!
  useTitle(c.short)
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const cover = vid(c.cover)!
  const all = courseLessons(c)

  return (
    <div className="page">
      <Link className="back" to="/app/kurzy">
        <ChevronLeft aria-hidden /> Kurzy
      </Link>

      <section className="course-hero">
        <Thumb video={cover} size="lg" eager className="course-hero-bg" />
        <div className="course-hero-media thumb">
          <Thumb video={cover} size="lg" eager />
        </div>
        <div className="course-hero-info">
          <span className="chip-level static">{c.level}</span>
          <h1>{c.title}</h1>
          <p>{c.desc}</p>
          <div className="course-hero-meta">
            {all.length} {plural(all.length, 'lekce', 'lekce', 'lekcí')} · {c.chapters.length}{' '}
            {plural(c.chapters.length, 'kapitola', 'kapitoly', 'kapitol')} · {fmtDuration(courseSecs(c))}
          </div>
          <div className="course-hero-progress">
            <Bar pct={p.pct} />
            <span>{p.done ? `${p.done} z ${p.total} lekcí hotovo` : 'Zatím nezačato'}</span>
          </div>
          <Link className="btn" to={`/app/lekce/${p.next}`}>
            <Play aria-hidden fill="currentColor" />
            {p.done === 0 ? 'Začít kurz' : p.done === p.total ? 'Pustit znovu' : 'Pokračovat'}
          </Link>
        </div>
      </section>

      <section className="block learn">
        <div>
          <h2>Co se naučíte</h2>
          <p className="for-who">{c.forWho}</p>
        </div>
        <ul>
          {c.out.map((o) => (
            <li key={o}>
              <Check aria-hidden strokeWidth={2.5} />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Osnova</h2>
        </div>
        {c.chapters.map((ch, ci) => {
          const dur = ch.l.reduce((a, l) => a + secs(vid(l)!.d), 0)
          return (
            <div className="chapter" key={ch.t}>
              <div className="chapter-head">
                <span>Kapitola {ci + 1}</span>
                <h3>{ch.t}</h3>
                <em>
                  {ch.l.length} {plural(ch.l.length, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(dur)}
                </em>
              </div>
              <ol className="lrows">
                {ch.l.map((l) => {
                  const x = vid(l)!
                  const done = watched.includes(l)
                  const isNext = l === p.next && !done
                  return (
                    <li key={l}>
                      <Link className={`lrow${isNext ? ' next' : ''}`} to={`/app/lekce/${l}`}>
                        <span className={`lrow-state${done ? ' done' : ''}`}>
                          {done ? <Check strokeWidth={3} aria-label="Zhlédnuto" /> : all.indexOf(l) + 1}
                        </span>
                        <span className="thumb">
                          <Thumb video={x} size="sm" />
                        </span>
                        <span className="lrow-text">
                          <b>{x.t}</b>
                          <small>{x.desc}</small>
                        </span>
                        {isNext && <span className="lrow-badge">Na řadě</span>}
                        <span className="lrow-dur">{x.d}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>
          )
        })}
      </section>
    </div>
  )
}
