/* Procedurální model rodinného domu pro 3D příběh „Zateplete dům scrollem“.
   Jednotky jsou metry. Každá stěna má vlastní souřadnice: x podél stěny
   (zleva doprava při pohledu zvenku), y nahoru, z ven ze stěny. */

export const W = 9 // délka domu (osa x)
export const D = 7 // hloubka domu (osa z)
export const H = 5.6 // výška stěn
export const T = 0.35 // tloušťka zdiva

/* Vnější vrstvy, vzdálenost od líce zdiva (m). Izolant je kvůli čitelnosti tlustší než ve skutečnosti. */
export const OFF = {
  glue: 0.025,
  epsIn: 0.03,
  epsOut: 0.26,
  dowel: 0.262,
  mesh: 0.268,
  primer: 0.274,
  render: 0.28,
}
export const SOKL = 0.55 // výška soklu s mozaikovou omítkou

export type Opening = { u: number; v: number; w: number; h: number; door?: boolean }
export type Wall = {
  id: string
  L: number
  pos: [number, number, number]
  rotY: number
  openings: Opening[]
}

const upper = 3.35
export const WALLS: Wall[] = [
  {
    id: 'front',
    L: W,
    pos: [0, 0, D / 2],
    rotY: 0,
    openings: [
      { u: -2.7, v: 0.6, w: 1.1, h: 2.1, door: true },
      { u: 0.2, v: 0.9, w: 1.7, h: 1.45 },
      { u: 2.9, v: 0.9, w: 1.7, h: 1.45 },
      { u: -2.7, v: upper, w: 1.2, h: 1.25 },
      { u: 0.2, v: upper, w: 1.7, h: 1.25 },
      { u: 2.9, v: upper, w: 1.7, h: 1.25 },
    ],
  },
  {
    id: 'right',
    L: D,
    pos: [W / 2, 0, 0],
    rotY: Math.PI / 2,
    openings: [
      { u: -1.6, v: 0.9, w: 1.2, h: 1.45 },
      { u: 1.6, v: 0.9, w: 1.2, h: 1.45 },
      { u: 0, v: upper, w: 1.2, h: 1.25 },
    ],
  },
  {
    id: 'back',
    L: W,
    pos: [0, 0, -D / 2],
    rotY: Math.PI,
    openings: [
      { u: -2.4, v: 0.9, w: 2.4, h: 1.9 },
      { u: 2.2, v: 0.9, w: 1.2, h: 1.45 },
      { u: -2.4, v: upper, w: 1.7, h: 1.25 },
      { u: 2.2, v: upper, w: 1.2, h: 1.25 },
    ],
  },
  {
    id: 'left',
    L: D,
    pos: [-W / 2, 0, 0],
    rotY: -Math.PI / 2,
    openings: [
      { u: -1.4, v: 0.9, w: 1.2, h: 1.45 },
      { u: 0, v: upper, w: 1.2, h: 1.25 },
      { u: 1.6, v: upper, w: 1.2, h: 1.25 },
    ],
  },
]

/** Prvek na stěně v jejích souřadnicích (střed a rozměr). */
export type Item = { wall: number; x: number; y: number; w: number; h: number; order: number }

const BOARD_W = 1.0
const BOARD_H = 0.5

/** Odečte otvory od intervalu [a, b] a vrátí zbylé úseky. */
function subtract(a: number, b: number, holes: [number, number][]) {
  let parts: [number, number][] = [[a, b]]
  for (const [ha, hb] of holes) {
    parts = parts.flatMap(([pa, pb]) => {
      if (hb <= pa || ha >= pb) return [[pa, pb] as [number, number]]
      const out: [number, number][] = []
      if (ha > pa) out.push([pa, ha])
      if (hb < pb) out.push([hb, pb])
      return out
    })
  }
  return parts.filter(([pa, pb]) => pb - pa > 0.02)
}

