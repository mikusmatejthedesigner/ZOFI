/* Prohlídka řezu fasádou (render ZOFITHERM): zastávky kamery v pořadí, jak se staví.
   x a y jsou místo na renderu (0 až 1), z je přiblížení. Texty jsou zjednodušené,
   technické údaje k ověření technikem ZOFI. */
export type Stop = { n: string; t: string; x: number; y: number; z: number; lessons: string[] }

export const STOPS: Stop[] = [
  {
    n: 'Podklad',
    t: 'Pevný, suchý a soudržný. Starou omítku nebo břízolit je potřeba nejdřív prověřit, jinak fasáda drží jen na prachu.',
    x: 0.87,
    y: 0.3,
    z: 2,
    lessons: ['lcx6Xk41iSg'],
  },
  {
    n: 'Založení',
    t: 'Soklový profil určí výšku a rovinu první řady desek. Co se pokazí tady, táhne se až pod střechu.',
    x: 0.73,
    y: 0.49,
    z: 2.2,
    lessons: ['etar5LJJeCY'],
  },
  {
    n: 'Izolant',
    t: 'Lepidlo po obvodu desky a v terčích. Desky se kladou na vazbu jako cihly, bez průběžných spár.',
    x: 0.62,
    y: 0.3,
    z: 1.55,
    lessons: ['Er5tVaQ3u2U'],
  },
  {
    n: 'Zápustné kotvení',
    t: 'Hmoždinka se zapustí do izolantu a otvor se zakryje zátkou. Na hotové fasádě pak nejsou vidět světlé tečky.',
    x: 0.665,
    y: 0.105,
    z: 2,
    lessons: ['gzl2szVtVQo', 'VqUMz2YFEPw'],
  },
  {
    n: 'Armovací vrstva',
    t: 'Síťovina musí být zatlačená ve stěrce, ne ležet na izolantu. Pruhy se překrývají a v rozích otvorů patří diagonály.',
    x: 0.4,
    y: 0.3,
    z: 1.9,
    lessons: ['bCudN8yMi64', 'iw0XkCWs-KY'],
  },
  {
    n: 'Omítka',
    t: 'Natahuje se v jednom záběru od rohu k rohu, aby na fasádě nezůstala viditelná napojení.',
    x: 0.2,
    y: 0.3,
    z: 1.7,
    lessons: ['Yew7mJ6kQZM'],
  },
  {
    n: 'Sokl',
    t: 'U terénu potřebuje fasáda izolant odolný vlhkosti, mozaikovou omítku a správně ukončenou nopovou fólii.',
    x: 0.46,
    y: 0.72,
    z: 1.8,
    lessons: ['IX-1IWWdTcQ', 'JQsUyljbayE'],
  },
]
