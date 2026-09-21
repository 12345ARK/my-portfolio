import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, Box } from 'lucide-react';
import { useAnimation3D } from '../context/Animation3DContext';

export const FullScreenBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { is3DEnabled, toggle3D, bgMode, setBgMode } = useAnimation3D();

  const [showControls, setShowControls] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Background layers
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const polyGroupRef = useRef<THREE.Group | null>(null);
  const polyhedraListRef = useRef<{ mesh: THREE.Mesh; rotSpeed: THREE.Vector3 }[]>([]);
  const shockwaveGroupRef = useRef<THREE.Group | null>(null);

  // Animation & Interaction tracking
  const animFrameRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Mouse & Scroll coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });

  // Global click to spawn expanding shockwave ring
  const handleGlobalClick = useCallback((e: MouseEvent) => {
    if (!sceneRef.current || !cameraRef.current || !shockwaveGroupRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) {
      return;
    }

    const mouseNdc = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(mouseNdc.x * 20, mouseNdc.y * 12, -5);
    ring.userData = { age: 0, maxAge: 1.2 };
    shockwaveGroupRef.current.add(ring);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x08080b, 0.016);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);
    cameraRef.current = camera;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 3. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff2a2a, 2, 50);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // 4. SHOCKWAVE GROUP
    const shockwaveGroup = new THREE.Group();
    shockwaveGroupRef.current = shockwaveGroup;
    scene.add(shockwaveGroup);

    // 5. STARFIELD LAYER (DEEP COSMOS)
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 140;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 140;
      starPositions[i3 + 2] = -10 + (Math.random() - 0.5) * 70;

      const isRed = Math.random() < 0.15;
      const isCyan = Math.random() < 0.1;
      if (isRed) {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 0.2;
        starColors[i3 + 2] = 0.2;
      } else if (isCyan) {
        starColors[i3] = 0.2;
        starColors[i3 + 1] = 0.8;
        starColors[i3 + 2] = 1.0;
      } else {
        starColors[i3] = 0.9;
        starColors[i3 + 1] = 0.9;
        starColors[i3 + 2] = 0.95;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const starfield = new THREE.Points(starGeo, starMat);
    starfieldRef.current = starfield;
    scene.add(starfield);

    // 6. CYBER GRID TERRAIN (CYBER-GRID MODE)
    const gridCols = 50;
    const gridRows = 50;
    const terrainGeo = new THREE.PlaneGeometry(80, 80, gridCols, gridRows);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttribute = terrainGeo.attributes.position;
    const initialY = new Float32Array(posAttribute.count);
    for (let i = 0; i < posAttribute.count; i++) {
      initialY[i] = posAttribute.getY(i);
    }
    terrainGeo.userData = { initialY };

    const terrainMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -9, -10);
    terrainMeshRef.current = terrainMesh;
    scene.add(terrainMesh);

    // 7. FLOATING 3D POLYHEDRA (GEOMETRIC MODE)
    const polyGroup = new THREE.Group();
    polyGroupRef.current = polyGroup;
    scene.add(polyGroup);

    polyhedraListRef.current = [];
    const polyGeometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.TetrahedronGeometry(1.4, 0),
      new THREE.DodecahedronGeometry(1.1, 0),
    ];

    const polyColors = [0xff2a2a, 0xff5252, 0xff7b7b, 0x06b6d4, 0xa855f7];

    for (let i = 0; i < 15; i++) {
      const g = polyGeometries[i % polyGeometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: polyColors[i % polyColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });

      const polyMesh = new THREE.Mesh(g, mat);
      polyMesh.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 35,
        -15 + (Math.random() - 0.5) * 30
      );
      polyMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.01
      );

      polyGroup.add(polyMesh);
      polyhedraListRef.current.push({ mesh: polyMesh, rotSpeed });
    }

    // Set initial visibility
    terrainMesh.visible = bgMode === 'cyber-grid';
    starfield.visible = bgMode === 'cyber-grid' || bgMode === 'deep-cosmos';
    polyGroup.visible = bgMode === 'cyber-grid' || bgMode === 'geometric';

    // 8. EVENT LISTENERS
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollRef.current.target = window.scrollY / maxScroll;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleGlobalClick);

    // 9. ANIMATION LOOP
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!is3DEnabled) return;

      const delta = clockRef.current.getDelta();
      const clock = clockRef.current.getElapsedTime();

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Smooth scroll easing
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.05;

      // Parallax camera gentle drift
      camera.position.x = mouseRef.current.x * 2.2;
      camera.position.y = mouseRef.current.y * 1.5 - scrollRef.current.current * 4;
      camera.lookAt(0, -scrollRef.current.current * 2, -10);

      // Starfield gentle rotation
      if (starfieldRef.current && starfieldRef.current.visible) {
        starfieldRef.current.rotation.y = clock * 0.02 + mouseRef.current.x * 0.1;
        starfieldRef.current.rotation.x = clock * 0.01 + mouseRef.current.y * 0.1;
      }

      // Cyber grid terrain wave animation
      if (terrainMeshRef.current && terrainMeshRef.current.visible) {
        const geo = terrainMeshRef.current.geometry;
        const pos = geo.attributes.position;
        const initialY = geo.userData.initialY as Float32Array;

        for (let i = 0; i < pos.count; i++) {
          const u = (i % 51) / 50;
          const v = Math.floor(i / 51) / 50;
          const wave1 = Math.sin(u * 8 + clock * 1.5) * 1.6;
          const wave2 = Math.cos(v * 7 + clock * 1.2) * 1.4;
          pos.setY(i, initialY[i] + wave1 + wave2);
        }
        pos.needsUpdate = true;
      }

      // Floating polyhedra rotation
      if (polyGroupRef.current && polyGroupRef.current.visible) {
        polyhedraListRef.current.forEach(({ mesh, rotSpeed }, idx) => {
          mesh.rotation.x += rotSpeed.x;
          mesh.rotation.y += rotSpeed.y;
          mesh.rotation.z += rotSpeed.z;
          mesh.position.y += Math.sin(clock * 0.8 + idx) * 0.008;
        });
      }

      // Shockwave rings expansion
      if (shockwaveGroupRef.current) {
        const ringsToRemove: THREE.Object3D[] = [];
        shockwaveGroupRef.current.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          mesh.userData.age += delta;
          const progress = mesh.userData.age / mesh.userData.maxAge;

          if (progress >= 1) {
            ringsToRemove.push(mesh);
          } else {
            const scale = 1 + progress * 6.5;
            mesh.scale.set(scale, scale, scale);
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = (1 - progress) * 0.8;
          }
        });

        ringsToRemove.forEach((r) => {
          shockwaveGroupRef.current?.remove(r);
          (r as THREE.Mesh).geometry.dispose();
          ((r as THREE.Mesh).material as THREE.Material).dispose();
        });
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        clockRef.current.start();
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (rendererRef.current && rendererRef.current.domElement && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [is3DEnabled, handleGlobalClick]);

  // Handle Mode Visibility Changes
  useEffect(() => {
    if (terrainMeshRef.current) {
      terrainMeshRef.current.visible = bgMode === 'cyber-grid';
    }
    if (starfieldRef.current) {
      starfieldRef.current.visible = bgMode === 'cyber-grid' || bgMode === 'deep-cosmos';
    }
    if (polyGroupRef.current) {
      polyGroupRef.current.visible = bgMode === 'cyber-grid' || bgMode === 'geometric';
    }
  }, [bgMode]);

  return (
    <>
      {/* Full-Screen 3D WebGL Canvas Layer (Fixed behind all content) */}
      <div
        ref={mountRef}
        id="fullscreen-3d-background"
        className="fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 select-none pointer-events-none"
        style={{ opacity: is3DEnabled ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Floating 3D Control Pill at Bottom-Left */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 select-none">
        {/* Main 3D FX Toggle Button */}
        <button
          type="button"
          id="toggle-3d-bg-controls"
          onClick={() => setShowControls(!showControls)}
          className="px-3 py-1.5 rounded-full bg-[#0c0c12]/90 hover:bg-zinc-900 border border-zinc-800/90 text-zinc-300 hover:text-white backdrop-blur-md shadow-xl text-xs font-mono flex items-center gap-1.5 transition-all group hover:border-[#ff2a2a]/50"
          title="Configure 3D Background Animations"
        >
          <Box className={`w-3.5 h-3.5 ${is3DEnabled ? 'text-[#ff2a2a]' : 'text-zinc-500'} group-hover:rotate-45 transition-transform duration-300`} />
          <span className="font-semibold">{is3DEnabled ? '3D: ON' : '3D: OFF'}</span>
          <span className={`w-2 h-2 rounded-full ${is3DEnabled ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-zinc-600'}`} />
        </button>

        {/* Expandable Mini Controls Panel */}
        {showControls && (
          <div className="flex items-center gap-1.5 bg-[#0c0c12]/95 backdrop-blur-lg px-2.5 py-1 rounded-full border border-zinc-800 shadow-2xl animate-in fade-in duration-200">
            {/* Quick Toggle Enable/Disable Button */}
            <button
              type="button"
              id="quick-toggle-3d-btn"
              onClick={toggle3D}
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold transition-colors flex items-center gap-1 ${
                is3DEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={is3DEnabled ? 'Disable All 3D Animations' : 'Enable All 3D Animations'}
            >
              {is3DEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{is3DEnabled ? 'Active' : 'Off'}</span>
            </button>

            {is3DEnabled && (
              <>
                <span className="w-px h-3.5 bg-zinc-800" />

                {/* Mode: Cyber Grid */}
                <button
                  type="button"
                  id="mode-cyber-grid-btn"
                  onClick={() => setBgMode('cyber-grid')}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                    bgMode === 'cyber-grid'
                      ? 'bg-[#ff2a2a] text-white font-bold shadow-sm shadow-[#ff2a2a]/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>

                {/* Mode: Deep Cosmos */}
                <button
                  type="button"
                  id="mode-deep-cosmos-btn"
                  onClick={() => setBgMode('deep-cosmos')}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                    bgMode === 'deep-cosmos'
                      ? 'bg-[#ff2a2a] text-white font-bold shadow-sm shadow-[#ff2a2a]/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Cosmos
                </button>

                {/* Mode: Geometric Relics */}
                <button
                  type="button"
                  id="mode-geometric-btn"
                  onClick={() => setBgMode('geometric')}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                    bgMode === 'geometric'
                      ? 'bg-[#ff2a2a] text-white font-bold shadow-sm shadow-[#ff2a2a]/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Polyhedra
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
