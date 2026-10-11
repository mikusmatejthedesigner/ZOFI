import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Play, Search } from 'lucide-react'
import { Thumb } from '../../components/Thumb'
import { feed, fmtAgo, videoHref, type FeedItem } from '../../data/catalog'
import { TOPICS, type Topic } from '../../data/feed'
import { useProgress } from '../../lib/progress'
import { LikeSaveShare, VideoCard } from '../ui'
import { matchText, useTitle, useToast } from '../hooks'

type Filter = 'Vše' | Topic | 'Uložené'

/** Sekce Videa: samostatná videa jako na YouTube nebo Herohero. */
export function Videos() {
  useTitle('Videa')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const { saved } = useProgress()
  const [filter, setFilter] = useState<Filter>('Vše')
  const [q, setQ] = useState('')

  // Příchod z ceníku: přivítání a úklid adresy.
  useEffect(() => {
    if (params.get('vitejte')) {
      toast('Vítejte v akademii. Předplatné je aktivní.')
      setParams({}, { replace: true })
    }
  }, [params, setParams, toast])

  const items = feed()
  const browsing = filter === 'Vše' && !q
  const [top, ...rest] = items
  const list = (browsing ? rest : items)
    .filter((f) => (filter === 'Vše' ? true : filter === 'Uložené' ? saved.includes(f.v) : f.topic === filter))
    .filter((f) => !q || matchText(q, `${f.video.t} ${f.video.desc} ${f.topic}`))

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="large-title">Videa</h1>
        <p className="page-sub">Novinky, materiály a ukázky ze staveb ZOFI. Nové video každý týden.</p>
      </header>

      {browsing && top && <Featured item={top} />}

      <div className="filters">
        <div className="topics" role="tablist" aria-label="Témata">
          {(['Vše', ...TOPICS, 'Uložené'] as Filter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`topic${filter === f ? ' on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === 'Uložené' && saved.length > 0 && <em>{saved.length}</em>}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search aria-hidden />
          <input type="search" placeholder="Hledat ve videích" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      {list.length ? (
        <div className="grid-3 video-grid">
          {list.map((f) => (
            <VideoCard key={f.v} x={f.video} />
          ))}
        </div>
      ) : (
        <p className="empty">
          {filter === 'Uložené' && !q
            ? 'Zatím nemáte nic uloženého. U videa klepněte na Uložit a najdete ho tady.'
            : 'Nic jsme nenašli. Zkuste jiné slovo nebo téma.'}
        </p>
      )}
    </div>
  )
}

/** Nejnovější video nahoře, jako hlavní příspěvek. */
function Featured({ item }: { item: FeedItem }) {
  const x = item.video
  return (
    <section className="featured">
      <Link className="featured-media thumb" to={videoHref(x.v)} aria-label={`Přehrát: ${x.t}`}>
        <Thumb video={x} size="lg" eager />
        <span className="poster-play small">
          <Play fill="currentColor" aria-hidden />
        </span>
        <span className="dur">{x.d}</span>
      </Link>
      <div className="featured-body">
        <span className="featured-kicker">
          <i /> Nejnovější · {item.topic} · {fmtAgo(item.date)}
        </span>
        <h2>
          <Link to={videoHref(x.v)}>{x.t}</Link>
        </h2>
        <p>{x.desc}</p>
        <div className="featured-cta">
          <Link className="btn" to={videoHref(x.v)}>
            <Play aria-hidden fill="currentColor" />
            Přehrát
          </Link>
          <LikeSaveShare id={x.v} likes={item.likes} />
        </div>
      </div>
    </section>
  )
}
