import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

function TreadBlocks() {
  const count = 80;
  const blocks = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = Math.cos(a) * 2.0;
      const z = Math.sin(a) * 2.0;
      arr.push({ pos: [x, 0, z], rot: [0, -a, 0] });
    }
    return arr;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} castShadow>
          <boxGeometry args={[0.16, 1.05, 0.18]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}
      {/* zigzag grooves */}
      {blocks.map((b, i) =>
        i % 2 === 0 ? (
          <mesh key={`g${i}`} position={[b.pos[0] * 1.001, 0.35, b.pos[2] * 1.001]} rotation={b.rot}>
            <boxGeometry args={[0.17, 0.04, 0.22]} />
            <meshStandardMaterial color="#000" roughness={1} />
          </mesh>
        ) : null,
      )}
    </group>
  );
}

function Spokes() {
  const spokes = 5;
  return (
    <group>
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[1.3, 0.5, 0.22]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.18} />
          </mesh>
        );
      })}
    </group>
  );
}

function BrandText() {
  // Curved BRIDGESTONE text along sidewall, repeated
  const repeats = 4;
  const word = "BRIDGESTONE";
  return (
    <group>
      {Array.from({ length: repeats }).map((_, r) => {
        const base = (r / repeats) * Math.PI * 2;
        return (
          <group key={r}>
            {word.split("").map((ch, i) => {
              const a = base + (i / (word.length * repeats)) * Math.PI * 2 * 0.95;
              const radius = 1.78;
              return (
                <Text
                  key={`${r}-${i}`}
                  position={[Math.cos(a) * radius, 0.52, Math.sin(a) * radius]}
                  rotation={[-Math.PI / 2, 0, -a - Math.PI / 2]}
                  fontSize={0.16}
                  color="#f5f5f5"
                  anchorX="center"
                  anchorY="middle"
                  letterSpacing={0.05}
                >
                  {ch}
                </Text>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

function Wheel({ autoRotate }: { autoRotate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (autoRotate && ref.current) ref.current.rotation.y += dt * 0.35;
  });

  return (
    <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      {/* Outer tyre body */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2.0, 0.55, 48, 128]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Sidewall discs */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 2.0, 96]} />
        <meshStandardMaterial color="#101010" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 2.0, 96]} />
        <meshStandardMaterial color="#101010" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <TreadBlocks />
      <BrandText />

      {/* Rim outer ring */}
      <mesh castShadow>
        <cylinderGeometry args={[1.45, 1.45, 1.0, 64, 1, true]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Rim face */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.05, 64]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.05, 64]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Spokes inside the rim */}
      <group position={[0, 0.5, 0]}>
        <Spokes />
      </group>

      {/* Hub */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.18, 32]} />
        <meshStandardMaterial color="#3f3f46" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 24]} />
        <meshStandardMaterial color="#CC0000" metalness={0.6} roughness={0.3} emissive="#CC0000" emissiveIntensity={0.4} />
      </mesh>

      {/* Lug bolts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.55, 0.62, Math.sin(a) * 0.55]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
            <meshStandardMaterial color="#52525b" metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export function BridgestoneWheel3D({
  className,
  autoRotate = true,
}: {
  className?: string;
  autoRotate?: boolean;
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [4, 2.5, 4.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[-6, 4, -2]} intensity={0.6} color="#CC0000" />
        <Suspense fallback={null}>
          <Wheel autoRotate={autoRotate} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -2.3, 0]}
            opacity={0.55}
            scale={10}
            blur={2.4}
            far={4}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3.5}
          maxDistance={9}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
        />
      </Canvas>
    </div>
  );
}
