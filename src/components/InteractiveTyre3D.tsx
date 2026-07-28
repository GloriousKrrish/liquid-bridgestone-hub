import { useRef, useMemo, memo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

function TireModel({ lastInteraction }: { lastInteraction: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto-spin and floating animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      const timeSinceInteraction = Date.now() - lastInteraction.current;
      if (timeSinceInteraction > 1500) {
        groupRef.current.rotation.y += delta * 0.25;
      }
      // Subtle float animation
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.05;
    }
  });

  // Tread pattern blocks
  const treadBlocks = useMemo(() => {
    const blocks: { angle: number; offset: number }[] = [];
    const rows = 8;
    const cols = 50;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        blocks.push({
          angle: (c / cols) * Math.PI * 2,
          offset: (r - rows / 2 + 0.5) * 0.22,
        });
      }
    }
    return blocks;
  }, []);

  // Groove channels
  const grooveRings = useMemo(() => {
    return [-0.7, -0.35, 0, 0.35, 0.7];
  }, []);

  // 10 metallic spokes array
  const spokes = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => (i * Math.PI * 2) / 10);
  }, []);
  // Sidewall text characters
  const sidewallL = "BRIDGESTONE";
  const sidewallR = "TURANZA";

  return (
    <group ref={groupRef} scale={0.72}>
      {/* 1. TREAD & RUBBER BODY */}
      {/* Main tire body - outer rubber */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2, 0.85, 32, 64]} />
        <meshStandardMaterial
          color="#202228"
          roughness={0.5}
          metalness={0.12}
        />
      </mesh>

      {/* Tread surface layer */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2, 0.865, 32, 64]} />
        <meshStandardMaterial
          color="#16181d"
          roughness={0.55}
          metalness={0.08}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Tread blocks - raised patterns */}
      {treadBlocks.map((block, i) => {
        const r = 2;
        const tubeR = 0.875;
        const x = (r + tubeR * Math.cos(0)) * Math.cos(block.angle);
        const z = (r + tubeR * Math.cos(0)) * Math.sin(block.angle);
        const y = block.offset;
        return (
          <mesh
            key={`tread-${i}`}
            position={[x, y, z]}
            rotation={[0, -block.angle + Math.PI / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.07, 0.16, 0.04]} />
            <meshStandardMaterial
              color="#202228"
              roughness={0.5}
              metalness={0.12}
            />
          </mesh>
        );
      })}

      {/* Groove channels - dark recessed lines */}
      {grooveRings.map((offset, i) => (
        <mesh key={`groove-${i}`} position={[0, offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.86, 0.015, 8, 64]} />
          <meshStandardMaterial color="#020304" roughness={1.0} />
        </mesh>
      ))}

      {/* Inner sidewall ring - left */}
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.15, 2.0, 64]} />
        <meshStandardMaterial
          color="#0f1014"
          roughness={0.8}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner sidewall ring - right */}
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.15, 2.0, 64]} />
        <meshStandardMaterial
          color="#0f1014"
          roughness={0.8}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rim bead area */}
      <mesh position={[0, -0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.05, 16, 64]} />
        <meshStandardMaterial color="#3a3d45" roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.05, 16, 64]} />
        <meshStandardMaterial color="#3a3d45" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* 2. REALISTIC MULTI-SPOKE SILVER ALLOY RIM */}
      {/* Central Hub Cylinder */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.7, 32]} />
        <meshStandardMaterial
          color="#f3f4f6"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Left Spokes */}
      {spokes.map((angle, i) => (
        <group key={`spoke-l-${i}`} rotation={[0, angle, 0]} position={[0, -0.65, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.55]} castShadow>
            <boxGeometry args={[0.08, 0.06, 1.1]} />
            <meshStandardMaterial
              color="#f3f4f6"
              metalness={0.98}
              roughness={0.05}
            />
          </mesh>
        </group>
      ))}

      {/* Right Spokes */}
      {spokes.map((angle, i) => (
        <group key={`spoke-r-${i}`} rotation={[0, angle, 0]} position={[0, 0.65, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.55]} castShadow>
            <boxGeometry args={[0.08, 0.06, 1.1]} />
            <meshStandardMaterial
              color="#f3f4f6"
              metalness={0.98}
              roughness={0.05}
            />
          </mesh>
        </group>
      ))}

      {/* Chrome Center Cap Left */}
      <mesh position={[0, -0.86, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 32]} />
        <meshStandardMaterial
          color="#f9fafb"
          metalness={0.98}
          roughness={0.04}
        />
      </mesh>
      {/* Bridgestone Logo Badge Left */}
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

      {/* Chrome Center Cap Right */}
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 32]} />
        <meshStandardMaterial
          color="#f9fafb"
          metalness={0.98}
          roughness={0.04}
        />
      </mesh>
      {/* Bridgestone Logo Badge Right */}
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

      {/* 3. BRANDED WHITE LETTERING (Sidewall Curved Path) */}
      {/* BRIDGESTONE - Left Sidewall */}
      {Array.from(sidewallL).map((char, i) => {
        const angle = (i / sidewallL.length) * Math.PI * 1.2 - Math.PI * 0.6;
        const radius = 1.62;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return (
          <Text
            key={`l-brand-${i}`}
            position={[x, -0.86, z]}
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

      {/* POTENZA - Right Sidewall */}
      {Array.from(sidewallR).map((char, i) => {
        const angle = (i / sidewallR.length) * Math.PI * 1.2 - Math.PI * 0.6;
        const radius = 1.62;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return (
          <Text
            key={`r-brand-${i}`}
            position={[x, 0.86, z]}
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

function BackgroundBillboard() {
  const texture = useLoader(THREE.TextureLoader, "/bridgestone-global-logo.png");

  // Set texture settings for high quality rendering
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return (
    <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[14, 7.875]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.1} 
        depthWrite={false}
      />
    </mesh>
  );
}

export const InteractiveTyre3D = memo(function InteractiveTyre3D() {
  const lastInteraction = useRef<number>(0);

  const handleInteract = () => {
    lastInteraction.current = Date.now();
  };

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
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting setup with premium spotLight and shadow mapping */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#00E5FF" />
        <directionalLight position={[0, -5, 0]} intensity={0.4} color="#FF007A" />
        <spotLight 
          position={[0, 8, 2]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2.5} 
          castShadow 
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <BackgroundBillboard />
        </Suspense>

        <TireModel lastInteraction={lastInteraction} />

        {/* Soft contact ground shadow plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <shadowMaterial opacity={0.35} />
        </mesh>

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

