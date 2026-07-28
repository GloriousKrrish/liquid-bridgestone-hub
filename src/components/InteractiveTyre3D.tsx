import { useRef, useMemo, memo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// ── Shared Materials (module-level singletons, zero GC pressure) ──
const rubberMat = new THREE.MeshStandardMaterial({ color: "#1a1c22", roughness: 0.55, metalness: 0.1 });
const treadSurfaceMat = new THREE.MeshStandardMaterial({ color: "#141620", roughness: 0.6, metalness: 0.08 });
const grooveMat = new THREE.MeshStandardMaterial({ color: "#020304", roughness: 1.0 });
const sidewallMat = new THREE.MeshStandardMaterial({ color: "#0f1014", roughness: 0.8, metalness: 0.12, side: THREE.DoubleSide });
const rimMat = new THREE.MeshStandardMaterial({ color: "#e5e7eb", metalness: 0.96, roughness: 0.08 });
const rimBeadMat = new THREE.MeshStandardMaterial({ color: "#3a3d45", roughness: 0.25, metalness: 0.85 });
const capMat = new THREE.MeshStandardMaterial({ color: "#f9fafb", metalness: 0.98, roughness: 0.04 });

// ── Shared Geometries ──
const treadBlockGeo = new THREE.BoxGeometry(0.07, 0.16, 0.04);
const spokeGeo = new THREE.BoxGeometry(0.08, 0.06, 1.1);

// ── Tyre Model ──
function TireModel({ lastInteraction }: { lastInteraction: React.MutableRefObject<number> }) {
  const spinRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!spinRef.current || document.hidden) return;
    // Auto-spin around tyre axle (pause during drag)
    const timeSinceInteraction = Date.now() - lastInteraction.current;
    if (timeSinceInteraction > 1500) {
      spinRef.current.rotation.y += delta * 0.2;
    }
    // Subtle float bob
    spinRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.04;
  });

  const treadBlocks = useMemo(() => {
    const blocks: { x: number; y: number; z: number; angle: number }[] = [];
    const rows = 6, cols = 40, R = 2, tubeR = 0.875;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const angle = (c / cols) * Math.PI * 2;
        blocks.push({
          x: (R + tubeR) * Math.cos(angle),
          y: (r - rows / 2 + 0.5) * 0.22,
          z: (R + tubeR) * Math.sin(angle),
          angle,
        });
      }
    }
    return blocks;
  }, []);

  const grooveOffsets = useMemo(() => [-0.7, -0.35, 0, 0.35, 0.7], []);
  const spokes = useMemo(() => Array.from({ length: 10 }, (_, i) => (i * Math.PI * 2) / 10), []);

  return (
    /* Outer group: sets the 3/4 view angle (standing tyre, angled toward camera) */
    <group rotation={[-Math.PI / 2 + 0.15, 0.4, 0.05]}>
      {/* Inner group: handles axle spin + float */}
      <group ref={spinRef} scale={0.72}>
        {/* Main rubber body */}
        <mesh castShadow receiveShadow material={rubberMat}>
          <torusGeometry args={[2, 0.85, 24, 48]} />
        </mesh>

        {/* Tread surface */}
        <mesh castShadow material={treadSurfaceMat}>
          <torusGeometry args={[2, 0.87, 24, 48]} />
        </mesh>

        {/* Tread blocks */}
        {treadBlocks.map((b, i) => (
          <mesh key={i} position={[b.x, b.y, b.z]} rotation={[0, -b.angle + Math.PI / 2, 0]} geometry={treadBlockGeo} material={rubberMat} castShadow />
        ))}

        {/* Groove channels */}
        {grooveOffsets.map((offset, i) => (
          <mesh key={`g${i}`} position={[0, offset, 0]} rotation={[Math.PI / 2, 0, 0]} material={grooveMat}>
            <torusGeometry args={[2.86, 0.015, 6, 48]} />
          </mesh>
        ))}

        {/* Sidewall rings */}
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} material={sidewallMat} receiveShadow>
          <ringGeometry args={[1.15, 2.0, 48]} />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} material={sidewallMat} receiveShadow>
          <ringGeometry args={[1.15, 2.0, 48]} />
        </mesh>

        {/* Rim beads */}
        <mesh position={[0, -0.82, 0]} rotation={[Math.PI / 2, 0, 0]} material={rimBeadMat}>
          <torusGeometry args={[1.15, 0.05, 12, 48]} />
        </mesh>
        <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]} material={rimBeadMat}>
          <torusGeometry args={[1.15, 0.05, 12, 48]} />
        </mesh>

        {/* Central Hub */}
        <mesh material={rimMat} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.7, 24]} />
        </mesh>

        {/* Spokes (left + right) */}
        {spokes.map((angle, i) => (
          <group key={`sL${i}`} rotation={[0, angle, 0]} position={[0, -0.65, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.55]} geometry={spokeGeo} material={rimMat} castShadow />
          </group>
        ))}
        {spokes.map((angle, i) => (
          <group key={`sR${i}`} rotation={[0, angle, 0]} position={[0, 0.65, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.55]} geometry={spokeGeo} material={rimMat} castShadow />
          </group>
        ))}

        {/* Center Caps + Logo Badge */}
        <mesh position={[0, -0.86, 0]} material={capMat}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
        </mesh>
        <Text position={[0, -0.885, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#D71920" fontWeight="black" anchorX="center" anchorY="middle">B</Text>

        <mesh position={[0, 0.86, 0]} material={capMat}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
        </mesh>
        <Text position={[0, 0.885, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.16} color="#D71920" fontWeight="black" anchorX="center" anchorY="middle">B</Text>

        {/* Sidewall lettering — BRIDGESTONE (left) */}
        {Array.from("BRIDGESTONE").map((char, i) => {
          const a = (i / 11) * Math.PI * 1.2 - Math.PI * 0.6;
          const r = 1.62;
          return (
            <Text key={`lB${i}`} position={[r * Math.cos(a), -0.86, r * Math.sin(a)]} rotation={[-Math.PI / 2, 0, -a + Math.PI / 2]} fontSize={0.13} color="#ffffff" fontWeight={900} anchorX="center" anchorY="middle">{char}</Text>
          );
        })}

        {/* Sidewall lettering — TURANZA (right) */}
        {Array.from("TURANZA").map((char, i) => {
          const a = (i / 7) * Math.PI * 1.2 - Math.PI * 0.6;
          const r = 1.62;
          return (
            <Text key={`rB${i}`} position={[r * Math.cos(a), 0.86, r * Math.sin(a)]} rotation={[Math.PI / 2, 0, a - Math.PI / 2]} fontSize={0.13} color="#ffffff" fontWeight={900} anchorX="center" anchorY="middle">{char}</Text>
          );
        })}
      </group>
    </group>
  );
}

// ── Main Export ──
export const InteractiveTyre3D = memo(function InteractiveTyre3D() {
  const lastInteraction = useRef<number>(0);
  const handleInteract = () => { lastInteraction.current = Date.now(); };

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
      onPointerDown={handleInteract}
      onPointerMove={handleInteract}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.4, 9.2], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow shadow-mapSize={[512, 512]} shadow-bias={-0.0001} />
        <directionalLight position={[-4, 2, -4]} intensity={0.5} color="#B0C4DE" />
        <spotLight position={[0, 8, 2]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" shadow-mapSize={[512, 512]} />

        <Suspense fallback={null}>
          <TireModel lastInteraction={lastInteraction} />
        </Suspense>

        {/* Ground shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Interactive drag controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          enableDamping
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
});
