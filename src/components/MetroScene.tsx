import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

type MetroSceneProps = {
  activeProject: number
  reducedMotion: boolean
}

function Train({ reducedMotion }: Pick<MetroSceneProps, 'reducedMotion'>) {
  const train = useRef<THREE.Group | null>(null)

  useFrame(({ clock }) => {
    if (!train.current || reducedMotion) return

    train.current.position.y = -1.15 + Math.sin(clock.getElapsedTime() * 0.7) * 0.08
    train.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.28) * 0.035
  })

  return (
    <group ref={train} position={[0, -1.15, 0]} rotation={[0.04, -0.12, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4.2, 1.45, 2.2]} />
        <meshStandardMaterial color="#0d1b2d" metalness={0.86} roughness={0.27} />
      </mesh>
      <mesh position={[0, 0.2, 1.12]}>
        <boxGeometry args={[3.55, 0.72, 0.06]} />
        <meshStandardMaterial color="#f97316" emissive="#ef5f13" emissiveIntensity={1.8} />
      </mesh>
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.22, 1.17]}>
          <boxGeometry args={[0.7, 0.44, 0.04]} />
          <meshStandardMaterial color="#bfe8ff" emissive="#78caff" emissiveIntensity={2.4} />
        </mesh>
      ))}
      {[-1.55, 1.55].map((x) => (
        <mesh key={x} position={[x, -0.8, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.18, 20]} />
          <meshStandardMaterial color="#05070b" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Tunnel({ reducedMotion }: Pick<MetroSceneProps, 'reducedMotion'>) {
  const tunnel = useRef<THREE.Group | null>(null)

  useFrame(({ clock }) => {
    if (!tunnel.current || reducedMotion) return

    tunnel.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.012
  })

  return (
    <group ref={tunnel}>
      <mesh position={[0, 0, -9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 30, 42, 1, true]} />
        <meshStandardMaterial color="#06101e" side={THREE.BackSide} metalness={0.26} roughness={0.8} />
      </mesh>
      {[-5.5, -2.75, 0, 2.75, 5.5].map((x) => (
        <mesh key={x} position={[x, 2.95, -2.9]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.09, 3.5, 0.16]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.7} />
        </mesh>
      ))}
      {[-0.88, 0.88].map((x) => (
        <mesh key={x} position={[x, -1.23, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 17]} />
          <meshStandardMaterial color="#c4d7e8" metalness={0.95} roughness={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function SignalOrbit({ activeProject, reducedMotion }: MetroSceneProps) {
  const orbit = useRef<THREE.Group | null>(null)
  const colours = ['#f97316', '#38bdf8', '#c084fc']

  useFrame(({ clock }) => {
    if (!orbit.current || reducedMotion) return
    orbit.current.rotation.y = clock.getElapsedTime() * 0.18
  })

  return (
    <group ref={orbit} position={[0, 0.25, -2.1]}>
      {colours.map((colour, index) => {
        const angle = (index / colours.length) * Math.PI * 2
        const isActive = index === activeProject
        return (
          <Float key={colour} speed={isActive ? 2.1 : 1.15} rotationIntensity={0.35} floatIntensity={0.55}>
            <mesh position={[Math.cos(angle) * 3.8, Math.sin(angle * 1.7) * 1.15 + 0.75, Math.sin(angle) * 0.5]}>
              <icosahedronGeometry args={[isActive ? 0.34 : 0.2, 2]} />
              <meshStandardMaterial
                color={colour}
                emissive={colour}
                emissiveIntensity={isActive ? 2.6 : 1.05}
                metalness={0.68}
                roughness={0.19}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function MetroWorld({ activeProject, reducedMotion }: MetroSceneProps) {
  return (
    <>
      <color attach="background" args={['#030711']} />
      <fog attach="fog" args={['#030711', 8, 25]} />
      <ambientLight intensity={0.45} color="#aac9ff" />
      <pointLight position={[0, 3.2, 3]} intensity={32} color="#f97316" distance={11} />
      <pointLight position={[-5, 1, 2]} intensity={18} color="#38bdf8" distance={12} />
      <Tunnel reducedMotion={reducedMotion} />
      <Train reducedMotion={reducedMotion} />
      <SignalOrbit activeProject={activeProject} reducedMotion={reducedMotion} />
      <Sparkles count={95} scale={[12, 7, 15]} size={1.6} speed={reducedMotion ? 0 : 0.18} color="#f6b67d" />
    </>
  )
}

export function MetroScene({ activeProject, reducedMotion }: MetroSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 51, near: 0.1, far: 100, position: [0, 0.55, 9.3] }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <MetroWorld activeProject={activeProject} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
