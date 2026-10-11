import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Bookmark, Check, Play } from 'lucide-react'
import { chapterOf, course, courseLessons, fmtTime, lessonInfo, videoHref, vid, type Course } from '../../data/catalog'
import { progress, useProgress } from '../../lib/progress'
import { Bar, Player, Tabs, type PlayerHandle } from '../ui'
import { useCourseProgress, useTitle, useToast } from '../hooks'

/** Lekce kurzu: přehrávač, hlavní body, kapitoly ve videu a seznam lekcí. */
export function Lesson() {
  const { courseId = '', lessonId = '' } = useParams()
  const c = course(courseId)
  if (!vid(lessonId)) return <Navigate to={c ? `/app/kurzy/${c.id}` : '/app/kurzy'} replace />
  if (!c || !courseLessons(c).includes(lessonId)) return <Navigate to={videoHref(lessonId)} replace />
  // key: přechod na jinou lekci začne s čistým přehrávačem
  return <LessonView key={lessonId} c={c} id={lessonId} />
}

type Tab = 'prehled' | 'kapitoly'

function LessonView({ c, id }: { c: Course; id: string }) {
  const x = vid(id)!
  useTitle(x.t)
  const nav = useNavigate()
  const toast = useToast()
  const { watched, saved } = useProgress()
  const player = useRef<PlayerHandle>(null)
  const [tab, setTab] = useState<Tab>('prehled')
  const list = courseLessons(c)
  const idx = list.indexOf(id)
  const next = idx < list.length - 1 ? list[idx + 1] : undefined
  const info = lessonInfo(id)
  const done = watched.includes(id)
  const isSaved = saved.includes(id)
  const ci = chapterOf(c, id)

  useEffect(() => {
    progress.setLast(id)
  }, [id])

  const goNext = () => {
    progress.markWatched(id)
    nav(next ? `/app/kurzy/${c.id}/${next}` : `/app/kurzy/${c.id}`)
  }

  return (
    <div className="page">
      <div className="watch">
        <div>
          <Player video={x} ref={player} />

          <div className="l-head">
            <div>
              <span className="l-kicker">
                Lekce {idx + 1} z {list.length} · {c.chapters[ci].t}
              </span>
              <h1 className="w-title">{x.t}</h1>
            </div>
            <div className="w-actions">
              <div className="group">
                <button className={`b${done ? ' on' : ''}`} onClick={() => progress.toggle(id)} aria-pressed={done}>
                  <Check aria-hidden strokeWidth={2.5} />
                  {done ? 'Hotovo' : 'Označit jako hotové'}
                </button>
                <button
                  className={`b b-icon${isSaved ? ' on' : ''}`}
                  aria-label={isSaved ? 'Odebrat z uložených' : 'Uložit'}
                  aria-pressed={isSaved}
                  onClick={() => {
                    progress.save(id)
                    toast(isSaved ? 'Odebráno z uložených.' : 'Uloženo do knihovny.')
                  }}
                >
                  <Bookmark aria-hidden fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <button className="b b-primary" onClick={goNext}>
                {next ? 'Další lekce' : 'Dokončit kurz'} <ArrowRight aria-hidden />
              </button>
            </div>
          </div>

          <Tabs
            className="l-tabs"
            label="Obsah lekce"
            value={tab}
            onChange={setTab}
            items={[
              { id: 'prehled', label: 'Přehled' },
              { id: 'kapitoly', label: 'Kapitoly ve videu', count: info.m.length },
            ]}
          />
          <div className="l-panel" role="tabpanel">
            {tab === 'prehled' ? (
              <>
                <p className="l-desc">{x.desc}</p>
                <h2 className="side-h">Hlavní body</h2>
                <ol className="points">
                  {info.k.map((k, i) => (
                    <li key={k}>
                      <b>{i + 1}</b>
                      {k}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
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
            )}
          </div>
        </div>

        <aside>
          <Playlist c={c} current={id} />
        </aside>
      </div>
    </div>
  )
}

function Playlist({ c, current }: { c: Course; current: string }) {
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const all = courseLessons(c)
  const body = useRef<HTMLDivElement>(null)

  // aktuální lekce viditelná v seznamu (posouvá jen seznam, ne stránku)
  useEffect(() => {
    const box = body.current
    const on = box?.querySelector<HTMLElement>('.on')
    if (box && on) box.scrollTop = on.offsetTop - box.clientHeight / 2 + on.clientHeight / 2
  }, [current])

  return (
    <div className="playlist">
      <div className="pl-head">
        <Link to={`/app/kurzy/${c.id}`}>{c.title}</Link>
        <div className="pl-prog">
          <Bar pct={p.pct} />
          <span>
            {p.done} z {p.total}
          </span>
        </div>
      </div>
      <div className="pl-body" ref={body}>
        {c.chapters.map((ch, ci) => (
          <div key={ch.t}>
            <h4>
              {ci + 1}. {ch.t}
            </h4>
            {ch.l.map((l) => {
              const v = vid(l)!
              const isDone = watched.includes(l)
              const isOn = l === current
              return (
                <Link
                  key={l}
                  to={`/app/kurzy/${c.id}/${l}`}
                  className={`pl-item${isOn ? ' on' : ''}`}
                  aria-current={isOn ? 'page' : undefined}
                >
                  <span className={`state${isDone ? ' done' : isOn ? ' now' : ''}`}>
                    {isOn ? (
                      <Play fill="currentColor" strokeWidth={0} aria-hidden />
                    ) : isDone ? (
                      <Check strokeWidth={3.5} aria-label="Hotovo" />
                    ) : (
                      all.indexOf(l) + 1
                    )}
                  </span>
                  <span>{v.t}</span>
                  <small>{v.d}</small>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
