import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { COURSES, courseLessons, courseSecs, feed, fmtAgo, fmtDuration, plural, videoHref, vid } from '../../data/catalog'
import { TOPICS } from '../../data/feed'
import { CCard, Feature, Shelf, VCard, type FeatureItem } from '../ui'
import { useContinue, useTitle, useToast } from '../hooks'

/** Domů: banner a řady videí. Každá řada unese libovolný počet videí. */
export function Home() {
  useTitle('Domů')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const items = feed()
  const cont = useContinue()

  // Příchod z ceníku: přivítání a úklid adresy.
  useEffect(() => {
    if (params.get('vitejte')) {
      toast('Vítejte v akademii. Předplatné je aktivní.')
      setParams({}, { replace: true })
    }
  }, [params, setParams, toast])

  // banner: nejnovější video, rozkoukaný (nebo první) kurz, druhé nejnovější video
  const r = cont[0]
  const c = r?.c ?? COURSES[0]
  const n = courseLessons(c).length
  const featured: FeatureItem[] = [
    ...items.slice(0, 1).map((f) => ({
      key: f.v,
      kicker: 'Nové video',
      title: f.video.t,
      meta: `${f.topic} · ${fmtAgo(f.date)} · ${f.video.d}`,
      text: f.video.desc,
      video: f.video,
      to: videoHref(f.v),
      cta: 'Přehrát',
    })),
    {
      key: `kurz-${c.id}`,
      kicker: r ? `Pokračovat · lekce ${r.index + 1} z ${r.total}` : 'Kurz',
      title: c.title,
      meta: `${n} ${plural(n, 'lekce', 'lekce', 'lekcí')} · ${fmtDuration(courseSecs(c))} · ${c.level}`,
      text: c.desc,
      video: vid(r?.at ?? c.cover)!,
      to: `/app/kurzy/${c.id}/${r?.at ?? courseLessons(c)[0]}`,
      cta: r ? 'Pokračovat' : 'Začít kurz',
      more: { to: `/app/kurzy/${c.id}`, label: 'Osnova kurzu' },
    },
    ...items.slice(1, 2).map((f) => ({
      key: f.v,
      kicker: 'Nové video',
      title: f.video.t,
      meta: `${f.topic} · ${fmtAgo(f.date)} · ${f.video.d}`,
      text: f.video.desc,
      video: f.video,
      to: videoHref(f.v),
      cta: 'Přehrát',
    })),
  ]

  return (
    <div className="home">
      <Feature items={featured} />

      {cont.length > 0 && (
        <Shelf title="Pokračovat ve sledování">
          {cont.map((x) => (
            <VCard
              key={x.c.id}
              x={vid(x.at)!}
              sub={`${x.c.short} · lekce ${x.index + 1} z ${x.total}`}
              pct={x.pct}
            />
          ))}
        </Shelf>
      )}

      <Shelf title="Nová videa" to="/app/videa">
        {items.map((f) => (
          <VCard key={f.v} x={f.video} />
        ))}
      </Shelf>

      <Shelf title="Kurzy" to="/app/kurzy" wide>
        {COURSES.map((k) => (
          <CCard key={k.id} c={k} />
        ))}
      </Shelf>

      {TOPICS.map((t) => {
        const list = items.filter((f) => f.topic === t)
        return list.length ? (
          <Shelf key={t} title={t} to={`/app/videa?tema=${encodeURIComponent(t)}`}>
            {list.map((f) => (
              <VCard key={f.v} x={f.video} />
            ))}
          </Shelf>
        ) : null
      })}

      {COURSES.map((k) => (
        <Shelf key={k.id} title={k.title} to={`/app/kurzy/${k.id}`}>
          {courseLessons(k).map((id, i) => (
            <VCard key={id} x={vid(id)!} sub={`Lekce ${i + 1} · ${vid(id)!.d}`} />
          ))}
        </Shelf>
      ))}
    </div>
  )
}
