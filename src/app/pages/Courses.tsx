import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Search } from 'lucide-react'
import { COURSES, VIDEOS, courseLessons, plural, standalone, totalSecs, fmtDuration } from '../../data/catalog'
import { CourseCard, VideoCard } from '../ui'
import { useTitle, useVideoSearch } from '../hooks'

export function Courses() {
  useTitle('Kurzy')
  const [q, setQ] = useState('')
  const results = useVideoSearch(q)
  const { hash } = useLocation()
  const lessons = COURSES.reduce((a, c) => a + courseLessons(c).length, 0)

  // Odkaz „Zobrazit vše“ u samostatných videí.
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="large-title">Kurzy</h1>
        <p className="page-sub">
          {COURSES.length} kurzy, {lessons} lekcí a {VIDEOS.length} videí. Celkem {fmtDuration(totalSecs())}.
        </p>
        <label className="field-search">
          <Search aria-hidden />
          <input
            type="search"
            placeholder="Hledat ve všech videích"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </header>

      {q ? (
        <section className="block">
          <div className="block-head">
            <h2>
              {results.length
                ? `${results.length} ${plural(results.length, 'výsledek', 'výsledky', 'výsledků')}`
                : 'Nic jsme nenašli'}
            </h2>
          </div>
          {results.length ? (
            <div className="grid-4">
              {results.map((x) => (
                <VideoCard key={x.v} x={x} />
              ))}
            </div>
          ) : (
            <p className="empty">Zkuste jiné slovo, třeba „sokl“, „hmoždinka“ nebo „omítka“.</p>
          )}
        </section>
      ) : (
        <>
          <section className="block">
            <div className="grid-3">
              {COURSES.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          </section>
          <section className="block" id="videa">
            <div className="block-head">
              <h2>Samostatná videa</h2>
            </div>
            <div className="grid-4">
              {standalone().map((x) => (
                <VideoCard key={x.v} x={x} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
