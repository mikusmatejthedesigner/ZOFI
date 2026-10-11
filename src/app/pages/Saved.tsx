import { Link } from 'react-router'
import { Bookmark } from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { vid } from '../../data/catalog'
import { useProgress } from '../../lib/progress'
import { Empty, VideoCard } from '../ui'
import { useTitle } from '../hooks'

/** Uložená videa a lekce, naposledy uložené první. */
export function Saved() {
  useTitle('Uložené')
  const { saved } = useProgress()
  const list = [...saved].reverse().map(vid).filter((x) => x !== undefined)

  return (
    <div className="page">
      <div className="page-title">
        <h1>Uložené</h1>
        {list.length > 0 && <span>{list.length}</span>}
      </div>
      <p className="page-desc">Videa a lekce, ke kterým se chcete vrátit.</p>

      {list.length ? (
        <div className="vgrid">
          {list.map((x, i) => (
            <BlurFade key={x.v} delay={Math.min(i, 10) * 0.035} duration={0.35} offset={8} direction="up" blur="4px">
              <VideoCard x={x} eager={i < 4} />
            </BlurFade>
          ))}
        </div>
      ) : (
        <Empty icon={<Bookmark aria-hidden />} title="Zatím nic uloženého">
          U videa nebo lekce klepněte na Uložit a najdete je tady.{' '}
          <Link className="link" to="/app/videa">
            Projít videa
          </Link>
        </Empty>
      )}
    </div>
  )
}
