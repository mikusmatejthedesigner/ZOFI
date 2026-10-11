import { useSearchParams } from 'react-router'
import { feed } from '../../data/catalog'
import { TOPICS } from '../../data/feed'
import { VCard } from '../ui'
import { useTitle } from '../hooks'

/** Všechna videa jako na YouTube: čipy témat a mřížka, nejnovější první. */
export function Videos() {
  useTitle('Videa')
  const [params, setParams] = useSearchParams()
  const tema = params.get('tema')
  const all = feed()
  const list = tema ? all.filter((f) => f.topic === tema) : all

  return (
    <div className="page">
      <h1 className="h1">Videa</h1>
      <div className="chipbar" role="tablist" aria-label="Témata">
        {[null, ...TOPICS].map((t) => (
          <button
            key={t ?? 'vse'}
            role="tab"
            aria-selected={tema === t}
            className={tema === t ? 'on' : ''}
            onClick={() => setParams(t ? { tema: t } : {}, { replace: true })}
          >
            {t ?? 'Vše'}
          </button>
        ))}
      </div>
      <div className="vgrid">
        {list.map((f) => (
          <VCard key={f.v} x={f.video} />
        ))}
      </div>
    </div>
  )
}
