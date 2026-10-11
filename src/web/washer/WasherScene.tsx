import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import { buildWasher } from './geometry'
import { buildAnchor } from './anchor'

export type WasherMode = 'hero' | 'inspect'
export type Product = 'talir' | 'kotva'

type Props = {
  mode: WasherMode
  /** průběh scrollu sekce 0 až 1 */
  progress?: RefObject<number>
  /** poloha myši v okně, -1 až 1 */
  pointer?: RefObject<{ x: number; y: number }>
  /** mimo obrazovku se nekreslí */
  active: boolean
  /** otáčení tažením (jen myš) */
  drag?: boolean
  /** produkt v detailu: talíř nebo spirálová kotva */
  product?: Product
  onReady?: () => void
}

/** 3D talíř ZOFITHERM: lesklý červený plast ve studiovém světle. Načítá se líně. */
export default function WasherScene({ mode, progress, pointer, active, drag = false, product = 'talir', onReady }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, mode === 'hero' ? 5.4 : 4.6], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <Studio />
      {mode === 'hero' ? (
        <HeroRig progress={progress} pointer={pointer}>
          <Washer />
        </HeroRig>
      ) : (
        <>
          <PresentationControls
            enabled={drag}
            global={false}
            cursor
            snap={false}
            speed={1.6}
            polar={[-Math.PI / 2.2, Math.PI / 2.2]}
            azimuth={[-Infinity, Infinity]}
          >
            <InspectRig progress={progress} product={product}>
              <Swap product={product} />
            </InspectRig>
          </PresentationControls>
          <ContactShadows position={[0, -1.25, 0]} opacity={0.32} scale={5} blur={2.6} far={2.4} resolution={512} />
        </>
      )}
    </Canvas>
  )
}

/** Studiové světlo bez stahování HDR: světelné plochy jen pro odlesky. */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.05} />
      {/* hlavní světlo vrhá stíny: žebra, límec a trny stíní na desku */}
      <directionalLight
        position={[-2.5, 4, 4.5]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.015}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={1.6}
        shadow-camera-bottom={-1.6}
        shadow-camera-near={1}
        shadow-camera-far={14}
      />
      <directionalLight position={[4, -2, 2]} intensity={0.3} color="#ffd0d8" />
      <directionalLight position={[1, 3, -5]} intensity={1.1} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.4} position={[-1, 5, 5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 3]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[6, -1, 3]} rotation-y={-Math.PI / 2} scale={[4, 1.2, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[2, 3, -4]} scale={2.5} />
      </Environment>
    </>
  )
}

function Washer() {
  const g = useMemo(() => buildWasher(), [])
  const spikes = useRef<THREE.InstancedMesh>(null)
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#cc2240',
        roughness: 0.34,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        sheen: 0.35,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ff9aab'),
        envMapIntensity: 1.5,
      }),
    [],
  )
  const inner = useMemo(() => {
    const m = mat.clone()
    m.side = THREE.DoubleSide
    m.color = new THREE.Color('#b81d33')
    return m
  }, [mat])

  useLayoutEffect(() => {
    const im = spikes.current
    if (!im) return
    g.spikes.forEach((m, i) => im.setMatrixAt(i, m))
    im.instanceMatrix.needsUpdate = true
  }, [g])

  return (
    // střed tloušťky v počátku, aby se talíř otáčel kolem sebe
    <group position={[0, 0, -0.05]}>
      <mesh geometry={g.plate} material={mat} castShadow receiveShadow />
      <mesh geometry={g.raised} material={mat} castShadow receiveShadow />
      <mesh geometry={g.funnel} material={inner} castShadow receiveShadow />
      <instancedMesh ref={spikes} args={[g.spike, mat, g.spikes.length]} castShadow />
    </group>
  )
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)

/** Úvod: talíř přiletí, pomalu se točí, naklání se za myší a při scrollu se natočí k divákovi. */
function HeroRig({
  children,
  progress,
  pointer,
}: {
  children: React.ReactNode
  progress?: RefObject<number>
  pointer?: RefObject<{ x: number; y: number }>
}) {
  const outer = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const t0 = useRef<number | null>(null)

  useFrame((state, dt) => {
    const o = outer.current
    const s = spin.current
    if (!o || !s) return
    if (t0.current === null) t0.current = state.clock.elapsedTime
    const intro = ease((state.clock.elapsedTime - t0.current) / 1.6)
    const p = progress?.current ?? 0
    const px = pointer?.current?.x ?? 0
    const py = pointer?.current?.y ?? 0

    s.rotation.z += dt * 0.18
    const tx = -0.62 + p * 0.25 + py * 0.16
    const ty = 0.62 - p * 0.5 + px * 0.24 + (1 - intro) * -1.6
    o.rotation.x = THREE.MathUtils.damp(o.rotation.x, tx, 4, dt)
    o.rotation.y = THREE.MathUtils.damp(o.rotation.y, ty, 4, dt)
    o.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.05 + p * 0.5
    const sc = (0.75 + intro * 0.25) * (1 + p * 0.12)
    o.scale.setScalar(sc)
  })

  return (
    <group ref={outer}>
      <group ref={spin}>{children}</group>
    </group>
  )
}

