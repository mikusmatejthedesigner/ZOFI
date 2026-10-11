import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { BlurFade } from '@/components/magicui/blur-fade'
import { feed, secs } from '../../data/catalog'
import { TOPICS, type Topic } from '../../data/feed'
import { Tabs, VideoCard } from '../ui'
import { useTitle, useToast } from '../hooks'

type Filter = 'vse' | Topic
type Sort = 'nove' | 'oblibene' | 'kratke'

/** Sekce Videa: samostatná videa mimo kurzy, jako na YouTube nebo Herohero. */
export function Videos() {
  useTitle('Videa')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('vse')
  const [sort, setSort] = useState<Sort>('nove')

  // Příchod z ceníku: přivítání a úklid adresy.
  useEffect(() => {
    if (params.get('vitejte')) {
      toast('Vítejte v akademii. Předplatné je aktivní.')
      setParams({}, { replace: true })
    }
  }, [params, setParams, toast])

  const all = feed()
  const list = all
    .filter((f) => filter === 'vse' || f.topic === filter)
    .sort((a, b) => (sort === 'oblibene' ? b.likes - a.likes : sort === 'kratke' ? secs(a.video.d) - secs(b.video.d) : 0))
  // nejnovější video jako velká dlaždice, jen v základním pohledu
  const featured = filter === 'vse' && sort === 'nove'

  return (
    <div className="page">
      <div className="page-title">
        <h1>Videa</h1>
        <span>{all.length}</span>
      </div>
      <p className="page-desc">Novinky, materiály a ukázky ze staveb ZOFI. Nové video každý týden.</p>

      <div className="toolbar">
        <Tabs
          label="Témata"
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'vse', label: 'Vše' },
            ...TOPICS.map((t) => ({ id: t, label: t, count: all.filter((f) => f.topic === t).length })),
          ]}
        />
        <label className="sort">
          Řadit
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="nove">Nejnovější</option>
            <option value="oblibene">Nejoblíbenější</option>
            <option value="kratke">Nejkratší</option>
          </select>
        </label>
      </div>

      <div className={`vgrid${featured ? ' featured' : ''}`} key={`${filter}-${sort}`}>
        {list.map((f, i) => (
          <BlurFade key={f.v} delay={Math.min(i, 10) * 0.035} duration={0.35} offset={8} direction="up" blur="4px">
            <VideoCard x={f.video} eager={i < 4} />
          </BlurFade>
        ))}
      </div>
    </div>
  )
}
