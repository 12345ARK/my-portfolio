import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Zap, Sparkles, Layers, Compass, Eye } from 'lucide-react';

export type CoreGeometryType = 'torus-knot' | 'icosahedron' | 'cyber-sphere';

interface TechSatellite {
  name: string;
  color: string;
  orbitRadius: number;
  speed: number;
  angle: number;
  inclination: number;
  mesh?: THREE.Group;
}

export const HolographicCore3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeGeometry, setActiveGeometry] = useState<CoreGeometryType>('torus-knot');
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [hudTelemetry, setHudTelemetry] = useState({ rotX: 0, rotY: 0, fps: 60 });
  const [pulseActive, setPulseActive] = useState<boolean>(false);

  // References to communicate between React state and Three.js animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const innerMeshRef = useRef<THREE.Mesh | null>(null);
  const wireMeshRef = useRef<THREE.Mesh | null>(null);
  const shockwaveRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group[]>([]);
  const satellitesRef = useRef<TechSatellite[]>([
    { name: 'React', color: '#06b6d4', orbitRadius: 3.1, speed: 0.018, angle: 0, inclination: 0.4 },
    { name: 'TS', color: '#3b82f6', orbitRadius: 3.4, speed: -0.014, angle: 1.2, inclination: -0.5 },
    { name: 'Node', color: '#10b981', orbitRadius: 2.9, speed: 0.022, angle: 2.5, inclination: 0.8 },
    { name: 'Python', color: '#f59e0b', orbitRadius: 3.6, speed: -0.012, angle: 3.8, inclination: -0.3 },
    { name: 'SQL', color: '#f43f5e', orbitRadius: 3.2, speed: 0.016, angle: 4.9, inclination: 0.6 },
  ]);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDown: false,
    prevX: 0,
    prevY: 0,
    velX: 0,
    velY: 0,
  });

  const shockwaveProgress = useRef<number>(1);
  const animFrameId = useRef<number | null>(null);

  // Trigger 3D Shockwave pulse
  const triggerPulse = useCallback(() => {
    shockwaveProgress.current = 0;
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 800);
  }, []);

  // Geometry builder helper
  const createCoreGeometries = (type: CoreGeometryType) => {
    let geo: THREE.BufferGeometry;
    if (type === 'torus-knot') {
      geo = new THREE.TorusKnotGeometry(1.25, 0.35, 128, 28, 2, 3);
    } else if (type === 'icosahedron') {
      geo = new THREE.IcosahedronGeometry(1.6, 2);
    } else {
      geo = new THREE.SphereGeometry(1.5, 32, 32);
    }
    return geo;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 440;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);
    cameraRef.current = camera;

    // Renderer with transparent canvas
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Root Core Group
    const rootCoreGroup = new THREE.Group();
    coreGroupRef.current = rootCoreGroup;
    scene.add(rootCoreGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightRed = new THREE.PointLight(0xff2a2a, 4.5, 20);
    pointLightRed.position.set(4, 4, 5);
    scene.add(pointLightRed);

    const pointLightCyan = new THREE.PointLight(0x06b6d4, 3.5, 20);
    pointLightCyan.position.set(-4, -4, 4);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 3.0, 20);
    pointLightPurple.position.set(0, 5, -3);
    scene.add(pointLightPurple);

    // 1. Central Core Mesh + Wireframe
    const geometry = createCoreGeometries(activeGeometry);

    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x08080c,
      emissive: 0xff1a1a,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    const innerMesh = new THREE.Mesh(geometry, innerMat);
    innerMeshRef.current = innerMesh;
    rootCoreGroup.add(innerMesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.set(1.015, 1.015, 1.015);
    wireMeshRef.current = wireMesh;
    rootCoreGroup.add(wireMesh);

    // 2. Concentric Gyroscopic Gimbal Rings
    ringsRef.current = [];
    const ringConfigs = [
      { radius: 2.15, tube: 0.022, color: 0xff2a2a, rotAxis: 'x', rotSpeed: 0.008, tiltX: 0.4, tiltY: 0.2 },
      { radius: 2.5, tube: 0.018, color: 0x06b6d4, rotAxis: 'y', rotSpeed: -0.01, tiltX: -0.5, tiltY: 0.6 },
      { radius: 2.8, tube: 0.02, color: 0xff6b6b, rotAxis: 'z', rotSpeed: 0.006, tiltX: 0.8, tiltY: -0.4 },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGroup = new THREE.Group();
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.55,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringGroup.add(ringMesh);

      // Add orbiting node on this ring
      const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(cfg.radius, 0, 0);
      ringGroup.add(nodeMesh);

      ringGroup.rotation.x = cfg.tiltX;
      ringGroup.rotation.y = cfg.tiltY;
      ringGroup.userData = { ...cfg };

      ringsRef.current.push(ringGroup);
      rootCoreGroup.add(ringGroup);
    });

    // 3. Orbiting Tech Satellites with HTML/Canvas 2D textures
    satellitesRef.current.forEach((sat) => {
      const satGroup = new THREE.Group();

      // Satellite Sphere
      const satGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satGroup.add(satMesh);

      // Glowing Aura Ring around satellite
      const satRingGeo = new THREE.RingGeometry(0.24, 0.29, 32);
      const satRingMat = new THREE.MeshBasicMaterial({
        color: sat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const satRing = new THREE.Mesh(satRingGeo, satRingMat);
      satRing.rotation.x = Math.PI / 2;
      satGroup.add(satRing);

      sat.mesh = satGroup;
      rootCoreGroup.add(satGroup);
    });

    // 4. Cybernetic Particle Cloud / Constellation
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xff2a2a);
    const color2 = new THREE.Color(0x06b6d4);
    const color3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.6 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    rootCoreGroup.add(particles);

    // 5. Expandable Shockwave Waveform Sphere
    const shockGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const shockMesh = new THREE.Mesh(shockGeo, shockMat);
    shockwaveRef.current = shockMesh;
    rootCoreGroup.add(shockMesh);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth && newHeight && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Mouse Tracking and Drag handlers
    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = normX * 0.4;
      mouseRef.current.targetY = normY * 0.4;

      if (mouseRef.current.isDown) {
        const deltaX = e.clientX - mouseRef.current.prevX;
        const deltaY = e.clientY - mouseRef.current.prevY;
        mouseRef.current.velX = deltaX * 0.008;
        mouseRef.current.velY = deltaY * 0.008;

        if (coreGroupRef.current) {
          coreGroupRef.current.rotation.y += mouseRef.current.velX;
          coreGroupRef.current.rotation.x += mouseRef.current.velY;
        }

        mouseRef.current.prevX = e.clientX;
        mouseRef.current.prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDown = true;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && mouseRef.current.isDown) {
        const deltaX = e.touches[0].clientX - mouseRef.current.prevX;
        const deltaY = e.touches[0].clientY - mouseRef.current.prevY;

        if (coreGroupRef.current) {
          coreGroupRef.current.rotation.y += deltaX * 0.01;
          coreGroupRef.current.rotation.x += deltaY * 0.01;
        }

        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.isDown = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (time: number) => {
      animFrameId.current = requestAnimationFrame(animate);

      // Measure FPS
      frameCount++;
      if (time - lastFpsUpdate > 500) {
        const currentFps = Math.round((frameCount * 1000) / (time - lastFpsUpdate));
        if (coreGroupRef.current) {
          setHudTelemetry({
            rotX: Math.round((coreGroupRef.current.rotation.x * 180) / Math.PI) % 360,
            rotY: Math.round((coreGroupRef.current.rotation.y * 180) / Math.PI) % 360,
            fps: Math.min(60, currentFps),
          });
        }
        frameCount = 0;
        lastFpsUpdate = time;
      }

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Mouse Parallax Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (coreGroupRef.current) {
        if (!mouseRef.current.isDown) {
          // Apply velocity momentum decay
          coreGroupRef.current.rotation.y += mouseRef.current.velX;
          coreGroupRef.current.rotation.x += mouseRef.current.velY;
          mouseRef.current.velX *= 0.92;
          mouseRef.current.velY *= 0.92;

          // Gentle autonomous orbit when enabled
          if (isAutoSpinning) {
            coreGroupRef.current.rotation.y += 0.006;
            coreGroupRef.current.rotation.x = mouseRef.current.y + Math.sin(time * 0.001) * 0.1;
          }
        }
      }

      // Rotate internal core mesh and wireframe
      if (innerMeshRef.current && wireMeshRef.current) {
        innerMeshRef.current.rotation.x += 0.004;
        innerMeshRef.current.rotation.z += 0.003;
        wireMeshRef.current.rotation.x += 0.004;
        wireMeshRef.current.rotation.z += 0.003;

        // Breathing pulse on scale
        const pulse = 1 + Math.sin(time * 0.0025) * 0.04;
        innerMeshRef.current.scale.set(pulse, pulse, pulse);
        wireMeshRef.current.scale.set(pulse * 1.015, pulse * 1.015, pulse * 1.015);
      }

      // Rotate Gimbal Rings
      ringsRef.current.forEach((ring) => {
        const u = ring.userData;
        if (u.rotAxis === 'x') ring.rotation.x += u.rotSpeed;
        else if (u.rotAxis === 'y') ring.rotation.y += u.rotSpeed;
        else ring.rotation.z += u.rotSpeed;
      });

      // Animate Orbiting Satellites
      satellitesRef.current.forEach((sat) => {
        sat.angle += sat.speed;
        if (sat.mesh) {
          const x = Math.cos(sat.angle) * sat.orbitRadius;
          const z = Math.sin(sat.angle) * sat.orbitRadius;
          // Apply inclination
          const y = Math.sin(sat.angle) * sat.orbitRadius * Math.sin(sat.inclination);
          sat.mesh.position.set(x, y, z);
          sat.mesh.rotation.y += 0.02;
        }
      });

      // Particles ambient swirl
      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.0015;
      }

      // Shockwave Pulse Animation
      if (shockwaveRef.current && shockwaveProgress.current < 1) {
        shockwaveProgress.current += delta * 1.6;
        const progress = Math.min(1, shockwaveProgress.current);
        const scale = 0.8 + progress * 4.5;
        shockwaveRef.current.scale.set(scale, scale, scale);
        const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.85;
      }

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [isAutoSpinning]);

  // Handle Geometry Switch dynamically
  useEffect(() => {
    if (!innerMeshRef.current || !wireMeshRef.current) return;

    const newGeo = createCoreGeometries(activeGeometry);

    innerMeshRef.current.geometry.dispose();
    wireMeshRef.current.geometry.dispose();

    innerMeshRef.current.geometry = newGeo;
    wireMeshRef.current.geometry = newGeo;

    // Trigger pulse on switch
    triggerPulse();
  }, [activeGeometry, triggerPulse]);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none">
      {/* 3D Hologram Frame with Cyber Glass Styling */}
      <div
        id="holographic-core-card"
        className="relative w-72 sm:w-96 aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#101016]/90 via-[#0c0c12]/95 to-[#08080c]/98 border border-[#ff2a2a]/30 shadow-2xl shadow-black/90 backdrop-blur-xl overflow-hidden group"
      >
        {/* Ambient Glow Gradients */}
        <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-[#ff2a2a]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Cyber HUD Corner Reticles */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 z-20 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping" />
          <span className="text-zinc-300 font-bold uppercase tracking-wider">HOLO CORE // ONLINE</span>
        </div>

        <div className="absolute top-3 right-3 font-mono text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800 z-20 pointer-events-none">
          {hudTelemetry.fps} FPS
        </div>

        {/* Targeting Grid Overlay on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />

        {/* WebGL Canvas Mount */}
        <div
          ref={mountRef}
          onClick={triggerPulse}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 flex items-center justify-center"
          title="Click to emit pulse, drag to rotate 3D core"
        />

        {/* Bottom Telemetry Bar */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-zinc-800/80 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-zinc-300">
            <Compass className="w-3.5 h-3.5 text-[#ff2a2a]" />
            <span>X: {hudTelemetry.rotX}°</span>
            <span className="text-zinc-600">|</span>
            <span>Y: {hudTelemetry.rotY}°</span>
          </div>

          <button
            type="button"
            onClick={triggerPulse}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
              pulseActive
                ? 'bg-[#ff2a2a] text-white shadow-lg shadow-[#ff2a2a]/50 scale-105'
                : 'bg-[#ff2a2a]/15 text-[#ff2a2a] hover:bg-[#ff2a2a]/25 border border-[#ff2a2a]/30'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Pulse</span>
          </button>
        </div>
      </div>

      {/* Interactive 3D Control Center */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 z-20">
        {/* Geometry Switchers */}
        <div className="flex items-center bg-zinc-950/85 p-1 rounded-xl border border-zinc-800/80 shadow-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveGeometry('torus-knot')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeGeometry === 'torus-knot'
                ? 'bg-[#ff2a2a] text-white font-bold shadow-md shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Torus Knot
          </button>

          <button
            type="button"
            onClick={() => setActiveGeometry('icosahedron')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeGeometry === 'icosahedron'
                ? 'bg-[#ff2a2a] text-white font-bold shadow-md shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Icosahedron
          </button>

          <button
            type="button"
            onClick={() => setActiveGeometry('cyber-sphere')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeGeometry === 'cyber-sphere'
                ? 'bg-[#ff2a2a] text-white font-bold shadow-md shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sphere
          </button>
        </div>

        {/* Orbit Spin Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoSpinning(!isAutoSpinning)}
          className="px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 shadow-lg transition-all"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#ff2a2a] ${isAutoSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>{isAutoSpinning ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}</span>
        </button>
      </div>

      <p className="text-[11px] font-mono text-zinc-500 mt-2 text-center">
        ⚡ Grab and drag in 360° space • Click core for quantum pulse
      </p>
    </div>
  );
};
