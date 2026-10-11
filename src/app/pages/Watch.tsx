import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowRight, Check, Play, Share } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import {
  USER,
  chapterOf,
  courseLessons,
  courseOf,
  feed,
  feedMeta,
  fmtDate,
  fmtTime,
  lessonInfo,
  videoHref,
  vid,
  type Course,
} from '../../data/catalog'
import { SAMPLE_COMMENTS } from '../../data/feed'
import { progress, useProgress } from '../../lib/progress'
import { Avatar, LikeBtn, Player, SaveBtn, VRow, type PlayerHandle } from '../ui'
import { useCourseProgress, useTitle, useToast } from '../hooks'

/** Jedna stránka pro video i lekci kurzu (jako na YouTube). Lekce má vpravo seznam lekcí kurzu. */
export function Watch() {
  const { videoId, lessonId, courseId } = useParams()
  const id = lessonId ?? videoId ?? ''
  if (!vid(id)) return <Navigate to={courseId ? `/app/kurzy/${courseId}` : '/app'} replace />
  // každé video má jednu adresu: lekce v kurzu, ostatní ve Videích
  const here = courseId ? `/app/kurzy/${courseId}/${id}` : `/app/videa/${id}`
  if (videoHref(id) !== here) return <Navigate to={videoHref(id)} replace />
  return <WatchView key={id} id={id} />
}

type Comment = { name: string; when: string; text: string; team?: boolean }

function WatchView({ id }: { id: string }) {
  const x = vid(id)!
  const c = courseOf(id)
  const m = feedMeta(id)
  const info = lessonInfo(id)
  useTitle(x.t)
  const toast = useToast()
  const player = useRef<PlayerHandle>(null)
  const list = c ? courseLessons(c) : []
  const idx = list.indexOf(id)
  const next = c && idx < list.length - 1 ? list[idx + 1] : undefined

  useEffect(() => {
    if (c) progress.setLast(id)
  }, [c, id])

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Odkaz je zkopírovaný.')
    } catch {
      toast('Odkaz se nepodařilo zkopírovat.')
    }
  }

  return (
    <div className="watch">
      <div className="watch-main">
        {/* spuštěné video se počítá jako zhlédnuté */}
        <Player video={x} ref={player} onPlay={() => progress.markWatched(id)} />

        <h1 className="w-title">{x.t}</h1>
        <div className="w-bar">
          <div className="channel">
            <Avatar name="ZOFI" team size={40} />
            <span>
              <b>ZOFI Fasády</b>
              <small>{c ? c.title : 'Fasádní akademie'}</small>
            </span>
          </div>
          <div className="w-actions">
            {m && <LikeBtn id={id} likes={m.likes} />}
            <SaveBtn id={id} />
            <button className="b b-pill" onClick={share}>
              <Share aria-hidden /> Sdílet
            </button>
            {next && (
              <Link className="b b-pill b-primary" to={`/app/kurzy/${c!.id}/${next}`} onClick={() => progress.markWatched(id)}>
                Další lekce <ArrowRight aria-hidden />
              </Link>
            )}
          </div>
        </div>

        <div className="desc">
          <b className="desc-meta">
            {c ? `Lekce ${idx + 1} z ${list.length} · ${c.chapters[chapterOf(c, id)].t}` : m && `${fmtDate(m.date)} · ${m.topic}`}
          </b>
          <p>{x.desc}</p>
          {c && info.k.length > 0 && (
            <>
              <h3>Hlavní body</h3>
              <ol className="points">
                {info.k.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ol>
            </>
          )}
          <h3>Kapitoly</h3>
          <ul className="stamps">
            {info.m.map(([t, name]) => (
              <li key={t}>
                <button onClick={() => player.current?.seek(t)}>
                  <span>{fmtTime(t)}</span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {!c && <Comments count={m?.comments ?? 0} />}
      </div>

      <aside className="watch-side">{c ? <Playlist c={c} current={id} /> : <UpNext id={id} />}</aside>
    </div>
  )
}

/** Seznam lekcí kurzu vedle přehrávače (jako playlist na YouTube). */
function Playlist({ c, current }: { c: Course; current: string }) {
  const p = useCourseProgress(c)
  const { watched } = useProgress()
  const all = courseLessons(c)
  const body = useRef<HTMLOListElement>(null)

  // aktuální lekce viditelná v seznamu (posouvá jen seznam, ne stránku)
  useEffect(() => {
    const box = body.current
    const on = box?.querySelector<HTMLElement>('.on')
    if (box && on) box.scrollTop = on.offsetTop - box.clientHeight / 2 + on.clientHeight / 2
  }, [current])

  return (
    <div className="pl">
      <div className="pl-head">
        <Link to={`/app/kurzy/${c.id}`}>{c.title}</Link>
        <small>
          Lekce {all.indexOf(current) + 1} z {all.length} · hotovo {p.done}
        </small>
        <span className="prog" aria-hidden>
          <i style={{ width: `${p.pct}%` }} />
        </span>
      </div>
      <ol className="pl-list" ref={body}>
        {all.map((l, i) => {
          const v = vid(l)!
          const on = l === current
          return (
            <li key={l}>
              <Link to={`/app/kurzy/${c.id}/${l}`} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
                <span className="pl-n">
                  {on ? <Play fill="currentColor" strokeWidth={0} aria-hidden /> : watched.includes(l) ? <Check strokeWidth={3} aria-label="Zhlédnuto" /> : i + 1}
                </span>
                <span className="thumb">
                  <Thumb video={v} size="sm" />
                  <span className="dur">{v.d}</span>
                </span>
                <span className="pl-t">
                  <b>{v.t}</b>
                  <small>{c.chapters[chapterOf(c, l)].t}</small>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Další videa vedle přehrávače: všechna ostatní, nejnovější první. */
function UpNext({ id }: { id: string }) {
  return (
    <div className="upnext">
      {feed()
        .filter((f) => f.v !== id)
        .map((f) => (
          <VRow key={f.v} x={f.video} />
        ))}
    </div>
  )
}

function Comments({ count }: { count: number }) {
  const [mine, setMine] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')
  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMine([{ name: `${USER.first} ${USER.last}`, when: 'právě teď', text }, ...mine])
    setDraft('')
  }
  const list: Comment[] = [...mine, ...SAMPLE_COMMENTS]
  return (
    <section className="comments">
      <h2>{count + mine.length} komentářů</h2>
      <form className="c-form" onSubmit={send}>
        <Avatar name={`${USER.first} ${USER.last}`} size={36} />
        <input
          placeholder="Přidat komentář nebo dotaz…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Komentář"
        />
        {draft.trim() && <button className="b b-primary b-pill">Odeslat</button>}
      </form>
      <ul className="c-list">
        {list.map((cm, i) => (
          <li key={i} className={cm.team ? 'reply' : ''}>
            <Avatar name={cm.name} team={cm.team} size={36} />
            <div>
              <span className="c-head">
                <b>{cm.name}</b>
                {cm.team && <em>Tým ZOFI</em>}
                <small>{cm.when}</small>
              </span>
              <p>{cm.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
