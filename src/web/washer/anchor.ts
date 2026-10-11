import * as THREE from 'three'

/* Spirálová kotva ZOFITHERM s EPDM podložkou, maticí a závitovou tyčí,
   procedurálně podle renderu výrobce. Osa kotvy je Y, hrot nahoře.
   Rozměry jsou jen vizuální, ne technický výkres. */

const CORE = 0.13 // poloměr jádra
const BLADE = 0.32 // vnější poloměr závitu
const TOP = 1.22 // začátek závitu u hrotu
const TURNS = 6
const PITCH = 0.225

/** Šroubovitý závit s oblým okrajem (pás kolem jádra). */
function blade() {
  const perTurn = 72
  const n = Math.round(TURNS * perTurn)
  const t = 0.075 // tloušťka závitu
  const arc = 8 // body na oblém okraji
  const pos: number[] = []
  const idx: number[] = []
  let cols = 0
  for (let i = 0; i <= n; i++) {
    const turn = i / perTurn
    const th = turn * Math.PI * 2
    const y = TOP - turn * PITCH
    // u hrotu závit nabíhá, na konci se zúží
    const grow = Math.min(1, turn / 1.6)
    const fade = Math.min(1, (TURNS - turn) / 0.35)
    const R = CORE + (BLADE - CORE) * (0.35 + 0.65 * grow) * (0.55 + 0.45 * fade)
    const half = (t / 2) * (0.6 + 0.4 * fade)
    // průřez: spodní plocha, oblý okraj, horní plocha (sklon k hlavě)
    const prof: [number, number][] = [[CORE - 0.02, -half * 1.6]]
    prof.push([R - half, -half])
    for (let k = 1; k < arc; k++) {
      const a = -Math.PI / 2 + (k / arc) * Math.PI
      prof.push([R - half + Math.cos(a) * half, Math.sin(a) * half])
    }
    prof.push([R - half, half])
    prof.push([CORE - 0.02, half * 1.6])
    cols = prof.length
    const c = Math.cos(th)
    const s = Math.sin(th)
    for (const [r, a] of prof) {
      const slope = -(r - CORE) * 0.25
      pos.push(c * r, y + a + slope, s * r)
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const a = i * cols + j
      const b = (i + 1) * cols + j
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/** Závitová tyč: šroubovice z tenké trubičky kolem válce. */
function threadOn(r: number, y0: number, y1: number, pitch: number, tube: number) {
  const turns = (y0 - y1) / pitch
  const pts: THREE.Vector3[] = []
  const steps = Math.round(turns * 28)
  for (let i = 0; i <= steps; i++) {
    const u = i / steps
    const a = u * turns * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, y0 - u * (y0 - y1), Math.sin(a) * r))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, tube, 6, false)
}

export type AnchorGeometry = Record<
  'core' | 'blade' | 'collar' | 'flange' | 'rubber' | 'washer' | 'nut' | 'rod' | 'thread',
  THREE.BufferGeometry
>

export function buildAnchor(): AnchorGeometry {
  // hrot a jádro jako rotační plocha
  const core = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.0001, 1.52),
      new THREE.Vector2(0.03, 1.47),
      new THREE.Vector2(0.09, 1.34),
      new THREE.Vector2(CORE * 0.95, 1.24),
      new THREE.Vector2(CORE, 1.15),
      new THREE.Vector2(CORE, -0.18),
      new THREE.Vector2(CORE + 0.02, -0.2),
    ],
    48,
  )
  // šestihranný nákružek, talířek a EPDM podložka
  const collar = new THREE.CylinderGeometry(0.175, 0.175, 0.16, 6)
  collar.translate(0, -0.28, 0)
  const flange = new THREE.CylinderGeometry(0.245, 0.245, 0.045, 48)
  flange.translate(0, -0.38, 0)
  const rubber = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.08, -0.4),
      new THREE.Vector2(0.23, -0.4),
      new THREE.Vector2(0.43, -0.49),
      new THREE.Vector2(0.445, -0.505),
      new THREE.Vector2(0.44, -0.525),
      new THREE.Vector2(0.08, -0.525),
    ],
    64,
  )
  const washer = new THREE.CylinderGeometry(0.2, 0.2, 0.025, 48)
  washer.translate(0, -0.54, 0)
  const nut = new THREE.CylinderGeometry(0.15, 0.15, 0.14, 6)
  nut.translate(0, -0.625, 0)
  const rod = new THREE.CylinderGeometry(0.066, 0.066, 0.9, 32)
  rod.translate(0, -1.05, 0)
  const thread = threadOn(0.068, -0.69, -1.48, 0.032, 0.012)
  return { core, blade: blade(), collar, flange, rubber, washer, nut, rod, thread }
}
