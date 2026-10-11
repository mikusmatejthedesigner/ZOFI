import { BlurFade } from '@/components/magicui/blur-fade'
import { COURSES, courseLessons, courseOf } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { CourseCard, ResumeCard } from '../ui'
import { useTitle } from '../hooks'

/** Sekce Kurzy: rozkoukané kurzy nahoře, pod nimi všechny kurzy. */
export function Courses() {
  useTitle('Kurzy')
  const { last, watched } = useProgress()

  // začaté a nedokončené kurzy; naposledy otevřený první
  const lastCourse = last ? courseOf(last) : undefined
  const resume = COURSES.map((c) => {
    const ids = courseLessons(c)
    const done = ids.filter((id) => watched.includes(id)).length
    const at = c === lastCourse && last ? last : (ids.find((id) => !watched.includes(id)) ?? ids[0])
    return { c, at, open: done > 0 && done < ids.length }
  })
    .filter((r) => r.open)
    .sort((a, b) => Number(b.c === lastCourse) - Number(a.c === lastCourse))

  return (
    <div className="page">
      <div className="page-title">
        <h1>Kurzy</h1>
        <span>{COURSES.length}</span>
      </div>
      <p className="page-desc">Ucelené série lekcí v pořadí, v jakém se na stavbě opravdu pracuje.</p>

      {resume.length > 0 && (
        <>
          <div className="sec-title">
            <h2>Pokračovat</h2>
          </div>
          <div className="resume">
            {resume.map((r, i) => (
              <BlurFade key={r.c.id} delay={i * 0.05} duration={0.35} offset={8} direction="up" blur="4px">
                <ResumeCard c={r.c} at={r.at} />
              </BlurFade>
            ))}
          </div>
        </>
      )}

      <div className="sec-title">
        <h2>Všechny kurzy</h2>
      </div>
      <div className="cgrid">
        {COURSES.map((c, i) => (
          <BlurFade key={c.id} delay={0.1 + i * 0.05} duration={0.35} offset={8} direction="up" blur="4px">
            <CourseCard c={c} />
          </BlurFade>
        ))}
      </div>
    </div>
  )
}
