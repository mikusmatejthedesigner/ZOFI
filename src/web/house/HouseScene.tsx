import { useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import {
  D,
  H,
  OFF,
  SOKL,
  STEPS,
  T,
  UNITS,
  W,
  WALLS,
  buildBoards,
  buildDabs,
  buildDowels,
  clamp01,
  stepProgress,
  type Item,
  type Wall,
} from './model'

export type SceneProps = {
  /** průběh příběhu 0 až 1 (ze ScrollTriggeru) */
  progress: RefObject<number>
  /** poloha myši -1 až 1 */
  pointer: RefObject<{ x: number; y: number }>
  /** na širokém displeji se dům posune doprava, vlevo je seznam vrstev */
  wide: boolean
  /** vykreslovat jen, když je scéna vidět */
  active: boolean
}

export default function HouseScene({ progress, pointer, wide, active }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={wide ? [1, 1.75] : [1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 30, position: [17, 9, 24], near: 0.5, far: 160 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Lights progress={progress} />
      <CameraRig progress={progress} pointer={pointer} wide={wide} />
      <HouseModel progress={progress} />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <shadowMaterial opacity={0.14} />
      </mesh>
      <ContactShadows position={[0, 0.005, 0]} opacity={0.45} scale={26} blur={2.6} far={6} resolution={512} frames={1} color="#1d1d1b" />
    </Canvas>
  )
}

/* ---------- pomocné ---------- */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const smooth = (t: number) => t * t * (3 - 2 * t)

/** Šedý šum jako textura (břízolit, polystyren, omítka). */
function noiseTexture(size = 256, min = 205, repeat = 1) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = min + Math.random() * (255 - min)
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Síťovina: mřížka v barvě ZOFI na světlé stěrce. */
function meshTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, s, s)
  ctx.strokeStyle = 'rgba(230,33,82,0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 1.5)
  ctx.lineTo(s, 1.5)
  ctx.moveTo(1.5, 0)
  ctx.lineTo(1.5, s)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(5, 5)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const wallMatrix = (w: Wall) =>
  new THREE.Matrix4().compose(
    new THREE.Vector3(...w.pos),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), w.rotY),
    new THREE.Vector3(1, 1, 1),
  )

function rectShape(x0: number, x1: number, y0: number, y1: number) {
  const s = new THREE.Shape()
  s.moveTo(x0, y0)
  s.lineTo(x1, y0)
  s.lineTo(x1, y1)
  s.lineTo(x0, y1)
  s.closePath()
  return s
}
function withHoles(shape: THREE.Shape, wall: Wall) {
  for (const o of wall.openings) {
    const p = new THREE.Path()
    p.moveTo(o.u - o.w / 2, o.v)
    p.lineTo(o.u - o.w / 2, o.v + o.h)
    p.lineTo(o.u + o.w / 2, o.v + o.h)
    p.lineTo(o.u + o.w / 2, o.v)
    p.closePath()
    shape.holes.push(p)
  }
  return shape
}

/* ---------- světla ---------- */
function Lights({ progress }: { progress: RefObject<number> }) {
  const sun = useRef<THREE.DirectionalLight>(null)
  const warm = useMemo(() => new THREE.Color('#ffd9b3'), [])
  const white = useMemo(() => new THREE.Color('#ffffff'), [])
  useFrame(() => {
    // na konci příběhu se světlo zbarví do zapadajícího slunce
    const o = clamp01((progress.current ?? 0) * UNITS - (UNITS - 1))
    if (sun.current) sun.current.color.copy(white).lerp(warm, smooth(o) * 0.8)
  })
  return (
    <>
      <hemisphereLight args={['#ffffff', '#d9d4cb', 1.15]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[11, 17, 12]}
        intensity={2.6}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-12, 6, -8]} intensity={0.5} />
    </>
  )
}

/* ---------- kamera ---------- */
// Klíčové záběry v jednotkách příběhu (úvod, 7 vrstev, závěr). Kamera jede po oblouku
// kolem domu: úhel (0 = zepředu, kladný doprava), vzdálenost, výška, výška bodu pohledu.
type Shot = { u: number; a: number; r: number; h: number; ty: number }
const SHOTS: Shot[] = [
  { u: 0, a: 0.62, r: 36, h: 9, ty: 8.2 },
  { u: 1, a: 0.72, r: 25, h: 7, ty: 3 },
  { u: 2, a: -0.5, r: 22.5, h: 5.5, ty: 2.7 },
  { u: 3, a: -0.95, r: 24, h: 8, ty: 2.9 },
  { u: 4.6, a: 0.85, r: 23, h: 7, ty: 2.9 },
  { u: 6, a: 0.4, r: 21, h: 4.6, ty: 2.8 },
  { u: 7.6, a: -0.32, r: 22.5, h: 5.2, ty: 2.8 },
  { u: UNITS, a: 0.55, r: 34, h: 10.5, ty: 7.2 },
]

