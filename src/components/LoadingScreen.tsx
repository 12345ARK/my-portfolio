import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowRight, Zap, Shield, Sparkles, Terminal, FastForward, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const TELEMETRY_LOGS = [
  { threshold: 12, text: 'INIT_KERNEL: Initializing developer environment [Aryan Kumar]' },
  { threshold: 32, text: 'CORE_STACK: Mounting React 19, TypeScript & Tailwind CSS' },
  { threshold: 54, text: 'THREE_ENGINE: Compiling WebGL 3D neural nodes & cosmic shaders' },
  { threshold: 76, text: 'QUANTUM_FLOW: Synchronizing reactive states & DOM pipelines' },
  { threshold: 92, text: 'WARP_SINGULARITY: Event horizon relativistic shaders primed' },
  { threshold: 100, text: 'SYSTEM_ONLINE: All subsystems verified. Event horizon open.' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);
  const [autoEnterCountdown, setAutoEnterCountdown] = useState<number | null>(null);

  // Three.js animation and scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const innerMeshRef = useRef<THREE.Mesh | null>(null);
  const outerWireRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Group[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameId = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle actual entry action
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    // Allow the cinematic warp aperture animation to play before unmounting
    setTimeout(() => {
      onComplete();
    }, 700);
  }, [isExiting, onComplete]);

  // Keyboard shortcut listener (Enter, Space, or Escape to enter/skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnter();
      } else if ((e.key === 'Enter' || e.key === ' ') && isReady) {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, handleEnter]);

  // Track mouse coordinates for interactive 3D gimbal tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Progress simulation loop with realistic variable bursts
  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      // Non-linear realistic burst step
      const increment = Math.floor(Math.random() * 5) + 3;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Update active telemetry log
      const logIdx = TELEMETRY_LOGS.findIndex((log) => currentProgress <= log.threshold);
      if (logIdx !== -1) {
        setActiveLogIndex(logIdx);
      } else {
        setActiveLogIndex(TELEMETRY_LOGS.length - 1);
      }

      // Complete state
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsReady(true);
        // Start a gentle auto-enter countdown after 4 seconds if user doesn't interact
        setAutoEnterCountdown(4);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Auto-enter timer after reaching 100%
  useEffect(() => {
    if (autoEnterCountdown === null || autoEnterCountdown <= 0) {
      if (autoEnterCountdown === 0) {
        handleEnter();
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoEnterCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoEnterCountdown, handleEnter]);

  // Three.js Quantum Gyroscope Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    coreGroupRef.current = coreGroup;

    // 1. Central Quantum Singularity Core (Icosahedron + wireframe)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x140608,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);
    innerMeshRef.current = innerMesh;

    // Inner wireframe lattice
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(innerGeo, wireMat);
    wireMesh.scale.setScalar(1.02);
    coreGroup.add(wireMesh);
    outerWireRef.current = wireMesh;

    // 2. Gimbal Orbital Rings
    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0.8 }),
      new THREE.LineBasicMaterial({ color: 0xff8c42, transparent: true, opacity: 0.6 }),
      new THREE.LineBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.75 }),
    ];

    const rings: THREE.Group[] = [];
    const radii = [1.9, 2.35, 2.8];

    radii.forEach((r, idx) => {
      const ringGroup = new THREE.Group();
      const circleSegments = 72;
      const pts: THREE.Vector3[] = [];

      for (let i = 0; i <= circleSegments; i++) {
        const theta = (i / circleSegments) * Math.PI * 2;
        // create segmented dash effect
        if (i % 6 !== 0) {
          pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
        } else {
          pts.push(new THREE.Vector3(Math.cos(theta) * (r * 1.05), Math.sin(theta) * (r * 1.05), 0));
        }
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringLine = new THREE.Line(ringGeo, ringMaterials[idx % ringMaterials.length]);
      ringGroup.add(ringLine);

      // Add a couple of glowing sensor nodes on the ring
      const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: idx === 1 ? 0xffa726 : 0xff4747 });
      const node1 = new THREE.Mesh(nodeGeo, nodeMat);
      node1.position.set(r, 0, 0);
      ringGroup.add(node1);

      const node2 = new THREE.Mesh(nodeGeo, nodeMat);
      node2.position.set(-r, 0, 0);
      ringGroup.add(node2);

      coreGroup.add(ringGroup);
      rings.push(ringGroup);
    });

    ringsRef.current = rings;

    // 3. Swirling Ambient Quantum Particle Sparkles
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCols = new Float32Array(particleCount * 3);

    const cRed = new THREE.Color('#ff2a2a');
    const cAmber = new THREE.Color('#ff9800');

    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pPos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi);
      pPos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);

      const col = Math.random() > 0.4 ? cRed : cAmber;
      pCols[i * 3] = col.r;
      pCols[i * 3 + 1] = col.g;
      pCols[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCols, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    coreGroup.add(particles);
    particlesRef.current = particles;

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      time += 0.016;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (coreGroupRef.current) {
        // Gyroscope tracking based on mouse tilt
        coreGroupRef.current.rotation.y = time * 0.35 + mouseRef.current.x * 0.5;
        coreGroupRef.current.rotation.x = Math.sin(time * 0.25) * 0.15 - mouseRef.current.y * 0.4;
      }

      if (innerMeshRef.current && outerWireRef.current) {
        // Pulsing breathing core
        const pulse = 1 + Math.sin(time * 4) * 0.05;
        innerMeshRef.current.scale.setScalar(pulse);
        outerWireRef.current.rotation.y = -time * 0.6;
        outerWireRef.current.rotation.z = time * 0.4;
      }

      // Orbital gimbal rotations on alternating axes
      if (ringsRef.current[0]) {
        ringsRef.current[0].rotation.x = time * 0.7;
        ringsRef.current[0].rotation.y = time * 0.3;
      }
      if (ringsRef.current[1]) {
        ringsRef.current[1].rotation.y = -time * 0.6;
        ringsRef.current[1].rotation.z = time * 0.5;
      }
      if (ringsRef.current[2]) {
        ringsRef.current[2].rotation.x = -time * 0.4;
        ringsRef.current[2].rotation.z = -time * 0.7;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      id="portfolio-loading-screen"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#060609] text-zinc-100 font-['Outfit',sans-serif] select-none overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-110 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid Lines & Deep Cosmic Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 42, 42, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 42, 42, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Central Ambient Crimson Core Radiance */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none filter blur-[140px] opacity-25 transition-opacity duration-1000"
        style={{
          background: isReady
            ? 'radial-gradient(circle, #ff2a2a 0%, #ff8c42 40%, transparent 70%)'
            : 'radial-gradient(circle, #ff2a2a 0%, transparent 70%)',
        }}
      />

      {/* Corner Bracket Accents (High-Tech HUD styling) */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#ff2a2a]/60 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#ff2a2a]/60 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#ff2a2a]/60 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#ff2a2a]/60 pointer-events-none" />

      {/* TOP HEADER: Branding, Status, Audio & Skip Controls */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8 w-full max-w-7xl mx-auto">
        {/* Left: System Status Pill */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isReady ? 'bg-emerald-400' : 'bg-[#ff2a2a]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isReady ? 'bg-emerald-500' : 'bg-[#ff2a2a]'
              }`}
            />
          </span>
          <span className="font-mono text-xs tracking-wider uppercase text-zinc-400">
            {isReady ? (
              <span className="text-emerald-400 font-medium">SYSTEM ONLINE // 100% READY</span>
            ) : (
              <span>INITIALIZING SUBSYSTEMS...</span>
            )}
          </span>
        </div>

        {/* Center: Monogram / Tag */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500">
          <Shield className="w-3.5 h-3.5 text-[#ff2a2a]" />
          <span>ARYAN KUMAR // PORTFOLIO_V2.4</span>
        </div>

        {/* Right: Quick Controls (Skip) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="loading-skip-btn"
            onClick={handleEnter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff2a2a]/30 bg-[#ff2a2a]/10 hover:bg-[#ff2a2a]/20 text-xs font-mono text-[#ff8080] hover:text-white transition-all shadow-sm shadow-[#ff2a2a]/10"
            title="Skip directly to portfolio"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* CENTER: 3D Holographic Core Canvas + High-Tech Telemetry */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* 3D Canvas Mounting Area */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Centered Monogram In the 3D core */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,42,42,0.8)] font-['Outfit']">
              AK
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff8080]/80 mt-0.5">
              QUANTUM CORE
            </span>
          </div>

          {/* Interactive Scanning Reticle Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#ff2a2a]/25 animate-[spin_24s_linear_infinite] pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-[#ff2a2a]/15 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
        </div>

        {/* Big Monospace Progress Percentage */}
        <div className="mt-4 flex items-baseline gap-2 font-mono">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,42,42,0.5)]">
            {progress.toString().padStart(3, '0')}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#ff4242]">%</span>
        </div>

        {/* Progress Bar with Futuristic Segmented Glow */}
        <div className="w-full max-w-md mt-4 px-2">
          <div className="relative h-2 w-full rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#ff2a2a] via-[#ff5e5e] to-[#ffaa40] transition-all duration-150 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight Shimmer Sweep */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/40 blur-[2px]" />
            </div>
          </div>

          {/* Micro Telemetry Metrics */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-zinc-500 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#ff4242]" /> BUFFER: {progress}%
            </span>
            <span className="hidden sm:inline">LATENCY: 12ms</span>
            <span className="text-[#ff7878] font-medium">
              {progress < 100 ? 'SYNCHRONIZING...' : 'SYNCHRONIZED'}
            </span>
          </div>
        </div>

        {/* Telemetry Log Terminal Output */}
        <div className="w-full max-w-md mt-5 p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-1 border-b border-zinc-800/60 pb-1">
            <Terminal className="w-3 h-3 text-[#ff2a2a]" />
            <span>SYS_LOG :: EVENT_DISPATCHER</span>
          </div>
          <div className="font-mono text-xs text-zinc-300 min-h-[22px] flex items-center gap-2 overflow-hidden">
            {progress < 100 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-pulse shrink-0" />
                <span className="truncate">{TELEMETRY_LOGS[activeLogIndex]?.text}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-semibold truncate">
                  Ready to explore Aryan Kumar&apos;s Portfolio.
                </span>
              </>
            )}
          </div>
        </div>

        {/* ACTION: CTA "ENTER PORTFOLIO" Button (Appears when 100% or early click allowed) */}
        <div className="mt-6 sm:mt-7 flex flex-col items-center">
          {isReady ? (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              <button
                type="button"
                id="enter-portfolio-btn"
                onClick={handleEnter}
                autoFocus
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-mono text-sm uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-[#ff2a2a] via-[#e61e1e] to-[#ff4747] shadow-[0_0_35px_rgba(255,42,42,0.45)] hover:shadow-[0_0_50px_rgba(255,42,42,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Enter Portfolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px]">
                  ENTER
                </kbd>
                <span>or click to initialize</span>
                {autoEnterCountdown !== null && autoEnterCountdown > 0 && (
                  <span className="text-zinc-500">({autoEnterCountdown}s)</span>
                )}
              </p>
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping" />
              <span>Loading full developer portfolio assets...</span>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER: Developer credentials & system metadata */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 pb-6 sm:pb-8 text-xs font-mono text-zinc-500 w-full max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-3">
          <span>WebGL 2.0 // Three.js</span>
          <span>•</span>
          <span>Web Audio API</span>
          <span>•</span>
          <span>Tailwind CSS</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} ARYAN KUMAR • ALL SYSTEMS NOMINAL</span>
        </div>
      </footer>
    </div>
  );
};
