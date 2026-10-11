import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useParams } from 'react-router'
import { Share } from 'lucide-react'
import { USER, courseOf, feed, feedMeta, fmtDate, fmtTime, lessonInfo, videoHref, vid } from '../../data/catalog'
import { SAMPLE_COMMENTS } from '../../data/feed'
import { progress } from '../../lib/progress'
import { Avatar, LikeSave, Player, VideoRow, type PlayerHandle } from '../ui'
import { useTitle, useToast } from '../hooks'

/** Stránka samostatného videa (jako na YouTube): přehrávač, popis, komentáře a další videa. */
export function Watch() {
  const { videoId = '' } = useParams()
  const x = vid(videoId)
  if (!x) return <Navigate to="/app/videa" replace />
  // lekce kurzu se přehrávají v kurzu
  if (courseOf(videoId)) return <Navigate to={videoHref(videoId)} replace />
  return <WatchView key={videoId} id={videoId} />
}

type Comment = { name: string; when: string; text: string; likes: number; team?: boolean }

function WatchView({ id }: { id: string }) {
  const x = vid(id)!
  const m = feedMeta(id)
  useTitle(x.t)
  const toast = useToast()
  const player = useRef<PlayerHandle>(null)
  const [mine, setMine] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')
  const moments = lessonInfo(id).m

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Odkaz na video je zkopírovaný.')
    } catch {
      toast('Odkaz se nepodařilo zkopírovat.')
    }
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMine([{ name: `${USER.first} ${USER.last}`, when: 'právě teď', text, likes: 0 }, ...mine])
    setDraft('')
  }

  const comments: Comment[] = [...mine, ...SAMPLE_COMMENTS]
  const more = feed().filter((f) => f.v !== id)

  return (
    <div className="page">
      <div className="watch">
        <div>
          {/* spuštěné video se počítá jako zhlédnuté */}
          <Player video={x} ref={player} onPlay={() => progress.markWatched(id)} />

          <h1 className="w-title">{x.t}</h1>
          <div className="w-bar">
            <div className="channel">
              <Avatar name="ZOFI" team size={34} />
              <span>
                <b>ZOFI Fasády</b>
                <small>Fasádní akademie</small>
              </span>
            </div>
            <div className="w-actions">
              <LikeSave id={id} likes={m?.likes} />
              <button className="b b-soft" onClick={share}>
                <Share aria-hidden /> Sdílet
              </button>
            </div>
          </div>

          <div className="descbox">
            {m && (
              <b>
                {fmtDate(m.date)} · {m.topic}
              </b>
            )}
            <p>{x.desc}</p>
            <div className="chips" aria-label="Kapitoly ve videu">
              {moments.map(([t, name]) => (
                <button key={t} className="chip-time" onClick={() => player.current?.seek(t)}>
                  <span>{fmtTime(t)}</span>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <section className="comments">
            <h2>
              Komentáře <span>{(m?.comments ?? 0) + mine.length}</span>
            </h2>
            <form className="c-form" onSubmit={send}>
              <Avatar name={`${USER.first} ${USER.last}`} size={32} />
              <textarea
                rows={1}
                placeholder="Napište komentář nebo dotaz…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Komentář"
              />
              <button className="b b-primary" disabled={!draft.trim()}>
                Odeslat
              </button>
            </form>
            <ul className="c-list">
              {comments.map((c, i) => (
                <li key={i} className={c.team ? 'reply' : ''}>
                  <Avatar name={c.name} team={c.team} size={32} />
                  <div>
                    <span className="c-head">
                      <b>{c.name}</b>
                      {c.team && <em>Tým ZOFI</em>}
                      <small>{c.when}</small>
                    </span>
                    <p>{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside>
          <h2 className="side-h">Další videa</h2>
          <div className="vrow-list">
            {more.map((f) => (
              <VideoRow key={f.v} x={f.video} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