// pracovní vektory kamery (scéna je na stránce jen jednou)
const cam = {
  pos: new THREE.Vector3(),
  tgt: new THREE.Vector3(),
  look: new THREE.Vector3(0, 4, 0),
  right: new THREE.Vector3(),
  up: new THREE.Vector3(0, 1, 0),
  shift: 0,
}

function CameraRig({
  progress,
  pointer,
  wide,
}: {
  progress: RefObject<number>
  pointer: RefObject<{ x: number; y: number }>
  wide: boolean
}) {
  const { camera, size } = useThree()
  const shown = useRef(0)

  useFrame((state, dt) => {
    // na úzkém (na výšku) displeji kamera ustoupí, aby byl dům celý v záběru
    const aspect = size.width / Math.max(1, size.height)
    const fit = aspect < 1.3 ? Math.min(2.3, 1.3 / aspect) : 1
    shown.current = THREE.MathUtils.damp(shown.current, progress.current ?? 0, 4, dt)
    const u = shown.current * UNITS
    let i = 0
    while (i < SHOTS.length - 2 && u > SHOTS[i + 1].u) i++
    const A = SHOTS[i]
    const B = SHOTS[i + 1]
    const k = smooth(clamp01((u - A.u) / (B.u - A.u)))
    const lerp = THREE.MathUtils.lerp
    // jemné kroužení v klidu a natočení podle myši
    const t = state.clock.elapsedTime
    const idle = 1 - clamp01(u)
    const p = pointer.current ?? { x: 0, y: 0 }
    const a = lerp(A.a, B.a, k) + Math.sin(t * 0.22) * 0.06 * idle + p.x * 0.05
    // na mobilu je v úvodu nad domem dlouhý text: dům je blíž a v obraze níž
    const narrow = aspect < 0.8
    const r = narrow ? lerp(lerp(A.r, B.r, k) * fit, 58, idle) : lerp(A.r, B.r, k) * fit
    const ty = lerp(A.ty, B.ty, k) + (narrow ? idle * 6 : 0)
    const { pos, tgt, look, right, up } = cam
    pos.set(Math.sin(a) * r, lerp(A.h, B.h, k) + p.y * 0.6, Math.cos(a) * r)
    tgt.set(0, ty, 0)
    // na širokém displeji je vlevo seznam vrstev, dům se v obraze posune doprava
    const inStory = u > 0.7 && u < UNITS - 0.6
    cam.shift = THREE.MathUtils.damp(cam.shift, wide && inStory ? r * 0.16 : 0, 3, dt)
    right.subVectors(tgt, pos).cross(up).normalize()
    pos.addScaledVector(right, -cam.shift)
    tgt.addScaledVector(right, -cam.shift)
    camera.position.lerp(pos, 1 - Math.exp(-dt * 5))
    look.lerp(tgt, 1 - Math.exp(-dt * 5))
    camera.lookAt(look)
  })
  return null
}

/* ---------- dům ---------- */
// ořezové roviny pro vrstvy nanášené odspodu nahoru (síťovina, penetrace, omítka)
const CLIPS = {
  mesh: new THREE.Plane(new THREE.Vector3(0, -1, 0), -1),
  primer: new THREE.Plane(new THREE.Vector3(0, -1, 0), -1),
  render: new THREE.Plane(new THREE.Vector3(0, -1, 0), -1),
}

