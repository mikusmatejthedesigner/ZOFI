import { useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ChevronLeft, Share } from 'lucide-react'
import { USER, courseOf, feed, feedMeta, fmtDate, videoHref, vid } from '../../data/catalog'
import { SAMPLE_COMMENTS } from '../../data/feed'
import { progress } from '../../lib/progress'
import { Avatar, LikeSaveShare, Player, VideoRow } from '../ui'
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
  const [mine, setMine] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')

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
    <div className="page watch">
      <div className="watch-main">
        <Link className="back" to="/app/videa">
          <ChevronLeft aria-hidden /> Videa
        </Link>
        {/* spuštěné video se počítá jako zhlédnuté */}
        <Player video={x} onPlay={() => progress.markWatched(id)} />

        <h1 className="watch-title">{x.t}</h1>
        <div className="watch-bar">
          <div className="channel">
            <Avatar name="ZOFI" team size={40} />
            <span>
              <b>ZOFI Fasády</b>
              <small>Fasádní akademie</small>
            </span>
          </div>
          <div className="watch-actions">
            <LikeSaveShare id={id} likes={m?.likes} />
            <button className="pill" onClick={share}>
              <Share aria-hidden /> Sdílet
            </button>
          </div>
        </div>

        <div className="desc-box">
          {m && (
            <b>
              {fmtDate(m.date)} · {m.topic}
            </b>
          )}
          <p>{x.desc}</p>
        </div>

        <section className="comments">
          <h2>
            Komentáře <span>{(m?.comments ?? 0) + mine.length}</span>
          </h2>
          <form className="comment-form" onSubmit={send}>
            <Avatar name={`${USER.first} ${USER.last}`} size={36} />
            <textarea
              rows={1}
              placeholder="Napište komentář nebo dotaz…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Komentář"
            />
            <button className="btn btn-sm" disabled={!draft.trim()}>
              Odeslat
            </button>
          </form>
          <ul className="comment-list">
            {comments.map((c, i) => (
              <li key={i} className={c.team ? 'team' : ''}>
                <Avatar name={c.name} team={c.team} size={36} />
                <div>
                  <span className="comment-head">
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

      <aside className="watch-side">
        <h2>Další videa</h2>
        <div className="vrow-list">
          {more.map((f) => (
            <VideoRow key={f.v} x={f.video} />
          ))}
        </div>
      </aside>
    </div>
  )
}
