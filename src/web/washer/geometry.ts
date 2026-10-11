import * as THREE from 'three'

/* Kotvicí talíř ZOFITHERM jako procedurální model podle renderu výrobce.
   Jednotky: poloměr talíře = 1. Lícová strana míří do +Z.
   Tvar odpovídá renderu jen vizuálně, rozměry nejsou technický výkres. */

export const T = 0.055 // tloušťka desky
export const H = 0.04 // výška vystouplého límce, žeber a náboje
const NOTCHES = 8 // výřezy na obvodu
const ND = 0.07 // hloubka výřezu
const NW = 0.19 // polovina šířky výřezu (rad)
const HOLE_R = 0.47 // poloměr, na kterém leží otvory
const FUNNEL_TOP = 0.255 // horní poloměr zápustného kužele
const FUNNEL_BOTTOM = 0.07

/** Poloměr obvodu pro úhel a (zvlněný okraj s osmi výřezy). */
export function rimRadius(a: number) {
  const seg = (Math.PI * 2) / NOTCHES
  const d = ((((a + seg / 2) % seg) + seg) % seg) - seg / 2
  const u = Math.abs(d) / NW
  return 1 - (u < 1 ? ND * Math.pow(1 - u * u, 1.7) : 0)
}

function outline() {
  const s = new THREE.Shape()
  const n = 960
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = rimRadius(a)
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  return s
}

/** Otočená elipsa jako uzavřená cesta. */
function ellipse(path: THREE.Path, cx: number, cy: number, ar: number, at: number, rot: number, n = 64) {
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    const x = Math.cos(t) * ar
    const y = Math.sin(t) * at
    const px = cx + x * Math.cos(rot) - y * Math.sin(rot)
    const py = cy + x * Math.sin(rot) + y * Math.cos(rot)
    if (i === 0) path.moveTo(px, py)
    else path.lineTo(px, py)
  }
  return path
}

function circle(r: number) {
  const p = new THREE.Path()
  p.absarc(0, 0, r, 0, Math.PI * 2, true)
  return p
}

function ring(outer: number, inner: number) {
  const s = new THREE.Shape()
  s.absarc(0, 0, outer, 0, Math.PI * 2, false)
  s.holes.push(circle(inner))
  return s
}

/** Žebro od náboje k límci se zaoblenými konci. */
function rib(angle: number, r0: number, r1: number, w: number) {
  const s = new THREE.Shape()
  const c = Math.cos(angle)
  const sn = Math.sin(angle)
  const pt = (r: number, t: number) => [r * c - t * sn, r * sn + t * c] as const
  const n = 12
  // boční hrana, oblouk na vnějším konci, druhá boční hrana, oblouk na vnitřním konci
  s.moveTo(...pt(r0, -w))
  s.lineTo(...pt(r1, -w))
  for (let i = 1; i < n; i++) {
    const t = -Math.PI / 2 + (i / n) * Math.PI
    s.lineTo(...pt(r1 + Math.cos(t) * w * 0.6, Math.sin(t) * w))
  }
  s.lineTo(...pt(r1, w))
  s.lineTo(...pt(r0, w))
  s.closePath()
  return s
}

export type WasherGeometry = {
  plate: THREE.BufferGeometry
  raised: THREE.BufferGeometry
  funnel: THREE.BufferGeometry
  spike: THREE.BufferGeometry
  spikes: THREE.Matrix4[]
}

export function buildWasher(): WasherGeometry {
  /* deska s otvory */
  const base = outline()
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3 + Math.PI / 6
    base.holes.push(ellipse(new THREE.Path(), Math.cos(a) * HOLE_R, Math.sin(a) * HOLE_R, 0.128, 0.102, a))
  }
  // otvor v desce je stejný jako kužel ve výšce líce desky, aby nebyla vidět spára
  base.holes.push(circle(FUNNEL_TOP - ((FUNNEL_TOP - FUNNEL_BOTTOM) * H) / (T + H + 0.1)))
  const bp = 0.014
  const plate = new THREE.ExtrudeGeometry(base, {
    depth: T - bp * 2,
    bevelEnabled: true,
    bevelThickness: bp,
    bevelSize: bp,
    bevelOffset: -bp,
    bevelSegments: 4,
    curveSegments: 48,
  })
  plate.translate(0, 0, bp)

  /* vystouplý límec, náboj a šest žeber */
  const shapes = [ring(0.72, 0.65), ring(0.335, FUNNEL_TOP)]
  for (let k = 0; k < 6; k++) shapes.push(rib((k * Math.PI) / 3, 0.31, 0.665, 0.042))
  const rb = 0.013
  const raised = new THREE.ExtrudeGeometry(shapes, {
    depth: H - rb * 2,
    bevelEnabled: true,
    bevelThickness: rb,
    bevelSize: rb,
    bevelOffset: -rb,
    bevelSegments: 4,
    curveSegments: 64,
  })
  raised.translate(0, 0, T - 0.004 + rb)

  /* zápustný kužel pro hlavu šroubu (rotační plocha, osa Y → Z) */
  const top = T + H - 0.004
  const prof = [
    new THREE.Vector2(FUNNEL_TOP + 0.012, top - 0.002),
    new THREE.Vector2(FUNNEL_TOP, top - 0.008),
    new THREE.Vector2(FUNNEL_BOTTOM + 0.004, -0.1),
    new THREE.Vector2(FUNNEL_BOTTOM, -0.108),
    new THREE.Vector2(FUNNEL_BOTTOM + 0.012, -0.122),
    new THREE.Vector2(FUNNEL_BOTTOM + 0.04, -0.122),
    new THREE.Vector2(FUNNEL_TOP + 0.03, 0.004),
  ]
  const funnel = new THREE.LatheGeometry(prof, 96)
  funnel.rotateX(Math.PI / 2)

  /* trny na vnějším mezikruží (čtyřboké jehlany) */
  const spike = new THREE.ConeGeometry(0.026, 0.05, 4, 1)
  spike.rotateX(Math.PI / 2)
  spike.translate(0, 0, T + 0.022)
  const spikes: THREE.Matrix4[] = []
  const rows: [number, number, number][] = [
    [0.79, 50, 0],
    [0.875, 56, 0.5],
  ]
  const q = new THREE.Quaternion()
  const z = new THREE.Vector3(0, 0, 1)
  for (const [r, n, off] of rows) {
    for (let i = 0; i < n; i++) {
      const a = ((i + off) / n) * Math.PI * 2
      if (rimRadius(a) - r < 0.045) continue
      q.setFromAxisAngle(z, a + Math.PI / 4)
      spikes.push(new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0), q, new THREE.Vector3(1, 1, 1)))
    }
  }

  return { plate, raised, funnel, spike, spikes }
}
