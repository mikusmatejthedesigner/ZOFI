import { Link, Navigate, useParams } from 'react-router'
import { Check, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import { course, courseLessons, courseSecs, fmtDuration, plural, vid } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { useCourseProgress, useTitle } from '../hooks'

export function CourseDetail() {
  const { courseId = '' } = useParams()
  if (!course(courseId)) return <Navigate to="/app/kurzy" replace />
  return <CourseView key={courseId} id={courseId} />
}

/** Kurz jako stránka seriálu: velký úvod a seznam lekcí po kapitolách. */
function CourseView({ id }: { id: string }) {
  const c = course(id)!
  useTitle(c.short)
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const all = courseLessons(c)
  const cta = p.done === 0 ? 'Začít kurz' : p.done === p.total ? 'Pustit znovu' : `Pokračovat lekcí ${all.indexOf(p.next) + 1}`

  return (
    <div>
      <section className="feat show">
        <div className="feat-slide on">
          <Thumb video={vid(c.cover)!} size="lg" eager />
        </div>
        <div className="feat-shade" aria-hidden />
        <div className="feat-in">
          <span className="feat-kicker">Kurz · {c.level}</span>
          <h1>{c.title}</h1>
          <p className="feat-meta">
            {all.length} {plural(all.length, 'lekce', 'lekce', 'lekcí')} · {fmtDuration(courseSecs(c))}
            {p.done > 0 && ` · hotovo ${p.done} z ${p.total}`}
          </p>
          <p className="feat-text">{c.desc}</p>
          <div className="feat-cta">
            <Link className="b b-light b-lg" to={`/app/kurzy/${c.id}/${p.next}`}>
              <Play aria-hidden fill="currentColor" strokeWidth={0} />
              {cta}
            </Link>
          </div>
        </div>
        {p.done > 0 && (
          <span className="prog" aria-hidden>
            <i style={{ width: `${p.pct}%` }} />
          </span>
        )}
      </section>

      <div className="page narrow">
        {c.chapters.map((ch, ci) => (
          <section className="eps" key={ch.t}>
            <h2 className="eps-title">
              {ci + 1}. {ch.t}
            </h2>
            <ol>
              {ch.l.map((l) => {
                const x = vid(l)!
                const done = watched.includes(l)
                return (
                  <li key={l}>
                    <Link className={`ep${l === p.next && p.done < p.total ? ' next' : ''}`} to={`/app/kurzy/${c.id}/${l}`}>
                      <span className="ep-n">{all.indexOf(l) + 1}</span>
                      <span className="thumb">
                        <Thumb video={x} />
                        <span className="dur">{x.d}</span>
                        {done && (
                          <span className="prog" aria-hidden>
                            <i style={{ width: '100%' }} />
                          </span>
                        )}
                      </span>
                      <span className="ep-text">
                        <b>
                          {x.t}
                          {done && <Check aria-label="Zhlédnuto" strokeWidth={3} />}
                        </b>
                        <small>{x.desc}</small>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}

        <section className="about">
          <h2 className="sec-h">O kurzu</h2>
          <p>{c.forWho}</p>
          <ul>
            {c.out.map((o) => (
              <li key={o}>
                <Check aria-hidden strokeWidth={2.5} />
                {o}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
