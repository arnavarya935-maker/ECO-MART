import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import Safe3D from './Safe3D';
import { RotateCw, Box, Eye, Sparkles } from 'lucide-react';

// Procedural 3D Mesh representing product geometry
function ProductMesh({ category, material, wireframe, autoRotate }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const cat = (category || '').toLowerCase();
  const mat = (material || '').toLowerCase();

  // Pick color and material properties based on eco attributes
  let color = '#2e7d32'; // Default forest emerald
  let metalness = 0.1;
  let roughness = 0.5;

  if (mat.includes('copper') || mat.includes('metal')) {
    color = '#d97706'; // Warm copper amber
    metalness = 0.85;
    roughness = 0.25;
  } else if (mat.includes('bamboo') || mat.includes('wood') || mat.includes('neem')) {
    color = '#c2a649'; // Warm bamboo wood
    metalness = 0.05;
    roughness = 0.8;
  } else if (mat.includes('cotton') || mat.includes('canvas') || mat.includes('jute')) {
    color = '#e2d9cc'; // Natural off-white unbleached cotton
    metalness = 0.0;
    roughness = 0.95;
  } else if (mat.includes('terracotta') || mat.includes('clay')) {
    color = '#b45309'; // Terracotta clay
    metalness = 0.05;
    roughness = 0.9;
  } else if (mat.includes('glass')) {
    color = '#86efac';
    metalness = 0.3;
    roughness = 0.1;
  }

  // Choose geometry shape according to product type
  if (cat.includes('kitchen') || cat.includes('outdoor')) {
    // Bottle or tumbler cylinder geometry with cap
    return (
      <group ref={meshRef} position={[0, -0.2, 0]}>
        {/* Main Bottle Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.75, 2.2, 32]} />
          <meshStandardMaterial
            color={color}
            wireframe={wireframe}
            metalness={metalness}
            roughness={roughness}
          />
        </mesh>
        {/* Bottle Neck */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.35, 0.65, 0.35, 32]} />
          <meshStandardMaterial color={color} wireframe={wireframe} metalness={metalness} roughness={roughness} />
        </mesh>
        {/* Bamboo / Steel Cap */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.3, 32]} />
          <meshStandardMaterial color="#854d0e" wireframe={wireframe} metalness={0.2} roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (cat.includes('bag') || cat.includes('fashion')) {
    // Curved reusable tote bag representation
    return (
      <group ref={meshRef} position={[0, -0.1, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.8, 0.6]} />
          <meshStandardMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />
        </mesh>
        {/* Handles */}
        <mesh position={[0, 1.1, 0]}>
          <torusGeometry args={[0.45, 0.06, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#78716c" wireframe={wireframe} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (cat.includes('stationery') || cat.includes('home')) {
    // Journal / Package box geometry
    return (
      <group ref={meshRef} position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 2.1, 0.4]} />
          <meshStandardMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />
        </mesh>
      </group>
    );
  }

  // Default: Bar / Container rounded geometry
  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 1.2, 32]} />
        <meshStandardMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />
      </mesh>
    </group>
  );
}

export default function Product3DViewer({ product }) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  if (!product) return null;

  const productImage = product.image || (Array.isArray(product.images) && product.images[0]) || `/images/products/${product.id}.jpg`;

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden bg-surface-sunken border border-line shadow-inner">
      {/* 3D Scene Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-line text-[11px] font-semibold text-heading shadow-soft-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Interactive 3D Inspector</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border transition cursor-pointer flex items-center gap-1 min-h-[36px] ${
              autoRotate
                ? 'bg-primary text-primary-contrast border-primary'
                : 'bg-surface/85 text-secondary border-line hover:text-heading'
            }`}
            title="Toggle 360° Auto Rotation"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Spin</span>
          </button>

          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border transition cursor-pointer flex items-center gap-1 min-h-[36px] ${
              wireframe
                ? 'bg-primary text-primary-contrast border-primary'
                : 'bg-surface/85 text-secondary border-line hover:text-heading'
            }`}
            title="Toggle Wireframe Mesh Inspection"
          >
            <Box className="w-3 h-3" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>
        </div>
      </div>

      {/* Safe3D Wrapper with fallback image and progress bar */}
      <Safe3D
        autoLoad={true}
        fallbackTitle={product.name}
        fallbackSubtitle="Interactive 3D inspection paused under Reduce Effects or when WebGL is unavailable. Showing photo fallback."
        fallbackImage={productImage}
        loadingMessage="Loading 3D Product Mesh & Eco Materials..."
        className="h-full w-full"
      >
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-4, -3, -2]} intensity={0.4} color="#6ee7b7" />
          <pointLight position={[0, 4, 2]} intensity={0.6} />

          <Float speed={autoRotate ? 1.5 : 0} rotationIntensity={0.2} floatIntensity={0.3}>
            <ProductMesh
              category={product.category}
              material={product.material}
              wireframe={wireframe}
              autoRotate={autoRotate}
            />
          </Float>

          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </Safe3D>

      {/* Drag Hint Footer */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface/90 text-heading backdrop-blur-md text-[10px] font-medium border border-line flex items-center gap-1 pointer-events-none shadow-soft-xs">
        <Eye className="w-3 h-3 text-primary" /> Drag to spin 360° • Scroll to zoom
      </div>
    </div>
  );
}