/** Detail: talíř se při scrollu pomalu otáčí z lícové strany na rubovou. */
function InspectRig({
  children,
  progress,
  product,
}: {
  children: React.ReactNode
  progress?: RefObject<number>
  product: Product
}) {
  const g = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    const el = g.current
    if (!el) return
    const p = progress?.current ?? 0
    if (product === 'kotva') {
      // kotva leží šikmo a točí se kolem své osy, celek se jen lehce naklání
      el.rotation.x = THREE.MathUtils.damp(el.rotation.x, -0.25 + p * 0.3, 3, dt)
      el.rotation.y = THREE.MathUtils.damp(el.rotation.y, -0.35 + p * 0.7, 3, dt)
      el.rotation.z = THREE.MathUtils.damp(el.rotation.z, 0, 3, dt)
      el.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04
      return
    }
    // vždy natočený lícem k divákovi, aby nebyl vidět jen z hrany
    el.rotation.x = THREE.MathUtils.damp(el.rotation.x, -0.85 + p * 0.45, 3, dt)
    el.rotation.y = THREE.MathUtils.damp(el.rotation.y, -0.55 + p * 1.1, 3, dt)
    el.rotation.z += dt * 0.12
    el.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04
  })
  return <group ref={g}>{children}</group>
}

/** Výměna produktu: starý se zmenší a otočí pryč, nový naroste. */
function Swap({ product }: { product: Product }) {
  const [shown, setShown] = useState<Product>(product)
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    const el = g.current
    if (!el) return
    const out = product !== shown
    const s = THREE.MathUtils.damp(el.scale.x, out ? 0 : 1, out ? 9 : 5, dt)
    el.scale.setScalar(Math.max(0.0001, s))
    el.rotation.y += dt * (out ? 6 : 0) + (1 - s) * dt * 4
    if (out && s < 0.04) {
      el.rotation.y = -1.2
      setShown(product)
    }
    if (!out) el.rotation.y = THREE.MathUtils.damp(el.rotation.y, 0, 4, dt)
  })
  return <group ref={g}>{shown === 'talir' ? <Washer /> : <Anchor />}</group>
}

/** Spirálová kotva: světlý plast, černá EPDM podložka, nerezová matice a závitová tyč. */
function Anchor() {
  const g = useMemo(() => buildAnchor(), [])
  const spin = useRef<THREE.Group>(null)
  const m = useMemo(() => {
    const plastic = new THREE.MeshPhysicalMaterial({
      color: '#e4e7ec',
      roughness: 0.42,
      clearcoat: 0.35,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.1,
    })
    const blade = plastic.clone()
    blade.color = new THREE.Color('#f3f4f6')
    blade.side = THREE.DoubleSide
    const grey = plastic.clone()
    grey.color = new THREE.Color('#c9ced6')
    const rubber = new THREE.MeshPhysicalMaterial({
      color: '#1d2027',
      roughness: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.2,
    })
    const steel = new THREE.MeshStandardMaterial({ color: '#e2e6ec', metalness: 0.85, roughness: 0.3, envMapIntensity: 2.2 })
    // šestihranné díly s ostrými hranami
    const hex = steel.clone()
    hex.flatShading = true
    const greyHex = grey.clone()
    greyHex.flatShading = true
    return { plastic, blade, grey, greyHex, rubber, steel, hex }
  }, [])
  // kotva se pomalu „zašroubovává“ kolem své osy
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.7
  })
  return (
    // šikmo jako na renderu: hrot vlevo nahoře
    <group rotation={[0.25, 0.2, 0.72]} scale={0.68}>
      <group ref={spin}>
        <mesh geometry={g.core} material={m.plastic} castShadow receiveShadow />
        <mesh geometry={g.blade} material={m.blade} castShadow receiveShadow />
        <mesh geometry={g.collar} material={m.greyHex} castShadow receiveShadow />
        <mesh geometry={g.flange} material={m.grey} castShadow receiveShadow />
        <mesh geometry={g.rubber} material={m.rubber} castShadow receiveShadow />
        <mesh geometry={g.washer} material={m.steel} castShadow />
        <mesh geometry={g.nut} material={m.hex} castShadow receiveShadow />
        <mesh geometry={g.rod} material={m.steel} castShadow />
        <mesh geometry={g.thread} material={m.steel} castShadow />
      </group>
    </group>
  )
}
