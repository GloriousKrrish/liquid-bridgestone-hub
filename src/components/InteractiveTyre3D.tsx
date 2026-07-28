import { useRef, useMemo, memo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ── Shared Materials (created once, reused everywhere) ──
const rubberMaterial = new THREE.MeshStandardMaterial({
  color: "#1a1c22",
  roughness: 0.55,
  metalness: 0.1,
});

const treadMaterial = new THREE.MeshStandardMaterial({
  color: "#141620",
  roughness: 0.6,
  metalness: 0.08,
});

const grooveMaterial = new THREE.MeshStandardMaterial({
  color: "#020304",
  roughness: 1.0,
});

const sidewallMaterial = new THREE.MeshStandardMaterial({
  color: "#0f1014",
  roughness: 0.8,
  metalness: 0.12,
  side: THREE.DoubleSide,
});

const rimMaterial = new THREE.MeshStandardMaterial({
  color: "#e5e7eb",
  metalness: 0.96,
  roughness: 0.08,
});

const rimBeadMaterial = new THREE.MeshStandardMaterial({
  color: "#3a3d45",
  roughness: 0.25,
  metalness: 0.85,
});

const capMaterial = new THREE.MeshStandardMaterial({
  color: "#f9fafb",
  metalness: 0.98,
  roughness: 0.04,
});

// ── Shared Geometries (created once, reused) ──
const treadBlockGeo = new THREE.BoxGeometry(0.07, 0.16, 0.04);
const spokeGeo = new THREE.BoxGeometry(0.08, 0.06, 1.1);

// ── Mouse-Follow Controller (replaces OrbitControls) ──
function MouseFollowController({
  groupRef,
  reducedMotion,
}: {
  groupRef: React.RefObject<THREE.Group>;
  reducedMotion: boolean;
}) {
  const mouse = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const handleLeave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };
    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);
    return () => {
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (!groupRef.current || document.hidden) return;

    const maxAngle = (8 * Math.PI) / 180; // 8 degrees max
    const targetX = -mouse.current.y * maxAngle;
    const targetY = mouse.current.x * maxAngle;

    // Spring lerp (smooth follow)
    const lerpFactor = 1 - Math.pow(0.001, delta);
    currentRot.current.x += (targetX - currentRot.current.x) * lerpFactor;
    currentRot.current.y += (targetY - currentRot.current.y) * lerpFactor;

    // Apply mouse tilt on top of auto rotation
    groupRef.current.rotation.x = currentRot.current.x;

    // Auto rotation (idle spin)
    if (!reducedMotion && !document.hidden) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    // Add mouse follow to Y rotation
    groupRef.current.rotation.y += currentRot.current.y * delta * 0.5;

    // Subtle float
    if (!reducedMotion) {
      groupRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.8) * 0.04;
    }
  });

  return null;
}

