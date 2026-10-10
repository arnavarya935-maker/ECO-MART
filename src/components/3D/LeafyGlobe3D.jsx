import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Globe, MapPin, X, AlertCircle } from 'lucide-react';

// Eco facts pinned to global coordinates (latitude, longitude)
const REGIONAL_PINS = [
  {
    id: 'india',
    name: 'India & South Asia',
    lat: 21.0,
    lon: 78.9,
    metric: '3.4M Tons Diverted',
    fact: 'Indigenous bamboo, neem and jute crafts replace 120M single-use plastic items annually.'
  },
  {
    id: 'amazon',
    name: 'Amazon Rainforest',
    lat: -3.5,
    lon: -60.0,
    metric: '20% Planet Oxygen',
    fact: 'Sustainable wild-harvested rubber and açai agroforestry preserve ancient canopy trees.'
  },
  {
    id: 'nordics',
    name: 'Scandinavia',
    lat: 60.5,
    lon: 18.0,
    metric: '94% Circular Recycling',
    fact: 'Pioneered closed-loop zero-waste deposit systems now adapted by EcoMart fulfilment.'
  },
  {
    id: 'kenya',
    name: 'East Africa',
    lat: -0.2,
    lon: 37.8,
    metric: 'Zero Plastic Bags',
    fact: 'Strictest single-use bans enabled sisal and banana-fiber reusable totes across markets.'
  },
  {
    id: 'pacific',
    name: 'Pacific Biosphere',
    lat: 28.0,
    lon: -150.0,
    metric: 'Ocean Plastic Shield',
    fact: 'Every plastic-free product swapped diverts an average of 145g of ocean-bound waste.'
  }
];

// Helper to convert lat/long to 3D Cartesian coords on a sphere of radius R
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Photorealistic Textured Earth Globe with Atmosphere & Clouds
function EarthSphere({ onSelectPin, activePinId }) {
  const globeRef = useRef();
  const cloudsRef = useRef();

  // Load local PBR textures
  const [dayMap, normalMap, specMap, cloudsMap, nightMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_normal.jpg',
    '/textures/earth/earth_specular.jpg',
    '/textures/earth/earth_clouds.png',
    '/textures/earth/earth_night.png'
  ]);

  // Set texture filtering for maximum fidelity
  useMemo(() => {
    [dayMap, normalMap, specMap, cloudsMap, nightMap].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
      }
    });
  }, [dayMap, normalMap, specMap, cloudsMap, nightMap]);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.11;
    }
  });

  return (
    <group>
      {/* 1. Main Earth Sphere (PBR Day + Normal + Specular) */}
      <mesh ref={globeRef} scale={2.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specMap}
          roughness={0.65}
          metalness={0.1}
        />

        {/* Clickable Regional Eco Pins */}
        {REGIONAL_PINS.map((pin) => {
          const pos = latLonToVector3(pin.lat, pin.lon, 1.02);
          const isSelected = activePinId === pin.id;

          return (
            <group key={pin.id} position={pos}>
              {/* Outer pulse aura */}
              <mesh>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshBasicMaterial
                  color={isSelected ? '#F59E0B' : '#10B981'}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Core glow pin */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
              >
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          );
        })}
      </mesh>

      {/* 2. Drifting Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef} scale={2.235}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.65}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Fresnel Atmosphere Glow Shield */}
      <mesh scale={2.42}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Orbiting realistic Eco Items (Bottle, Leaf, Tote Bag, Bulb)
function OrbitingEcoItems() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Reusable Stainless Steel Bottle */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.2}>
        <group position={[2.9, 0.8, 0.5]} scale={0.4} rotation={[0.4, 0.5, 0.8]}>
          {/* Bottle body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1.2, 24]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Bottle cap */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
            <meshStandardMaterial color="#0B3B2C" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </Float>

      {/* 2. Organic Green Leaf */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.4}>
        <group position={[-2.8, -0.9, 0.8]} scale={0.45} rotation={[-0.5, 0.8, -0.4]}>
          <mesh>
            <coneGeometry args={[0.4, 1.2, 5]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      </Float>

      {/* 3. Reusable Cotton Tote Bag */}
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1}>
        <group position={[1.4, -2.7, -0.6]} scale={0.4} rotation={[0.2, -0.4, 0.6]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.8, 0.25]} />
            <meshStandardMaterial color="#F4EFE3" roughness={0.9} metalness={0.05} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.55, 0]}>
            <torusGeometry args={[0.25, 0.04, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#0B3B2C" roughness={0.8} />
          </mesh>
        </group>
      </Float>

      {/* 4. Energy-Saving LED Bulb */}
      <Float speed={2.2} rotationIntensity={1.6} floatIntensity={1.2}>
        <group position={[-1.7, 2.5, -0.7]} scale={0.35} rotation={[0.6, 0.3, -0.5]}>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.4, 20, 20]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.35, 16]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// Contact Shadow Disc beneath globe to anchor it in light mode
function GlobeShadow() {
  return (
    <mesh position={[0, -2.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.8, 32]} />
      <meshBasicMaterial color="#0B3B2C" transparent opacity={0.08} />
    </mesh>
  );
}

export default function LeafyGlobe3D() {
  const { reducedMotion } = useTheme();
  const [activePin, setActivePin] = useState(REGIONAL_PINS[0]);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (_e) {
      setHasWebGL(false);
    }
  }, []);

  // Fallback if reduced motion is on or WebGL is missing
  if (reducedMotion || !hasWebGL) {
    return (
      <div className="w-full h-80 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-stone-900 dark:to-stone-850 flex flex-col items-center justify-center p-6 border border-emerald-200 dark:border-emerald-800 text-center shadow-inner">
        <div className="w-28 h-28 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-5xl shadow-md mb-3">
          🌍
        </div>
        <h4 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
          Interactive Planetary Biosphere
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xs">
          3D visualizer paused (Reduced Motion active). Tap regional pin data below.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Canvas Box */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-[#F0FDF4] via-[#F7FAF8] to-white dark:from-[#06110D] dark:to-[#0D1F18] border border-emerald-500/20 shadow-inner">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Studio Lights */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 4, 5]} intensity={2.2} />
          <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#38BDF8" />
          <pointLight position={[0, 6, 2]} intensity={0.8} color="#FFFFFF" />

          <Suspense fallback={null}>
            <EarthSphere onSelectPin={setActivePin} activePinId={activePin?.id} />
            <OrbitingEcoItems />
            <GlobeShadow />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            minDistance={4.2}
            maxDistance={8.0}
            enablePan={false}
            rotateSpeed={0.65}
            dampingFactor={0.06}
            enableDamping={true}
          />
        </Canvas>

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-emerald-400/30 text-[11px] font-bold text-[#0B3B2C] dark:text-emerald-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Photorealistic NASA Blue Marble • Drag to Rotate</span>
        </div>
      </div>

      {/* Pinned Regional Eco-Fact Card (Responsive, Never Overlapping) */}
      {activePin && (
        <div className="w-full mt-3 p-4 rounded-2xl bg-white dark:bg-[#0D1F18] border border-emerald-200/90 dark:border-emerald-800/80 shadow-md flex items-start justify-between gap-3 animate-slide-up text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#0B3B2C] dark:text-stone-100">
                  {activePin.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  {activePin.metric}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed font-medium">
                {activePin.fact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
