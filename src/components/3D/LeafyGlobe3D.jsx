import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, MapPin } from 'lucide-react';

// Eco facts pinned to global coordinates (latitude, longitude)
const REGIONAL_PINS = [
  {
    id: 'india',
    name: 'India & South Asia',
    lat: 21.0,
    lon: 78.9,
    metric: 'Illustrative Example',
    fact: 'Illustrative model: Traditional bamboo, neem, and jute crafts provide zero-plastic alternatives across regional markets.'
  },
  {
    id: 'amazon',
    name: 'Amazon Rainforest',
    lat: -3.5,
    lon: -60.0,
    metric: 'Illustrative Example',
    fact: 'Illustrative model: Sustainable wild-harvested botanical agroforestry protects ancient canopy biodiversity from deforestation.'
  },
  {
    id: 'nordics',
    name: 'Scandinavia',
    lat: 60.5,
    lon: 18.0,
    metric: 'Illustrative Example',
    fact: 'Illustrative model: High-participation deposit-return schemes demonstrate scalable closed-loop packaging reclamation.'
  },
  {
    id: 'kenya',
    name: 'East Africa',
    lat: -0.2,
    lon: 37.8,
    metric: 'Illustrative Example',
    fact: 'Illustrative model: Community-driven natural sisal and banana-fiber weaving cooperatives replace single-use plastic bags.'
  },
  {
    id: 'pacific',
    name: 'Pacific Biosphere',
    lat: 28.0,
    lon: -150.0,
    metric: 'Illustrative Example',
    fact: 'Illustrative model: Substituting non-plastic home staples reduces cumulative synthetic debris leakage into marine biospheres.'
  }
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Photorealistic Textured Earth Globe with Atmosphere & Clouds (Feature 26)
function EarthSphere({ onSelectPin, activePinId, scrollY = 0, cartCo2Saved = 0 }) {
  const globeRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  // Load local PBR textures
  const [dayMap, normalMap, specMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_normal.jpg',
    '/textures/earth/earth_specular.jpg',
    '/textures/earth/earth_clouds.png'
  ]);

  useEffect(() => {
    [dayMap, normalMap, specMap, cloudsMap].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
      }
    });
  }, [dayMap, normalMap, specMap, cloudsMap]);

  // Atmosphere shifts greener as user saves more CO2 in cart (Feature 26)
  const atmosphereColor = useMemo(() => {
    const greenFactor = Math.min(1, cartCo2Saved / 10);
    const color = new THREE.Color('#059669');
    const greenColor = new THREE.Color('#10B981');
    return color.lerp(greenColor, greenFactor);
  }, [cartCo2Saved]);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
      // Scroll-linked tilt response (Feature 26)
      const targetX = (scrollY * 0.0006) % (Math.PI * 0.2);
      globeRef.current.rotation.x = THREE.MathUtils.lerp(globeRef.current.rotation.x, targetX, 0.05);
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.11;
    }
  });

  return (
    <group>
      {/* 1. Main Earth Sphere */}
      <mesh ref={globeRef} scale={2.2}>
        <sphereGeometry args={[1, 48, 48]} />
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
              <mesh>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshBasicMaterial
                  color={isSelected ? '#F59E0B' : '#10B981'}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
              >
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>
          );
        })}
      </mesh>

      {/* 2. Drifting Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef} scale={2.235}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.6}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Fresnel Atmosphere Glow Shield (Greener with cart savings) */}
      <mesh ref={atmosphereRef} scale={2.4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.32}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Orbiting realistic Eco Items using pure clock time (Fixes impure Date.now)
function OrbitingEcoItems() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Reusable Stainless Steel Bottle */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.2}>
        <group position={[2.8, 0.8, 0.5]} scale={0.4} rotation={[0.4, 0.5, 0.8]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.25, 12]} />
            <meshStandardMaterial color="#0B3B2C" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </Float>

      {/* 2. Organic Green Leaf */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.4}>
        <group position={[-2.7, -0.9, 0.8]} scale={0.45} rotation={[-0.5, 0.8, -0.4]}>
          <mesh>
            <coneGeometry args={[0.4, 1.2, 5]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function GlobeShadow() {
  return (
    <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.8, 24]} />
      <meshBasicMaterial color="#0B3B2C" transparent opacity={0.07} />
    </mesh>
  );
}

export default function LeafyGlobe3D({ cartCo2Saved = 0, className = 'w-full h-full' }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibility = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);
  const { reduceEffects } = useTheme();
  const [activePin, setActivePin] = useState(REGIONAL_PINS[0]);
  const [hasWebGL] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });
  const [scrollY, setScrollY] = useState(0);

  // Listen to window scroll (Feature 26)
  useEffect(() => {
    if (reduceEffects) return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduceEffects]);

  if (reduceEffects || !hasWebGL) {
    return (
      <div className="w-full h-80 rounded-3xl bg-surface-sunken flex flex-col items-center justify-center p-6 border border-line text-center shadow-inner">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl shadow-soft-xs mb-3">
          🌍
        </div>
        <h4 className="font-heading font-bold text-heading text-sm">
          Interactive Biosphere (Static Mode)
        </h4>
        <p className="text-xs text-secondary mt-1 max-w-xs font-normal">
          3D graphics paused to save battery & device resources.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center select-none" role="region" aria-label="Interactive 3D Biosphere Globe">
      {/* Soft emerald radial glow behind globe on cream canvas */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.18)_0%,rgba(5,150,105,0.06)_45%,transparent_70%)]" aria-hidden="true" />
      <div className="relative w-full h-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          dpr={[1, 1.5]}
          frameloop={isVisible ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 4, 5]} intensity={2.0} />
          <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#38BDF8" />

          <Suspense fallback={null}>
            <EarthSphere
              onSelectPin={setActivePin}
              activePinId={activePin?.id}
              scrollY={scrollY}
              cartCo2Saved={cartCo2Saved}
            />
            <OrbitingEcoItems />
            <GlobeShadow />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.8}
            rotateSpeed={0.6}
            dampingFactor={0.06}
            enableDamping={true}
          />
        </Canvas>

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-line text-[11px] font-semibold text-heading shadow-soft-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Interactive Earth • Turns Greener With Your Impact</span>
        </div>
      </div>

      {/* Floating Active Pin Tooltip (positioned gracefully near top) */}
      {activePin && (
        <div className="absolute top-12 inset-x-4 p-3 rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-soft-md flex items-start justify-between gap-3 text-left z-20 animate-fade-in pointer-events-auto">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xs text-heading">
                  {activePin.name}
                </span>
                <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {activePin.metric}
                </span>
              </div>
              <p className="text-[11px] text-secondary mt-0.5 leading-relaxed font-normal">
                {activePin.fact}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActivePin(null)}
            className="p-1 rounded-full text-text-muted hover:text-heading cursor-pointer text-xs shrink-0"
            aria-label="Close tooltip"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
