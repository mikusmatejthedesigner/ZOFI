import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { ArrowRight, Check, ChevronLeft, Play } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import {
  chapterOf,
  courseLessons,
  courseOf,
  fmtTime,
  lessonInfo,
  standalone,
  vid,
  type Video,
} from '../../data/catalog'
import { progress, useProgress } from '../../lib/progress'
import { Bar, VideoCard } from '../ui'
import { useCourseProgress, useTitle } from '../hooks'

export function Lesson() {
  const { videoId = '' } = useParams()
  if (!vid(videoId)) return <Navigate to="/app" replace />
  // key: přechod na jinou lekci začne s čistým přehrávačem
  return <LessonView key={videoId} id={videoId} />
}

function LessonView({ id }: { id: string }) {
  const x = vid(id)!
  useTitle(x.t)
  const nav = useNavigate()
  const { watched } = useProgress()
  const c = courseOf(id)
  const list = c ? courseLessons(c) : standalone().map((v) => v.v)
  const idx = list.indexOf(id)
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined
  const info = lessonInfo(id)
  const done = watched.includes(id)
  const chapter = c ? c.chapters[chapterOf(c, id)] : undefined

  const [playing, setPlaying] = useState(false)
  const [start, setStart] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    progress.setLast(id)
  }, [id])

  // Skok na okamžik ve videu: běžící přehrávač posuneme, jinak ho spustíme od dané vteřiny.
  const seek = (t: number) => {
    const w = frame.current?.contentWindow
    if (playing && w) {
      w.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [t, true] }), '*')
      w.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
    } else {
      setStart(t)
      setPlaying(true)
    }
    frame.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const goNext = () => {
    progress.markWatched(id)
    if (next) nav(`/app/lekce/${next}`)
  }

  return (
    <div className="page lesson">
      <div className="lesson-main">
        {c ? (
          <Link className="back" to={`/app/kurzy/${c.id}`}>
            <ChevronLeft aria-hidden /> {c.short}
          </Link>
        ) : (
          <Link className="back" to="/app/kurzy">
            <ChevronLeft aria-hidden /> Kurzy
          </Link>
        )}

        <div className="player">
          {playing ? (
            <iframe
              ref={frame}
              src={`https://www.youtube-nocookie.com/embed/${x.v}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=${start}&origin=${encodeURIComponent(window.location.origin)}`}
              title={x.t}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button className="poster" onClick={() => setPlaying(true)} aria-label={`Přehrát: ${x.t}`}>
              <Thumb video={x} size="lg" eager />
              <span className="poster-play">
                <Play fill="currentColor" aria-hidden />
              </span>
              <span className="poster-dur">{x.d}</span>
            </button>
          )}
        </div>

        <div className="lesson-head">
          <div>
            <span className="page-kicker">
              {c && chapter ? `Kapitola ${chapterOf(c, id) + 1} · ${chapter.t} · Lekce ${idx + 1} z ${list.length}` : 'Samostatné video'}
            </span>
            <h1>{x.t}</h1>
          </div>
          <div className="lesson-actions">
            <button className={`btn btn-ghost${done ? ' is-done' : ''}`} onClick={() => progress.toggle(id)} aria-pressed={done}>
              <Check aria-hidden strokeWidth={2.5} />
              {done ? 'Zhlédnuto' : 'Označit jako zhlédnuté'}
            </button>
            {next && (
              <button className="btn" onClick={goNext}>
                Další lekce <ArrowRight aria-hidden />
              </button>
            )}
          </div>
        </div>

        <p className="lesson-desc">{x.desc}</p>

        <div className="lesson-cols">
          <section className="panel">
            <h2>Kapitoly ve videu</h2>
            <ol className="moments">
              {info.m.map(([t, name]) => (
                <li key={t}>
                  <button onClick={() => seek(t)}>
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
        {c ? <Playlist courseId={c.id} current={id} /> : <MoreVideos current={id} />}
      </aside>
    </div>
  )
}

function Playlist({ courseId, current }: { courseId: string; current: string }) {
  const c = courseOf(current)!
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
        <Link to={`/app/kurzy/${courseId}`}>{c.title}</Link>
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
              const v: Video = vid(l)!
              const done = watched.includes(l)
              return (
                <li key={l}>
                  <Link to={`/app/lekce/${l}`} className={l === current ? 'on' : ''} aria-current={l === current ? 'page' : undefined}>
                    <span className={`pl-state${done ? ' done' : ''}`}>
                      {l === current ? (
                        <Play fill="currentColor" strokeWidth={0} aria-hidden />
                      ) : done ? (
                        <Check strokeWidth={3} aria-label="Zhlédnuto" />
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

function MoreVideos({ current }: { current: string }) {
  return (
    <div className="more-videos">
      <h2>Další samostatná videa</h2>
      <div className="stack-list">
        {standalone()
          .filter((v) => v.v !== current)
          .map((v) => (
            <VideoCard key={v.v} x={v} />
          ))}
      </div>
    </div>
  )
}
