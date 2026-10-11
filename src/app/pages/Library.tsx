import { Link } from 'react-router'
import { Bookmark, History } from 'lucide-react'
import { vid } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Empty, VCard } from '../ui'
import { useTitle } from '../hooks'

/** Knihovna: uložená videa a historie, naposledy první. */
export function Library() {
  useTitle('Knihovna')
  const { saved, watched } = useProgress()
  const savedList = [...saved].reverse().map(vid).filter((x) => x !== undefined)
  const history = [...watched].reverse().map(vid).filter((x) => x !== undefined)

  return (
    <div className="page">
      <h1 className="h1">Knihovna</h1>

      <h2 className="sec-h">
        <Bookmark aria-hidden /> Uložené
      </h2>
      {savedList.length ? (
        <div className="vgrid">
          {savedList.map((x) => (
            <VCard key={x.v} x={x} />
          ))}
        </div>
      ) : (
        <Empty icon={<Bookmark aria-hidden />} title="Zatím nic uloženého">
          U videa klepněte na Uložit a najdete ho tady.{' '}
          <Link className="link" to="/app">
            Projít videa
          </Link>
        </Empty>
      )}

      {history.length > 0 && (
        <>
          <h2 className="sec-h">
            <History aria-hidden /> Historie
          </h2>
          <div className="vgrid">
            {history.map((x) => (
              <VCard key={x.v} x={x} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