/** Desky izolantu kladené na vazbu odspodu nahoru, kolem oken přiříznuté. */
export function buildBoards(): Item[] {
  const items: Omit<Item, 'order'>[] = []
  WALLS.forEach((wall, wi) => {
    const x0 = -wall.L / 2 - OFF.epsOut
    const x1 = wall.L / 2 + OFF.epsOut
    const rows = Math.ceil(H / BOARD_H)
    for (let r = 0; r < rows; r++) {
      const y0 = r * BOARD_H
      const y1 = Math.min(H, y0 + BOARD_H)
      // Řada se dělí ve výškách hran otvorů, aby desky přesně obkroužily okna.
      const cuts = new Set([y0, y1])
      for (const o of wall.openings) {
        if (o.v > y0 && o.v < y1) cuts.add(o.v)
        if (o.v + o.h > y0 && o.v + o.h < y1) cuts.add(o.v + o.h)
      }
      const ys = [...cuts].sort((a, b) => a - b)
      for (let i = 0; i < ys.length - 1; i++) {
        const b0 = ys[i]
        const b1 = ys[i + 1]
        const holes = wall.openings
          .filter((o) => o.v < b1 - 0.001 && o.v + o.h > b0 + 0.001)
          .map((o) => [o.u - o.w / 2, o.u + o.w / 2] as [number, number])
        for (const [a, b] of subtract(x0, x1, holes)) {
          // svislé spáry na vazbu: každá druhá řada posunutá o půl desky
          const shift = (r % 2) * (BOARD_W / 2)
          let s = a
          let k = Math.floor((a - x0 - shift) / BOARD_W) + 1
          while (s < b - 0.001) {
            const next = Math.min(b, x0 + shift + k * BOARD_W)
            if (next - s > 0.02) items.push({ wall: wi, x: (s + next) / 2, y: (b0 + b1) / 2, w: next - s, h: b1 - b0 })
            s = next
            k++
          }
        }
      }
    }
  })
  return withOrder(items)
}

/** Pořadí animace: po řadách zdola nahoru, v řadě kolem domu. */
function withOrder(items: Omit<Item, 'order'>[]): Item[] {
  const sorted = [...items].sort((a, b) => a.y - b.y || a.wall - b.wall || a.x - b.x)
  const n = Math.max(1, sorted.length - 1)
  return sorted.map((it, i) => ({ ...it, order: i / n }))
}

/** Lepidlo: na každou desku obvodový pruh naznačený třemi terči. */
export function buildDabs(boards: Item[]): Item[] {
  const out: Omit<Item, 'order'>[] = []
  for (const b of boards) {
    if (b.w > 0.45 && b.h > 0.3) {
      for (const dx of [-0.28, 0, 0.28]) out.push({ wall: b.wall, x: b.x + dx * b.w, y: b.y, w: 0.16, h: 0.16 })
    } else if (b.w > 0.15 && b.h > 0.15) out.push({ wall: b.wall, x: b.x, y: b.y, w: 0.12, h: 0.12 })
  }
  return withOrder(out)
}

/** Hmoždinky ve schématu T: ve středu desky a na styku desek. */
export function buildDowels(boards: Item[]): Item[] {
  const out: Omit<Item, 'order'>[] = []
  for (const b of boards) {
    if (b.w < 0.5 || b.h < 0.35) continue
    out.push({ wall: b.wall, x: b.x, y: b.y, w: 0.1, h: 0.1 })
    const jx = b.x + b.w / 2
    const jy = b.y + b.h / 2
    const wall = WALLS[b.wall]
    const inHole = wall.openings.some(
      (o) => jx > o.u - o.w / 2 - 0.1 && jx < o.u + o.w / 2 + 0.1 && jy > o.v - 0.1 && jy < o.v + o.h + 0.1,
    )
    if (!inHole && jy < H - 0.1 && Math.abs(jx) < wall.L / 2 + 0.1) out.push({ wall: b.wall, x: jx, y: jy, w: 0.1, h: 0.1 })
  }
  return withOrder(out)
}

/* ---------- časová osa příběhu ---------- */
export const STEPS = 7
/** Celkem jednotek: úvod, 7 vrstev, závěr. */
export const UNITS = STEPS + 2
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** Průběh k-té vrstvy (0 až 1) pro celkový průběh p. */
export const stepProgress = (p: number, k: number) => clamp01(p * UNITS - 1 - k)
