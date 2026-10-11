import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Check, ChevronDown, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import { course, courseLessons, courseSecs, fmtDuration, plural, secs, vid, type Course } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Gauge } from '../ui'
import { useCourseProgress, useTitle } from '../hooks'

export function CourseDetail() {
  const { courseId = '' } = useParams()
  if (!course(courseId)) return <Navigate to="/app/kurzy" replace />
  return <CourseView key={courseId} id={courseId} />
}

function CourseView({ id }: { id: string }) {
  const c = course(id)!
  useTitle(c.short)
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const all = courseLessons(c)
  const [closed, setClosed] = useState<number[]>([])
  const left = all.filter((l) => !watched.includes(l)).reduce((a, l) => a + secs(vid(l)!.d), 0)
  const cta = p.done === 0 ? 'Začít kurz' : p.done === p.total ? 'Pustit znovu' : 'Pokračovat'

  return (
    <div className="page">
      <div className="course">
        <aside className="course-aside">
          <div className="thumb">
            <Thumb video={vid(c.cover)!} size="lg" eager />
          </div>
          <div className="course-info">
            <span className="ctile-level">{c.level}</span>
            <h1>{c.title}</h1>
            <p>{c.desc}</p>
            <div className="course-stats">
              <div>
                <b>{all.length}</b>
                <small>{plural(all.length, 'lekce', 'lekce', 'lekcí')}</small>
              </div>
              <div>
                <b>{c.chapters.length}</b>
                <small>{plural(c.chapters.length, 'kapitola', 'kapitoly', 'kapitol')}</small>
              </div>
              <div>
                <b>{fmtDuration(courseSecs(c))}</b>
                <small>celkem</small>
              </div>
            </div>
            <div className="course-progress">
              <Gauge pct={p.pct} />
              <span>
                <b>
                  {p.done} z {p.total} {plural(p.total, 'lekce', 'lekcí', 'lekcí')} hotovo
                </b>
                <small>{p.done === p.total ? 'Kurz máte dokončený' : `Zbývá ${fmtDuration(left)}`}</small>
              </span>
            </div>
            <Link className="b b-accent b-lg" to={`/app/kurzy/${c.id}/${p.next}`}>
              <Play aria-hidden fill="currentColor" strokeWidth={0} />
              {cta}
            </Link>
            <Learn c={c} className="learn-side" />
          </div>
        </aside>

        <section aria-label="Osnova kurzu">
          <div className="sec-title first">
            <h2>Osnova</h2>
            <button
              className="b b-ghost"
              onClick={() => setClosed(closed.length ? [] : c.chapters.map((_, i) => i))}
            >
              {closed.length ? 'Rozbalit vše' : 'Sbalit vše'}
            </button>
          </div>
          {c.chapters.map((ch, ci) => {
            const dur = ch.l.reduce((a, l) => a + secs(vid(l)!.d), 0)
            const doneIn = ch.l.filter((l) => watched.includes(l)).length
            const isClosed = closed.includes(ci)
            return (
              <div className={`chapter${isClosed ? ' closed' : ''}`} key={ch.t}>
                <button
                  className="chapter-head"
                  aria-expanded={!isClosed}
                  onClick={() => setClosed(isClosed ? closed.filter((x) => x !== ci) : [...closed, ci])}
                >
                  <ChevronDown aria-hidden />
                  <b>
                    {ci + 1}. {ch.t}
                  </b>
                  <small>
                    {doneIn}/{ch.l.length} · {fmtDuration(dur)}
                  </small>
                </button>
                <ol>
                  {ch.l.map((l) => {
                    const x = vid(l)!
                    const done = watched.includes(l)
                    const isNext = l === p.next && !done
                    return (
                      <li key={l}>
                        <Link className={`lrow${isNext ? ' next' : ''}`} to={`/app/kurzy/${c.id}/${l}`}>
                          <span className={`state${done ? ' done' : isNext ? ' now' : ''}`}>
                            {done ? (
                              <Check strokeWidth={3.5} aria-label="Zhlédnuto" />
                            ) : isNext ? (
                              <Play fill="currentColor" strokeWidth={0} aria-label="Na řadě" />
                            ) : (
                              all.indexOf(l) + 1
                            )}
                          </span>
                          <span className="thumb">
                            <Thumb video={x} size="sm" />
                          </span>
                          <span>
                            <b>{x.t}</b>
                            <small>{x.desc}</small>
                          </span>
                          <span className="t">
                            {isNext && <span className="tag">Na řadě</span>}
                            {x.d}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
          {/* na úzkém displeji až pod osnovou */}
          <Learn c={c} className="learn-end" />
        </section>
      </div>
    </div>
  )
}

function Learn({ c, className }: { c: Course; className: string }) {
  return (
    <div className={className}>
      <div className="learn">
        <h3>Co se naučíte</h3>
        <ul>
          {c.out.map((o) => (
            <li key={o}>
              <Check aria-hidden strokeWidth={2.5} />
              {o}
            </li>
          ))}
        </ul>
      </div>
      <div className="learn">
        <h3>Pro koho</h3>
        <p className="learn-p">{c.forWho}</p>
      </div>
    </div>
  )
}
