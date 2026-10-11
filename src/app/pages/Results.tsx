import { useSearchParams } from 'react-router'
import { SearchX } from 'lucide-react'
import { Empty, VRow } from '../ui'
import { searchAll, useTitle } from '../hooks'

/** Výsledky hledání: všechna videa i lekce, které odpovídají dotazu. */
export function Results() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  useTitle(q ? `Hledání: ${q}` : 'Hledání')
  const hits = searchAll(q)

  return (
    <div className="page narrow">
      <h1 className="h1">{q ? `Výsledky pro „${q}“` : 'Hledání'}</h1>
      {hits.length ? (
        <div className="results">
          {hits.map((x) => (
            <VRow key={x.v} x={x} big />
          ))}
        </div>
      ) : (
        <Empty icon={<SearchX aria-hidden />} title="Nic jsme nenašli">
          Zkuste jiné slovo, například „sokl“ nebo „kotvení“.
        </Empty>
      )}
    </div>
  )
}