function HouseModel({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const shown = useRef(0)

  const data = useMemo(() => {
    const boards = buildBoards()
    return { boards, dabs: buildDabs(boards), dowels: buildDowels(boards), mats: WALLS.map(wallMatrix) }
  }, [])

  const tex = useMemo(
    () => ({
      old: noiseTexture(256, 170, 3),
      eps: noiseTexture(128, 200, 2),
      fine: noiseTexture(256, 225, 4),
      mesh: meshTexture(),
    }),
    [],
  )

  const clips = CLIPS

  const mat = useMemo(
    () => ({
      old: new THREE.MeshStandardMaterial({ color: '#c2b6a4', map: tex.old, roughness: 0.95 }),
      eps: new THREE.MeshStandardMaterial({ color: '#80848c', map: tex.eps, roughness: 0.9 }),
      glue: new THREE.MeshStandardMaterial({ color: '#e4e0d6', roughness: 1 }),
      dowel: new THREE.MeshStandardMaterial({ color: '#fafafa', roughness: 0.6 }),
      mesh: new THREE.MeshStandardMaterial({ color: '#efebe3', map: tex.mesh, roughness: 0.95, clippingPlanes: [clips.mesh] }),
      primer: new THREE.MeshStandardMaterial({ color: '#f3efe6', roughness: 0.55, clippingPlanes: [clips.primer] }),
      render: new THREE.MeshStandardMaterial({ color: '#f6f3ec', map: tex.fine, roughness: 0.92, clippingPlanes: [clips.render] }),
      sokl: new THREE.MeshStandardMaterial({ color: '#56575c', map: tex.old, roughness: 0.85, clippingPlanes: [clips.render] }),
      roof: new THREE.MeshStandardMaterial({ color: '#2c2d31', roughness: 0.75, flatShading: true }),
      trim: new THREE.MeshStandardMaterial({ color: '#ebe9e4', roughness: 0.8 }),
      frame: new THREE.MeshStandardMaterial({ color: '#f7f7f5', roughness: 0.45 }),
      glass: new THREE.MeshStandardMaterial({ color: '#28394a', roughness: 0.08, metalness: 0.35 }),
      door: new THREE.MeshStandardMaterial({ color: '#3a3a3d', roughness: 0.5 }),
      concrete: new THREE.MeshStandardMaterial({ color: '#d9d6d0', roughness: 0.95 }),
      pad: new THREE.MeshStandardMaterial({ color: '#e7e5e0', roughness: 1 }),
    }),
    [tex, clips],
  )

  /* geometrie stěn a vrstev pro každou stěnu */
  const geo = useMemo(() => {
    return WALLS.map((w) => {
      const wall = new THREE.ExtrudeGeometry(withHoles(rectShape(-w.L / 2, w.L / 2, 0, H), w), {
        depth: T,
        bevelEnabled: false,
      })
      wall.translate(0, 0, -T)
      const layer = (off: number, y0: number) =>
        new THREE.ShapeGeometry(withHoles(rectShape(-w.L / 2 - off, w.L / 2 + off, y0, H), w))
      return {
        wall,
        mesh: layer(OFF.mesh, 0),
        primer: layer(OFF.primer, 0),
        render: layer(OFF.render, SOKL),
        sokl: new THREE.PlaneGeometry(w.L + 2 * OFF.render, SOKL),
      }
    })
  }, [])

  const roof = useMemo(() => buildRoof(), [])

  /* instance: desky, terče lepidla, hmoždinky */
  const boardsRef = useRef<THREE.InstancedMesh>(null)
  const dabsRef = useRef<THREE.InstancedMesh>(null)
  const dowelsRef = useRef<THREE.InstancedMesh>(null)
  const scanRef = useRef<THREE.Group>(null)
  const edgeRef = useRef<THREE.Group>(null)
  const last = useRef({ dabs: -1, boards: -1, dowels: -1 })

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), e: new THREE.Euler() }),
    [],
  )

  const place = (mesh: THREE.InstancedMesh | null, items: Item[], s: number, kind: 'board' | 'dab' | 'dowel') => {
    if (!mesh) return
    const { m, p, q, s: sc, e } = tmp
    items.forEach((it, i) => {
      const local = clamp01((s - it.order * 0.78) / 0.22)
      if (kind === 'board') {
        const k = easeOut(local)
        const fly = 1 - k
        const th = OFF.epsOut - OFF.epsIn
        p.set(it.x, it.y + fly * 0.9, OFF.epsIn + th / 2 + fly * 2.6)
        e.set(fly * -0.35, fly * 0.55, 0)
        q.setFromEuler(e)
        const v = local > 0 ? 1 : 0
        sc.set(it.w * 0.994 * v, it.h * 0.985 * v, th * v)
      } else {
        const k = local > 0 ? Math.max(0, easeOutBack(local)) : 0
        const depth = kind === 'dab' ? 0.035 : 0.022
        p.set(it.x, it.y, kind === 'dab' ? OFF.glue : OFF.dowel)
        e.set(Math.PI / 2, 0, 0)
        q.setFromEuler(e)
        sc.set(it.w * k, depth * Math.min(1, k + 0.001), it.h * k)
      }
      m.compose(p, q, sc).premultiply(data.mats[it.wall])
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useFrame((_, dt) => {
    shown.current = THREE.MathUtils.damp(shown.current, progress.current ?? 0, 4, dt)
    const p = shown.current
    const s = (k: number) => stepProgress(p, k)

    // instance přepočítat jen při změně
    const round = (x: number) => Math.round(x * 2000) / 2000
    const sd = round(s(1))
    const sb = round(s(2))
    const sw = round(s(3))
    if (sd !== last.current.dabs) {
      place(dabsRef.current, data.dabs, sd, 'dab')
      last.current.dabs = sd
    }
    if (sb !== last.current.boards) {
      place(boardsRef.current, data.boards, sb, 'board')
      last.current.boards = sb
    }
    if (sw !== last.current.dowels) {
      place(dowelsRef.current, data.dowels, sw, 'dowel')
      last.current.dowels = sw
    }

    // stěrka se síťovinou, penetrace a omítka se natahují odspodu nahoru
    const reveal = (x: number) => (x <= 0 ? -1 : x >= 1 ? H + 1 : smooth(x) * (H + 0.05))
    clips.mesh.constant = reveal(s(4))
    clips.primer.constant = reveal(s(5))
    clips.render.constant = reveal(s(6))

    // kontrola podkladu: světelný pás jede po stěnách nahoru
    const s0 = s(0)
    if (scanRef.current) {
      scanRef.current.visible = s0 > 0 && s0 < 1
      scanRef.current.position.y = smooth(s0) * H
    }
    // čerstvá hrana právě nanášené vrstvy
    const active = [4, 5, 6].find((k) => s(k) > 0 && s(k) < 1)
    if (edgeRef.current) {
      edgeRef.current.visible = active !== undefined
      if (active !== undefined) edgeRef.current.position.y = reveal(s(active))
    }

    // na konci se dům pomalu otočí
    const u = p * UNITS
    if (group.current) group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, u > UNITS - 1 ? 0.35 : 0, 2, dt)
  })

  const cyl = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 1, 14), [])
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  return (
    <group ref={group}>
      {/* podstavec jako u architektonického modelu */}
      <mesh position={[0, -0.04, 0]} receiveShadow material={mat.pad}>
        <boxGeometry args={[W + 4.5, 0.08, D + 4.5]} />
      </mesh>

      {WALLS.map((w, i) => (
        <group key={w.id} position={w.pos} rotation-y={w.rotY}>
          <mesh geometry={geo[i].wall} material={mat.old} castShadow receiveShadow />
          <mesh geometry={geo[i].mesh} material={mat.mesh} position-z={OFF.mesh} receiveShadow />
          <mesh geometry={geo[i].primer} material={mat.primer} position-z={OFF.primer} receiveShadow />
          <mesh geometry={geo[i].render} material={mat.render} position-z={OFF.render} castShadow receiveShadow />
          <mesh geometry={geo[i].sokl} material={mat.sokl} position={[0, SOKL / 2, OFF.render + 0.004]} receiveShadow />
          {w.openings.map((o, j) => (
            <Opening key={j} o={o} mat={mat} />
          ))}
          {/* pás kontroly podkladu a čerstvá hrana vrstvy (pozice y řídí skupina výš) */}
        </group>
      ))}

      <group ref={scanRef} visible={false}>
        {WALLS.map((w) => (
          <group key={w.id} position={w.pos} rotation-y={w.rotY}>
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[w.L + 0.12, 0.14]} />
              <meshBasicMaterial color="#ff2d5f" transparent opacity={0.75} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={edgeRef} visible={false}>
        {WALLS.map((w) => (
          <group key={w.id} position={w.pos} rotation-y={w.rotY}>
            <mesh position={[0, 0, OFF.render + 0.012]}>
              <planeGeometry args={[w.L + 2 * OFF.render, 0.05]} />
              <meshBasicMaterial color="#ff2d5f" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      <instancedMesh ref={dabsRef} args={[cyl, mat.glue, data.dabs.length]} castShadow />
      <instancedMesh ref={boardsRef} args={[box, mat.eps, data.boards.length]} castShadow receiveShadow />
      <instancedMesh ref={dowelsRef} args={[cyl, mat.dowel, data.dowels.length]} />

      {/* střecha, podbití, komín */}
      <mesh geometry={roof} material={mat.roof} castShadow receiveShadow />
      <mesh position={[0, H - 0.07, 0]} material={mat.trim} castShadow receiveShadow>
        <boxGeometry args={[W + 1.1, 0.14, D + 1.1]} />
      </mesh>
      <mesh position={[-2, H + 1.9, -1]} material={mat.trim} castShadow>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
      </mesh>

      {/* schody ke dveřím */}
      {[0, 1, 2].map((k) => (
        <mesh
          key={k}
          position={[-2.7, ((k + 1) * 0.2) / 2, D / 2 + OFF.render + 0.45 + (2 - k) * 0.3]}
          material={mat.concrete}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.9, (k + 1) * 0.2, 0.9]} />
        </mesh>
      ))}
    </group>
  )
}

/** Okno nebo dveře: rám, sklo a ostění, které se omítne spolu s fasádou. */
function Opening({ o, mat }: { o: Wall['openings'][number]; mat: Record<string, THREE.Material> }) {
  const f = 0.07 // šířka rámu
  const zf = -T * 0.4 // rám osazený v ostění
  const cx = o.u
  const cy = o.v + o.h / 2
  const depth = OFF.render - zf
  const zr = (OFF.render + zf) / 2
  return (
    <group>
      {/* rám */}
      <mesh position={[cx, o.v + o.h - f / 2, zf]} material={mat.frame} castShadow>
        <boxGeometry args={[o.w, f, 0.09]} />
      </mesh>
      <mesh position={[cx, o.v + f / 2, zf]} material={mat.frame}>
        <boxGeometry args={[o.w, f, 0.09]} />
      </mesh>
      <mesh position={[cx - o.w / 2 + f / 2, cy, zf]} material={mat.frame}>
        <boxGeometry args={[f, o.h, 0.09]} />
      </mesh>
      <mesh position={[cx + o.w / 2 - f / 2, cy, zf]} material={mat.frame}>
        <boxGeometry args={[f, o.h, 0.09]} />
      </mesh>
      {!o.door && o.w > 1.5 && (
        <mesh position={[cx, cy, zf]} material={mat.frame}>
          <boxGeometry args={[f * 0.8, o.h, 0.09]} />
        </mesh>
      )}
      {/* sklo nebo dveřní křídlo */}
      <mesh position={[cx, cy, zf - 0.01]} material={o.door ? mat.door : mat.glass}>
        <planeGeometry args={[o.w - f, o.h - f]} />
      </mesh>
      {/* ostění: omítne se se zbytkem fasády (stejná ořezová rovina) */}
      <mesh position={[cx, o.v + o.h - 0.01, zr]} material={mat.render}>
        <boxGeometry args={[o.w, 0.02, depth]} />
      </mesh>
      <mesh position={[cx, o.v + 0.01, zr]} material={mat.render}>
        <boxGeometry args={[o.w, 0.02, depth]} />
      </mesh>
      <mesh position={[cx - o.w / 2 + 0.01, cy, zr]} material={mat.render}>
        <boxGeometry args={[0.02, o.h, depth]} />
      </mesh>
      <mesh position={[cx + o.w / 2 - 0.01, cy, zr]} material={mat.render}>
        <boxGeometry args={[0.02, o.h, depth]} />
      </mesh>
      {/* parapet */}
      {!o.door && (
        <mesh position={[cx, o.v - 0.02, OFF.render / 2 + 0.06]} material={mat.frame} castShadow>
          <boxGeometry args={[o.w + 0.12, 0.04, OFF.render + 0.12 - zf]} />
        </mesh>
      )}
    </group>
  )
}

/** Valbová střecha s přesahem. */
function buildRoof() {
  const o = 0.6
  const a = W / 2 + o
  const b = D / 2 + o
  const r = 2.4
  const ridge = (W - D) / 2
  const y = H
  const v = (x: number, yy: number, z: number) => [x, yy, z]
  const tris = [
    // přední a zadní šikmá plocha
    [v(-a, y, b), v(a, y, b), v(ridge, y + r, 0)],
    [v(-a, y, b), v(ridge, y + r, 0), v(-ridge, y + r, 0)],
    [v(a, y, -b), v(-a, y, -b), v(-ridge, y + r, 0)],
    [v(a, y, -b), v(-ridge, y + r, 0), v(ridge, y + r, 0)],
    // boční trojúhelníky
    [v(a, y, b), v(a, y, -b), v(ridge, y + r, 0)],
    [v(-a, y, -b), v(-a, y, b), v(-ridge, y + r, 0)],
    // spodní plocha přesahu
    [v(-a, y, b), v(a, y, -b), v(a, y, b)],
    [v(-a, y, b), v(-a, y, -b), v(a, y, -b)],
  ].flat(2)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(tris, 3))
  g.computeVertexNormals()
  return g
}

export { STEPS }
