/* Vrstvy kontaktního zateplovacího systému v pořadí, jak se na dům nanášejí.
   Texty z prototypu, technické údaje k ověření technikem ZOFI. */
export const LAYERS = [
  {
    n: 'Podklad',
    mm: 'zdivo, omítka nebo břízolit',
    t: 'Pevný, suchý a soudržný. Starý břízolit nebo omítku je potřeba nejdřív prověřit, jinak celá fasáda drží jen na prachu.',
  },
  {
    n: 'Lepicí tmel',
    mm: 'cca 10 mm',
    t: 'Po obvodu desky pruh, uprostřed terče. Lepidlo má pokrýt nejméně 40 % plochy desky, jinak se deska může prohýbat a odtrhnout.',
  },
  {
    n: 'Izolant',
    mm: 'např. 160 mm šedého EPS',
    t: 'Desky se kladou odspodu nahoru na vazbu jako cihly, bez průběžných spár. Spáry mezi deskami se nesmí zalít lepidlem.',
  },
  {
    n: 'Hmoždinky',
    mm: 'zápustná montáž',
    t: 'Hmoždinka se zapustí do izolantu a otvor se zakryje zátkou. Na hotové fasádě pak nejsou vidět světlé tečky.',
  },
  {
    n: 'Armovací vrstva',
    mm: 'stěrka se síťovinou, cca 4 mm',
    t: 'Síťovina musí být zatlačená ve stěrce, ne ležet na izolantu. Pruhy se překrývají aspoň o 10 cm a v rozích otvorů patří diagonály.',
  },
  {
    n: 'Penetrace',
    mm: 'podkladní nátěr',
    t: 'Sjednotí savost podkladu pod omítkou. Omítka pak tuhne všude stejně a nevzniknou na ní mapy.',
  },
  {
    n: 'Omítka',
    mm: 'silikonová, zrno 1,5 až 2 mm',
    t: 'Natahuje se v jednom záběru od rohu k rohu. Sokl dostane odolnou mozaikovou omítku.',
  },
]
