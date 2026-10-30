import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * Cinematic3DWorld
 * Tier 3 Live 3D Eco World behind Eco Sense
 *
 * Requirements (Three 0.186):
 * - Procedural dusk valley: rolling hills, glowing river, dark forest sky, green-gold sun/planet, light fog.
 * - Life: instanced trees, firefly particle points, distant wind turbines.
 * - Chapter props:
 *   - 01 Discover: stone pedestals with toothbrush, steel bottle, cloth tote.
 *   - 02 Swap: plastic bottle sinking while stainless steel bottle rises.
 *   - 03 Decide: glowing Eco Agent orb with orbiting green particles.
 *   - 04 Impact: regenerated forest trees scaling up.
 * - Camera: waypoints per chapter with smooth damping and fine pointer parallax.
 * - Technical:
 *   - SRGBColorSpace, physically based lighting units.
 *   - Shadows OFF, pixel ratio cap 1.5.
 *   - Adaptive quality governor: lowers resolution if frame > 25ms; switches off to Tier 2 if persistent.
 *   - Complete disposal of all geometries, materials, and renderer on unmount.
 *   - Pause rendering when tab is hidden or offscreen.
 */
export default function Cinematic3DWorld({ fallback = null }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { reduceEffects, judgeMode, highContrast } = useTheme();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Immediate fallback if accessibility or judge mode requests minimal effects
    if (
      !isFeatureEnabled('cinematicScene') ||
      reduceEffects ||
      judgeMode ||
      highContrast
    ) {
      setFailed(true);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability
    let gl = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setFailed(true);
        return;
      }
    } catch {
      setFailed(true);
      return;
    }

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05100B');
    scene.fog = new THREE.FogExp2('#05100B', 0.02);

    let width = window.innerWidth || 1280;
    let height = window.innerHeight || 720;
    let isPortrait = height > width;

    const camera = new THREE.PerspectiveCamera(
      isPortrait ? 58 : 46,
      width / height,
      0.1,
      140
    );

    let initialPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let currentPixelRatio = initialPixelRatio;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setSize(width, height);
      renderer.setPixelRatio(currentPixelRatio);
      renderer.shadowMap.enabled = false;
    } catch {
      setFailed(true);
      return;
    }

    // WebGL Context Lost Guard
    const onContextLost = (e) => {
      e.preventDefault();
      console.warn('[Cinematic3D] WebGL context lost. Falling back to Tier 2 background.');
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);

    // Track disposables for teardown
    const disposables = [];
    const track = (obj) => {
      disposables.push(obj);
      return obj;
    };

    // 2. Lighting (Physically Tuned)
    const ambientLight = track(new THREE.AmbientLight('#0B3B2C', 1.2));
    scene.add(ambientLight);

    const horizonLight = track(new THREE.DirectionalLight('#10B981', 1.8));
    horizonLight.position.set(0, 18, -50);
    scene.add(horizonLight);

    const warmSunsetLight = track(new THREE.DirectionalLight('#F59E0B', 0.8));
    warmSunsetLight.position.set(20, 12, -40);
    scene.add(warmSunsetLight);

    // 3. Ground & Hills (Procedural Valley with Central River Bed)
    const planeGeo = track(new THREE.PlaneGeometry(120, 160, 48, 64));
    planeGeo.rotateX(-Math.PI / 2);

    const posAttr = planeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Central river indentation
      const riverDist = Math.abs(x);
      let y = 0;
      if (riverDist < 5) {
        y = -0.6 + Math.sin(z * 0.1) * 0.15;
      } else {
        // Rolling organic valley ridges
        const ridge = (riverDist - 5) * 0.35;
        const rolling =
          Math.sin(x * 0.07) * Math.cos(z * 0.05) * 3.5 +
          Math.sin(x * 0.12 + z * 0.08) * 1.5;
        y = Math.max(0, ridge + rolling);
      }
      posAttr.setY(i, y);
    }
    planeGeo.computeVertexNormals();

    const groundMat = track(
      new THREE.MeshStandardMaterial({
        color: '#07160F',
        roughness: 0.92,
        metalness: 0.08,
        flatShading: true
      })
    );
    const groundMesh = new THREE.Mesh(planeGeo, groundMat);
    scene.add(groundMesh);

    // Glowing River
    const riverGeo = track(new THREE.PlaneGeometry(7.5, 150, 12, 40));
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = track(
      new THREE.MeshStandardMaterial({
        color: '#047857',
        emissive: '#064E3B',
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.75,
        transparent: true,
        opacity: 0.85
      })
    );
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -0.4, -10);
    scene.add(riverMesh);

    // 4. Dusk Sun / Radiant Green-Gold Planet Behind Hills
    const sunGeo = track(new THREE.SphereGeometry(9, 24, 24));
    const sunMat = track(
      new THREE.MeshBasicMaterial({
        color: '#10B981',
        transparent: true,
        opacity: 0.75
      })
    );
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 7, -72);
    scene.add(sunMesh);

    // Warm Sun Aura
    const auraGeo = track(new THREE.RingGeometry(9.2, 13, 24));
    const auraMat = track(
      new THREE.MeshBasicMaterial({
        color: '#F59E0B',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
      })
    );
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.set(0, 7, -71.8);
    scene.add(auraMesh);

    // 5. Instanced Forest Trees Along Valley Slopes
    const trunkGeo = track(new THREE.CylinderGeometry(0.18, 0.28, 1.2, 5));
    const foliageGeo = track(new THREE.ConeGeometry(1.1, 2.2, 5));
    foliageGeo.translate(0, 1.5, 0);

    const treeMat = track(
      new THREE.MeshStandardMaterial({
        color: '#0A261A',
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true
      })
    );

    const trunkMat = track(
      new THREE.MeshStandardMaterial({
        color: '#1A1812',
        roughness: 0.95
      })
    );

    const treeCount = 90;
    const treeGroup = new THREE.Group();
    for (let i = 0; i < treeCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (7.5 + (i * 1.3) % 45);
      const z = -65 + (i * 1.6) % 95;
      const scale = 0.75 + ((i * 17) % 10) * 0.06;

      const singleTree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      const fol = new THREE.Mesh(foliageGeo, treeMat);
      singleTree.add(trunk);
      singleTree.add(fol);
      singleTree.position.set(x, 0.5, z);
      singleTree.scale.set(scale, scale, scale);
      treeGroup.add(singleTree);
    }
    scene.add(treeGroup);

    // Regenerating Impact Forest (Grows as scroll enters Chapter 04)
    const impactTreeGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (6 + (i * 2) % 30);
      const z = -45 - (i * 2) % 30;
      const singleTree = new THREE.Group();
      singleTree.add(new THREE.Mesh(trunkGeo, trunkMat));
      singleTree.add(new THREE.Mesh(foliageGeo, treeMat));
      singleTree.position.set(x, 0.5, z);
      singleTree.scale.set(0.001, 0.001, 0.001); // starts at 0
      impactTreeGroup.add(singleTree);
    }
    scene.add(impactTreeGroup);

    // 6. Distant Wind Turbine Silhouettes
    const turbineGroup = new THREE.Group();
    const turbineBlades = [];
    const turbineTowerGeo = track(new THREE.CylinderGeometry(0.12, 0.35, 12, 5));
    const turbineBladeGeo = track(new THREE.BoxGeometry(0.08, 4.2, 0.2));
    turbineBladeGeo.translate(0, 2.1, 0);
    const turbineMat = track(
      new THREE.MeshBasicMaterial({ color: '#061911' })
    );

    const turbinePositions = [
      [-32, 7, -55],
      [26, 8, -62],
      [-18, 9, -48]
    ];

    turbinePositions.forEach(([tx, ty, tz]) => {
      const turb = new THREE.Group();
      const tower = new THREE.Mesh(turbineTowerGeo, turbineMat);
      turb.add(tower);

      const hub = new THREE.Group();
      hub.position.set(0, 6, 0.3);

      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(turbineBladeGeo, turbineMat);
        blade.rotation.z = (b * Math.PI * 2) / 3;
        hub.add(blade);
      }
      turb.add(hub);
      turbineBlades.push(hub);

      turb.position.set(tx, ty, tz);
      turbineGroup.add(turb);
    });
    scene.add(turbineGroup);

    // 7. Fireflies & Ambient Mist Particles
    const fireflyCount = 65;
    const fireflyGeo = track(new THREE.BufferGeometry());
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3] = (Math.random() - 0.5) * 35;
      fireflyPositions[i * 3 + 1] = 0.5 + Math.random() * 5.5;
      fireflyPositions[i * 3 + 2] = 10 - Math.random() * 75;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));

    const fireflyMat = track(
      new THREE.PointsMaterial({
        color: '#34D399',
        size: 0.35,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      })
    );
    const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflyPoints);

    // 8. Chapter Props (Procedural Clean Geometry)
    const pedestalGeo = track(new THREE.CylinderGeometry(1.0, 1.2, 0.8, 8));
    const pedestalMat = track(
      new THREE.MeshStandardMaterial({ color: '#10261D', roughness: 0.9 })
    );

    // --- Chapter 01 Discover Props: 3 Pedestals with Toothbrush, Bottle, Tote ---
    const ch1Group = new THREE.Group();
    ch1Group.position.set(-2, 0.4, 2);

    // Pedestal 1: Bamboo Toothbrush
    const p1 = new THREE.Mesh(pedestalGeo, pedestalMat);
    p1.position.set(-2.5, 0, 0);
    const brushHandleGeo = track(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 6));
    brushHandleGeo.rotateZ(Math.PI / 4);
    const brushHandleMat = track(new THREE.MeshStandardMaterial({ color: '#C8A366', roughness: 0.8 }));
    const brushMesh = new THREE.Mesh(brushHandleGeo, brushHandleMat);
    brushMesh.position.set(0, 0.7, 0);
    p1.add(brushMesh);
    ch1Group.add(p1);

    // Pedestal 2: Stainless Steel Bottle
    const p2 = new THREE.Mesh(pedestalGeo, pedestalMat);
    p2.position.set(0, 0, 0);
    const bottleGeo = track(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 12));
    const bottleMat = track(new THREE.MeshStandardMaterial({ color: '#94A3B8', roughness: 0.25, metalness: 0.85 }));
    const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
    bottleMesh.position.set(0, 0.8, 0);
    p2.add(bottleMesh);
    ch1Group.add(p2);

    // Pedestal 3: Cloth Tote Form
    const p3 = new THREE.Mesh(pedestalGeo, pedestalMat);
    p3.position.set(2.5, 0, 0);
    const toteGeo = track(new THREE.BoxGeometry(0.6, 0.75, 0.25));
    const toteMat = track(new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.9 }));
    const toteMesh = new THREE.Mesh(toteGeo, toteMat);
    toteMesh.position.set(0, 0.8, 0);
    p3.add(toteMesh);
    ch1Group.add(p3);

    scene.add(ch1Group);

    // --- Chapter 02 Swap Props: Facing Pedestals (Plastic Bottle vs Steel Bottle) ---
    const ch2Group = new THREE.Group();
    ch2Group.position.set(3, 1.2, -18);

    const plasticPedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    plasticPedestal.position.set(-2, 0, 0);
    const plasticBottleGeo = track(new THREE.CylinderGeometry(0.22, 0.22, 0.85, 8));
    const plasticBottleMat = track(
      new THREE.MeshStandardMaterial({
        color: '#93C5FD',
        transparent: true,
        opacity: 0.65,
        roughness: 0.4
      })
    );
    const plasticBottleMesh = new THREE.Mesh(plasticBottleGeo, plasticBottleMat);
    plasticBottleMesh.position.set(0, 0.75, 0);
    plasticPedestal.add(plasticBottleMesh);
    ch2Group.add(plasticPedestal);

    const steelPedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    steelPedestal.position.set(2, 0, 0);
    const swapSteelBottleGeo = track(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 12));
    const swapSteelBottleMat = track(
      new THREE.MeshStandardMaterial({
        color: '#10B981',
        roughness: 0.2,
        metalness: 0.9
      })
    );
    const swapSteelBottleMesh = new THREE.Mesh(swapSteelBottleGeo, swapSteelBottleMat);
    swapSteelBottleMesh.position.set(0, 0.75, 0);
    steelPedestal.add(swapSteelBottleMesh);
    ch2Group.add(steelPedestal);

    scene.add(ch2Group);

    // --- Chapter 03 Decide Prop: Eco Agent Glowing Orb Above River ---
    const orbGroup = new THREE.Group();
    orbGroup.position.set(0, 4.2, -35);

    const orbCoreGeo = track(new THREE.SphereGeometry(1.4, 20, 20));
    const orbCoreMat = track(
      new THREE.MeshStandardMaterial({
        color: '#10B981',
        emissive: '#10B981',
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.5
      })
    );
    const orbMesh = new THREE.Mesh(orbCoreGeo, orbCoreMat);
    orbGroup.add(orbMesh);

    // Orb slow orbiting particles
    const orbOrbitParticles = [];
    const orbParticleGeo = track(new THREE.SphereGeometry(0.12, 8, 8));
    const orbParticleMat = track(new THREE.MeshBasicMaterial({ color: '#A7F3D0' }));
    for (let p = 0; p < 16; p++) {
      const pm = new THREE.Mesh(orbParticleGeo, orbParticleMat);
      orbGroup.add(pm);
      orbOrbitParticles.push({
        mesh: pm,
        radius: 2.2 + (p % 3) * 0.5,
        speed: 0.8 + (p % 4) * 0.25,
        offset: (p * Math.PI) / 8,
        inclination: ((p % 3) - 1) * 0.4
      });
    }
    scene.add(orbGroup);

    // 9. Camera Waypoints Interpolation Across Scroll
    const WAYPOINTS = [
      { t: 0.0, pos: [0, 5.5, 18], look: [0, 3.2, -15] },       // Chapter 00: Overview
      { t: 0.25, pos: [-2.5, 3.8, 8], look: [-1.8, 1.8, -5] },    // Chapter 01: Discover Pedestals
      { t: 0.50, pos: [3.2, 3.2, -11], look: [2.5, 2.0, -22] },   // Chapter 02: Swap Face-off
      { t: 0.72, pos: [0, 5.0, -26], look: [0, 4.5, -42] },      // Chapter 03: Eco Agent Orb
      { t: 1.0, pos: [0, 8.5, -34], look: [0, 4.0, -65] }        // Chapter 04: Regrown Valley
    ];

    let targetCamPos = new THREE.Vector3(0, 5.5, 18);
    let targetCamLook = new THREE.Vector3(0, 3.2, -15);
    let currentLook = new THREE.Vector3(0, 3.2, -15);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      if (!isFinePointer) return;
      targetMouseX = (e.clientX / (window.innerWidth || 1) - 0.5) * 2;
      targetMouseY = (e.clientY / (window.innerHeight || 1) - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Adaptive Quality Governor (Frame Delta tracking)
    let slowFramesCount = 0;
    let governorDowngraded = false;
    let lastFrameTime = performance.now();
    let isTabVisible = true;
    let rafId = null;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastFrameTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onResize = () => {
      width = window.innerWidth || 1280;
      height = window.innerHeight || 720;
      isPortrait = height > width;

      camera.aspect = width / height;
      camera.fov = isPortrait ? 58 : 46;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 10. Main Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const now = performance.now();
      const deltaMs = now - lastFrameTime;
      lastFrameTime = now;

      // Quality governor: monitor if frame > 25ms (under ~40fps)
      if (deltaMs > 25) {
        slowFramesCount++;
        // If slow for ~2 seconds (e.g. 50 slow frames)
        if (slowFramesCount > 50) {
          if (!governorDowngraded) {
            // Step 1: Lower resolution
            governorDowngraded = true;
            currentPixelRatio = 0.85;
            renderer.setPixelRatio(currentPixelRatio);
            slowFramesCount = 0;
          } else {
            // Step 2: Persistent sluggishness -> switch off and show Tier 2
            console.warn('[Cinematic3D] Quality governor: switching off 3D world to preserve performance.');
            setFailed(true);
            return;
          }
        }
      } else if (slowFramesCount > 0) {
        slowFramesCount--;
      }

      const elapsedTime = clock.getElapsedTime();

      // Rotate Wind Turbines
      turbineBlades.forEach((tb) => {
        tb.rotation.z -= 0.025;
      });

      // Float Fireflies
      const posArr = fireflyGeo.attributes.position.array;
      for (let i = 0; i < fireflyCount; i++) {
        posArr[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.005;
      }
      fireflyGeo.attributes.position.needsUpdate = true;

      // Pulse Eco Agent Orb & Orbiting Particles
      orbMesh.rotation.y += 0.015;
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
      orbMesh.scale.set(pulse, pulse, pulse);

      orbOrbitParticles.forEach((op) => {
        const angle = elapsedTime * op.speed + op.offset;
        op.mesh.position.set(
          Math.cos(angle) * op.radius,
          Math.sin(angle * 1.5) * op.inclination,
          Math.sin(angle) * op.radius
        );
      });

      // Compute Scroll Position [0, 1]
      const scrollY = window.scrollY || 0;
      const maxScroll = Math.max(1, (document.documentElement.scrollHeight || 2000) - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Calculate Waypoint Interpolation
      let p0 = WAYPOINTS[0];
      let p1 = WAYPOINTS[1];
      for (let w = 0; w < WAYPOINTS.length - 1; w++) {
        if (scrollProgress >= WAYPOINTS[w].t && scrollProgress <= WAYPOINTS[w + 1].t) {
          p0 = WAYPOINTS[w];
          p1 = WAYPOINTS[w + 1];
          break;
        }
      }
      const segmentT = (scrollProgress - p0.t) / (p1.t - p0.t || 1);

      targetCamPos.set(
        p0.pos[0] + (p1.pos[0] - p0.pos[0]) * segmentT,
        p0.pos[1] + (p1.pos[1] - p0.pos[1]) * segmentT,
        p0.pos[2] + (p1.pos[2] - p0.pos[2]) * segmentT
      );

      targetCamLook.set(
        p0.look[0] + (p1.look[0] - p0.look[0]) * segmentT,
        p0.look[1] + (p1.look[1] - p0.look[1]) * segmentT,
        p0.look[2] + (p1.look[2] - p0.look[2]) * segmentT
      );

      // Chapter 02 Swap Bottle Animation: Plastic sinks, Steel rises
      if (scrollProgress > 0.35 && scrollProgress < 0.65) {
        const swapFactor = (scrollProgress - 0.35) / 0.3;
        plasticBottleMesh.scale.set(1, Math.max(0.01, 1 - swapFactor), 1);
        plasticBottleMesh.position.y = 0.75 - swapFactor * 0.4;
        plasticBottleMat.opacity = Math.max(0.1, 0.65 * (1 - swapFactor));

        swapSteelBottleMesh.scale.set(1, Math.min(1, 0.2 + swapFactor * 0.8), 1);
        swapSteelBottleMesh.position.y = 0.35 + swapFactor * 0.4;
      }

      // Chapter 04 Impact Forest Growth
      if (scrollProgress > 0.65) {
        const growT = Math.min(1, (scrollProgress - 0.65) / 0.35);
        impactTreeGroup.children.forEach((tr, idx) => {
          const s = Math.min(1, growT * (0.8 + ((idx * 3) % 4) * 0.1));
          tr.scale.set(s, s, s);
        });
      }

      // Mouse Parallax Damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Adjust camera for mobile step back
      const stepBack = isPortrait ? 3.5 : 0;

      // Smooth Camera Damping
      camera.position.x += (targetCamPos.x + mouseX * 1.5 - camera.position.x) * 0.06;
      camera.position.y += (targetCamPos.y - mouseY * 0.8 - camera.position.y) * 0.06;
      camera.position.z += (targetCamPos.z + stepBack - camera.position.z) * 0.06;

      currentLook.x += (targetCamLook.x - currentLook.x) * 0.06;
      currentLook.y += (targetCamLook.y - currentLook.y) * 0.06;
      currentLook.z += (targetCamLook.z - currentLook.z) * 0.06;
      camera.lookAt(currentLook);

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup & Disposal
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      // Dispose scene objects
      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') d.dispose();
      });

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [reduceEffects, judgeMode, highContrast]);

  if (failed) {
    return fallback;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
