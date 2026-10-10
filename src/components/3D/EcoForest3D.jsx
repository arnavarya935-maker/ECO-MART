import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sunset, Sparkles as SparklesIcon, Trees } from 'lucide-react';

// Wind-reactive individual grass blade cluster
function WindGrassCluster({ count = 80, radius = 2.2, windSpeed = 1.6 }) {
  const meshRef = useRef();
  
  // Generate random blade transforms
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const bladeData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = -0.55 + Math.sin(x * 1.5) * 0.08 + Math.cos(z * 1.5) * 0.08;
      const rotY = Math.random() * Math.PI;
      const scale = 0.5 + Math.random() * 0.7;
      data.push({ x, y, z, rotY, scale, phase: Math.random() * Math.PI });
    }
    return data;
  }, [count, radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * windSpeed;
    bladeData.forEach((blade, i) => {
      dummy.position.set(blade.x, blade.y, blade.z);
      // Wind sway displacement
      const swayX = Math.sin(time + blade.phase) * 0.15;
      const swayZ = Math.cos(time * 0.8 + blade.phase) * 0.12;
      dummy.rotation.set(swayX, blade.rotY, swayZ);
      dummy.scale.set(blade.scale, blade.scale, blade.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Curved slender blade */}
      <coneGeometry args={[0.04, 0.45, 4]} />
      <meshStandardMaterial
        color="#10B981"
        roughness={0.6}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

// Procedural realistic tree with multi-tiered organic foliage
function RealisticTree({ position = [0, 0, 0], scale = 1, swayOffset = 0, variant = 'lush' }) {
  const branchGroupRef = useRef();

  useFrame((state) => {
    if (branchGroupRef.current) {
      const t = state.clock.elapsedTime * 1.4 + swayOffset;
      branchGroupRef.current.rotation.z = Math.sin(t) * 0.04;
      branchGroupRef.current.rotation.x = Math.cos(t * 0.9) * 0.03;
    }
  });

  const trunkColor = '#5C3818';
  const leafColor1 = variant === 'golden' ? '#F59E0B' : '#059669';
  const leafColor2 = variant === 'golden' ? '#FCD34D' : '#10B981';
  const leafColor3 = variant === 'golden' ? '#D97706' : '#34D399';

  return (
    <group position={position} scale={scale}>
      {/* Tapered Trunk */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.14, 1.3, 10]} />
        <meshStandardMaterial color={trunkColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Multi-tier Wind-swayed Foliage */}
      <group ref={branchGroupRef} position={[0, 1.35, 0]}>
        {/* Tier 1 (Base Canopy) */}
        <mesh position={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.72, 0.9, 8]} />
          <meshStandardMaterial color={leafColor1} roughness={0.55} flatShading />
        </mesh>
        {/* Tier 2 (Mid Canopy) */}
        <mesh position={[0, 0.5, 0]} scale={0.78} castShadow>
          <coneGeometry args={[0.7, 0.85, 8]} />
          <meshStandardMaterial color={leafColor2} roughness={0.55} flatShading />
        </mesh>
        {/* Tier 3 (Top Spire) */}
        <mesh position={[0, 0.95, 0]} scale={0.55} castShadow>
          <coneGeometry args={[0.65, 0.75, 8]} />
          <meshStandardMaterial color={leafColor3} roughness={0.55} flatShading />
        </mesh>
      </group>
    </group>
  );
}

// Undulating PBR Moss Terrain Island
function UndulatedTerrain() {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(2.3, 2.7, 0.7, 32, 4);
    // Deform top vertices to create natural rolling mounds
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0.2) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const hill = Math.sin(x * 1.8) * 0.12 + Math.cos(z * 1.8) * 0.12;
        pos.setY(i, y + hill);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[0, -0.9, 0]}>
      {/* Rolling Moss Ground */}
      <mesh geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial
          color="#064E3B"
          roughness={0.7}
          metalness={0.05}
          flatShading
        />
      </mesh>
      {/* Secondary Soil Base Layer */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.7, 2.9, 0.3, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Forest Scene with dynamic growth stages
function ForestScene({ score = 75, co2Saved = 5, lightingMode = 'day' }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Growth Stage Mapping:
  // Level 1 (Grade D/E): 1 sparse sapling
  // Level 2 (Grade C): 3 young trees
  // Level 3 (Grade B): 5 thriving trees
  // Level 4 (Grade A): 8 dense forest trees + flowers & golden spores
  const growthLevel = score >= 85 ? 4 : score >= 70 ? 3 : score >= 55 ? 2 : 1;
  const growthScale = Math.min(1.35, Math.max(0.65, 0.65 + (score / 100) * 0.7));

  const treeConfigs = useMemo(() => {
    return [
      { pos: [0, -0.55, 0], scale: 1.15 * growthScale, sway: 0, variant: 'lush' },
      { pos: [-1.1, -0.55, 0.6], scale: 0.95 * growthScale, sway: 1.2, variant: 'lush' },
      { pos: [1.2, -0.55, -0.4], scale: 0.9 * growthScale, sway: 2.1, variant: 'lush' },
      { pos: [-0.6, -0.55, -1.0], scale: 0.8 * growthScale, sway: 3.4, variant: 'lush' },
      { pos: [0.9, -0.55, 0.9], scale: 0.85 * growthScale, sway: 4.2, variant: 'golden' },
      { pos: [1.6, -0.55, 0.3], scale: 0.7 * growthScale, sway: 5.1, variant: 'lush' },
      { pos: [-1.6, -0.55, -0.3], scale: 0.75 * growthScale, sway: 0.8, variant: 'lush' },
      { pos: [-0.2, -0.55, 1.4], scale: 0.85 * growthScale, sway: 2.5, variant: 'golden' },
    ];
  }, [growthScale]);

  const treeCount = growthLevel === 4 ? 8 : growthLevel === 3 ? 5 : growthLevel === 2 ? 3 : 1;
  const activeTrees = treeConfigs.slice(0, treeCount);

  return (
    <group ref={groupRef}>
      <UndulatedTerrain />
      <WindGrassCluster count={growthLevel >= 3 ? 90 : 40} />

      {activeTrees.map((tree, idx) => (
        <RealisticTree
          key={idx}
          position={tree.pos}
          scale={tree.scale}
          swayOffset={tree.sway}
          variant={tree.variant}
        />
      ))}

      {/* Spores / Pollen floating particles when Grade A/B */}
      {growthLevel >= 3 && (
        <Sparkles
          count={lightingMode === 'night' ? 60 : 35}
          scale={4.5}
          size={lightingMode === 'night' ? 4 : 2.5}
          speed={0.6}
          color={lightingMode === 'night' ? '#A7F3D0' : lightingMode === 'sunset' ? '#FDE68A' : '#6EE7B7'}
        />
      )}
    </group>
  );
}

export default function EcoForest3D({ score = 75, co2Saved = 5, className = 'h-72 sm:h-80 w-full' }) {
  const { reducedMotion } = useTheme();
  const [webglSupported, setWebglSupported] = useState(true);
  const [lightingMode, setLightingMode] = useState('day'); // 'day' | 'sunset' | 'night'

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch (_e) {
      setWebglSupported(false);
    }
  }, []);

  // Lighting configurations
  const lighting = useMemo(() => {
    switch (lightingMode) {
      case 'sunset':
        return {
          ambient: '#FEF3C7',
          ambientIntensity: 0.9,
          sunColor: '#F59E0B',
          sunIntensity: 2.8,
          sunPos: [6, 3, 5],
          skyBg: 'bg-gradient-to-b from-[#FEF3C7] via-[#FED7AA] to-[#FDE68A] text-[#78350F]'
        };
      case 'night':
        return {
          ambient: '#064E3B',
          ambientIntensity: 0.5,
          sunColor: '#38BDF8',
          sunIntensity: 1.2,
          sunPos: [-5, 6, -3],
          skyBg: 'bg-gradient-to-b from-[#061A14] via-[#0D281E] to-[#12382B] text-emerald-200'
        };
      case 'day':
      default:
        return {
          ambient: '#F0FDF4',
          ambientIntensity: 1.3,
          sunColor: '#FFFBEB',
          sunIntensity: 2.5,
          sunPos: [5, 8, 5],
          skyBg: 'bg-gradient-to-b from-[#E0F2FE] via-[#ECFDF5] to-[#D1FAE5] text-[#0B3B2C]'
        };
    }
  }, [lightingMode]);

  const growthTitle =
    score >= 85
      ? 'Level 4: Thriving Ancient Grove'
      : score >= 70
      ? 'Level 3: Lush Canopy Grove'
      : score >= 55
      ? 'Level 2: Young Sprouting Tree'
      : 'Level 1: Conscious Seedling';

  if (reducedMotion || !webglSupported) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center ${className} bg-emerald-50 rounded-2xl`}>
        <div className="text-6xl mb-2">
          {score >= 85 ? '🌲🌳🌲' : score >= 70 ? '🌳🌲' : '🌱'}
        </div>
        <div className="text-sm font-extrabold text-[#0B3B2C]">
          {growthTitle}
        </div>
        <p className="text-xs text-stone-600 mt-1 font-medium">
          Cart offset: {co2Saved.toFixed(2)} kg CO₂ avoided.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden transition-colors duration-700 ${lighting.skyBg} border border-emerald-400/30 shadow-inner`}>
      {/* Top Controls Strip: Lighting Preset Selector */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-300/80 dark:border-stone-700 shadow-xs">
        <button
          type="button"
          onClick={() => setLightingMode('day')}
          className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            lightingMode === 'day'
              ? 'bg-amber-400 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
          title="Daylight: Morning Mist"
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Day</span>
        </button>

        <button
          type="button"
          onClick={() => setLightingMode('sunset')}
          className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            lightingMode === 'sunset'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
          title="Golden Hour: Sunset Glow"
        >
          <Sunset className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Golden</span>
        </button>

        <button
          type="button"
          onClick={() => setLightingMode('night')}
          className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            lightingMode === 'night'
              ? 'bg-emerald-800 text-emerald-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
          title="Starry Night: Fireflies"
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Night</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2.2, 4.6], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
        className="w-full h-full select-none"
      >
        <ambientLight intensity={lighting.ambientIntensity} color={lighting.ambient} />
        <directionalLight
          position={lighting.sunPos}
          intensity={lighting.sunIntensity}
          color={lighting.sunColor}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, -1, -3]} intensity={0.3} color="#6EE7B7" />

        <Suspense fallback={null}>
          <ForestScene score={score} co2Saved={co2Saved} lightingMode={lightingMode} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
          rotateSpeed={0.6}
        />
      </Canvas>

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 text-[#0B3B2C] dark:text-emerald-300 backdrop-blur-md border border-emerald-400/40 text-[11px] font-extrabold shadow-sm">
          <Trees className="w-3.5 h-3.5 text-emerald-600" />
          <span>{growthTitle}</span>
          <span className="text-[10px] text-stone-500">• Drag to Orbit</span>
        </div>
      </div>
    </div>
  );
}
