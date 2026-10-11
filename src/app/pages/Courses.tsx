import { Link } from 'react-router'
import { ListVideo, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import { COURSES, chapterOf, courseLessons, courseOf, vid, type Course } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Bar, CourseCard } from '../ui'
import { useCourseProgress, useTitle } from '../hooks'

/** Sekce Kurzy: ucelené série lekcí. */
export function Courses() {
  useTitle('Kurzy')
  const { last, watched } = useProgress()

  // rozkoukaný kurz: poslední otevřená lekce, jinak první začatý a nedokončený kurz
  const started = (c: Course) => {
    const ids = courseLessons(c)
    const done = ids.filter((id) => watched.includes(id)).length
    return done > 0 && done < ids.length
  }
  const lastCourse = last ? courseOf(last) : undefined
  const current = lastCourse && started(lastCourse) ? lastCourse : COURSES.find(started)

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="large-title">Kurzy</h1>
        <p className="page-sub">Ucelené série lekcí v pořadí, v jakém se na stavbě opravdu pracuje.</p>
      </header>

      {current && <Continue c={current} lastId={last} />}

      <section className="block">
        {current && (
          <div className="block-head">
            <h2>Všechny kurzy</h2>
          </div>
        )}
        <div className="course-list">
          {COURSES.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </section>
    </div>
  )
}

/** Velká karta „Pokračovat“ s rozkoukanou lekcí. */
function Continue({ c, lastId }: { c: Course; lastId?: string }) {
  const p = useCourseProgress(c)
  const ids = courseLessons(c)
  const id = lastId && ids.includes(lastId) ? lastId : p.next
  const pos = ids.indexOf(id) + 1
  const chapter = c.chapters[chapterOf(c, id)]
  return (
    <section className="continue">
      <Thumb video={vid(id)!} size="lg" eager className="continue-bg" />
      <div className="continue-in">
        <span className="continue-kicker">
          Pokračovat v kurzu · Lekce {pos} z {ids.length}
        </span>
        <h2>{c.title}</h2>
        {chapter && <p>Kapitola {chapterOf(c, id) + 1}: {chapter.t}</p>}
        <div className="continue-progress">
          <Bar pct={p.pct} />
          <span>
            {p.done} z {p.total} lekcí
          </span>
        </div>
        <div className="continue-cta">
          <Link className="btn btn-light" to={`/app/kurzy/${c.id}/${id}`}>
            <Play aria-hidden fill="currentColor" />
            Pokračovat
          </Link>
          <Link className="btn btn-glass" to={`/app/kurzy/${c.id}`}>
            <ListVideo aria-hidden />
            Osnova kurzu
          </Link>
        </div>
      </div>
    </section>
  )
}
