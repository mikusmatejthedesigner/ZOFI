import { COURSES } from '../../data/catalog'
import { CCard } from '../ui'
import { useTitle } from '../hooks'

/** Kurzy jako seriály: plakáty s názvem, průběh tenkým pruhem. */
export function Courses() {
  useTitle('Kurzy')
  return (
    <div className="page">
      <h1 className="h1">Kurzy</h1>
      <div className="vgrid vgrid-wide">
        {COURSES.map((c) => (
          <CCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  )
}