// ── Optimized Tire Model ──
function TireModel({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Pre-compute tread block positions
  const treadBlocks = useMemo(() => {
    const blocks: { x: number; y: number; z: number; angle: number }[] = [];
    const rows = 6;
    const cols = 40;
    const r = 2;
    const tubeR = 0.875;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const angle = (col / cols) * Math.PI * 2;
        blocks.push({
          x: (r + tubeR) * Math.cos(angle),
          y: (row - rows / 2 + 0.5) * 0.22,
          z: (r + tubeR) * Math.sin(angle),
          angle,
        });
      }
    }
    return blocks;
  }, []);

  const grooveOffsets = useMemo(() => [-0.7, -0.35, 0, 0.35, 0.7], []);
  const spokes = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i * Math.PI * 2) / 10),
    []
  );

  return (
    <group ref={groupRef} scale={0.72}>
      <MouseFollowController
        groupRef={groupRef}
        reducedMotion={reducedMotion}
      />

      {/* Main tire body */}
      <mesh castShadow receiveShadow material={rubberMaterial}>
        <torusGeometry args={[2, 0.85, 24, 48]} />
      </mesh>

      {/* Tread surface */}
      <mesh castShadow material={treadMaterial}>
        <torusGeometry args={[2, 0.87, 24, 48]} />
      </mesh>

      {/* Tread blocks (instanced via map with shared geometry) */}
      {treadBlocks.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.y, b.z]}
          rotation={[0, -b.angle + Math.PI / 2, 0]}
          geometry={treadBlockGeo}
          material={rubberMaterial}
          castShadow
        />
      ))}

      {/* Groove channels */}
      {grooveOffsets.map((offset, i) => (
        <mesh
          key={`g${i}`}
          position={[0, offset, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={grooveMaterial}
        >
          <torusGeometry args={[2.86, 0.015, 6, 48]} />
        </mesh>
      ))}

      {/* Sidewall rings */}
      <mesh
        position={[0, -0.85, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={sidewallMaterial}
        receiveShadow
      >
        <ringGeometry args={[1.15, 2.0, 48]} />
      </mesh>
      <mesh
        position={[0, 0.85, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={sidewallMaterial}
        receiveShadow
      >
        <ringGeometry args={[1.15, 2.0, 48]} />
      </mesh>

      {/* Rim bead */}
      <mesh
        position={[0, -0.82, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={rimBeadMaterial}
      >
        <torusGeometry args={[1.15, 0.05, 12, 48]} />
      </mesh>
      <mesh
        position={[0, 0.82, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={rimBeadMaterial}
      >
        <torusGeometry args={[1.15, 0.05, 12, 48]} />
      </mesh>

      {/* Central Hub */}
      <mesh material={rimMaterial} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.7, 24]} />
      </mesh>

      {/* Spokes (both sides) */}
      {spokes.map((angle, i) => (
        <group key={`sL${i}`} rotation={[0, angle, 0]} position={[0, -0.65, 0]}>
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, 0.55]}
            geometry={spokeGeo}
            material={rimMaterial}
            castShadow
          />
        </group>
      ))}
      {spokes.map((angle, i) => (
        <group key={`sR${i}`} rotation={[0, angle, 0]} position={[0, 0.65, 0]}>
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, 0.55]}
            geometry={spokeGeo}
            material={rimMaterial}
            castShadow
          />
        </group>
      ))}

      {/* Center Caps */}
      <mesh position={[0, -0.86, 0]} material={capMaterial}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
      </mesh>
      <Text
        position={[0, -0.885, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#D71920"
        fontWeight="black"
        anchorX="center"
        anchorY="middle"
      >
        B
      </Text>

      <mesh position={[0, 0.86, 0]} material={capMaterial}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
      </mesh>
      <Text
        position={[0, 0.885, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#D71920"
        fontWeight="black"
        anchorX="center"
        anchorY="middle"
      >
        B
      </Text>

      {/* Sidewall lettering — BRIDGESTONE (left) */}
      {Array.from("BRIDGESTONE").map((char, i) => {
        const angle =
          (i / 11) * Math.PI * 1.2 - Math.PI * 0.6;
        const radius = 1.62;
        return (
          <Text
            key={`lB${i}`}
            position={[
              radius * Math.cos(angle),
              -0.86,
              radius * Math.sin(angle),
            ]}
            rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
            fontSize={0.13}
            color="#ffffff"
            fontWeight={900}
            anchorX="center"
            anchorY="middle"
          >
            {char}
          </Text>
        );
      })}

      {/* Sidewall lettering — TURANZA (right) */}
      {Array.from("TURANZA").map((char, i) => {
        const angle =
          (i / 7) * Math.PI * 1.2 - Math.PI * 0.6;
        const radius = 1.62;
        return (
          <Text
            key={`rB${i}`}
            position={[
              radius * Math.cos(angle),
              0.86,
              radius * Math.sin(angle),
            ]}
            rotation={[Math.PI / 2, 0, angle - Math.PI / 2]}
            fontSize={0.13}
            color="#ffffff"
            fontWeight={900}
            anchorX="center"
            anchorY="middle"
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
}

// ── Main Export ──
export const InteractiveTyre3D = memo(function InteractiveTyre3D() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="w-full h-full"
      style={{ touchAction: "none" }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.4, 9.2], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        {/* Optimized 3-light setup */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-4, 2, -4]}
          intensity={0.5}
          color="#B0C4DE"
        />
        <spotLight
          position={[0, 8, 2]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          color="#ffffff"
          shadow-mapSize={[512, 512]}
        />

        <Suspense fallback={null}>
          <TireModel reducedMotion={reducedMotion} />
        </Suspense>

        {/* Ground shadow plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.05, 0]}
          receiveShadow
        >
          <planeGeometry args={[12, 12]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
});
