import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Terminal, Code2, RotateCw, Monitor, Sparkles, Activity } from 'lucide-react';

type ScreenView = 'code' | 'terminal' | 'matrix' | 'system';

interface CyberComputer3DProps {
  className?: string;
}

export const CyberComputer3D: React.FC<CyberComputer3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasHolderRef = useRef<HTMLDivElement | null>(null);

  // Three.js Core
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 3D Groups & Meshes
  const computerStationGroupRef = useRef<THREE.Group | null>(null);
  const monitorGroupRef = useRef<THREE.Group | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const holographicPanelsGroupRef = useRef<THREE.Group | null>(null);
  const floatingParticlesRef = useRef<THREE.Points | null>(null);

  // Interactive State
  const [screenView, setScreenView] = useState<ScreenView>('code');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isScreenPowered, setIsScreenPowered] = useState<boolean>(true);

  // Mouse drag & momentum state for 360 rotation
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    rotX: 0.12,
    rotY: -0.25,
    targetRotX: 0.12,
    targetRotY: -0.25,
    velX: 0,
    velY: 0,
  });

  // Dedicated offscreen 2D Canvas for High-Resolution Display
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Frame count & animation state for screen
  const screenAnimRef = useRef({
    frameCount: 0,
    typedChars: 0,
    matrixDrops: Array.from({ length: 42 }, () => Math.floor(Math.random() * 30)),
    cpuLoad: 24,
    ramLoad: 42,
    ping: 12,
  });

  // Initialize Canvas Texture once
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    screenCanvasRef.current = canvas;
    screenCtxRef.current = ctx;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    screenTextureRef.current = texture;
  }, []);

  // Screen Drawing Function (High Contrast, Crisp, Cyber Styling)
  const drawScreen = useCallback(() => {
    const canvas = screenCanvasRef.current;
    const ctx = screenCtxRef.current;
    const texture = screenTextureRef.current;
    if (!canvas || !ctx || !texture) return;

    const anim = screenAnimRef.current;
    anim.frameCount++;
    const cw = canvas.width;
    const ch = canvas.height;

    // 1. If screen is powered off
    if (!isScreenPowered) {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, cw, ch);
      // Faint standby LED in corner
      ctx.fillStyle = '#333344';
      ctx.font = '24px monospace';
      ctx.fillText('DISPLAY STANDBY [PRESS POWER TO ACTIVATE]', cw / 2 - 270, ch / 2);
      texture.needsUpdate = true;
      return;
    }

    // 2. High-Tech Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, cw, ch);

    // Subtle dark grid pattern on screen
    ctx.strokeStyle = 'rgba(255, 42, 42, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }
    for (let y = 0; y < ch; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }

    // 3. Top Cyber Window Header / Menu Bar
    ctx.fillStyle = '#12121e';
    ctx.fillRect(0, 0, cw, 58);

    // Window control buttons (Red, Amber, Emerald)
    const dotY = 29;
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(36, dotY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(66, dotY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(96, dotY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Active Editor Tabs
    ctx.fillStyle = '#1a1a2b';
    ctx.fillRect(135, 10, 240, 48);
    ctx.fillStyle = '#ff2a2a';
    ctx.fillRect(135, 54, 240, 4); // active line
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('⚛ AryanKumar.tsx', 155, 41);

    ctx.fillStyle = '#101018';
    ctx.fillRect(380, 10, 200, 48);
    ctx.fillStyle = '#8e8ea0';
    ctx.font = '17px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('◈ neural_core.py', 398, 41);

    // Right Status Telemetry in Header
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('● SYSTEM: ONLINE', cw - 320, 37);

    ctx.fillStyle = '#ff2a2a';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`[${screenView.toUpperCase()} MODE]`, cw - 145, 37);

    // 4. View Specific Screen Rendering
    if (screenView === 'code') {
      // ----------------------------------------------------
      // CODE EDITOR VIEW (Glowing syntax, line numbers, sidebar)
      // ----------------------------------------------------
      // Left Sidebar File Explorer
      ctx.fillStyle = '#0e0e18';
      ctx.fillRect(0, 58, 200, ch - 58);

      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('EXPLORER', 24, 90);

      const files = [
        { name: '▾ src', color: '#ff4d4d' },
        { name: '  ▸ components', color: '#60a5fa' },
        { name: '    AryanKumar.tsx', color: '#38bdf8' },
        { name: '    FullStack.ts', color: '#a78bfa' },
        { name: '    ThreeD_Core.glsl', color: '#fbbf24' },
        { name: '▾ backend', color: '#34d399' },
        { name: '    server.ts', color: '#f87171' },
        { name: '    database.py', color: '#f472b6' },
      ];

      files.forEach((file, idx) => {
        ctx.fillStyle = file.color;
        ctx.font = '16px "JetBrains Mono", monospace';
        ctx.fillText(file.name, 20, 125 + idx * 32);
      });

      // Code Editor Area
      const codeStartX = 230;
      const codeLines = [
        { num: '01', text: '// Aryan Kumar — High-Performance Full-Stack Engineer', type: 'comment' },
        { num: '02', text: 'import { WebGL, CloudArchitecture } from "@nexus/engine";', type: 'import' },
        { num: '03', text: 'import { React19, TypeScript, NodeServer } from "@core/stack";', type: 'import' },
        { num: '04', text: '', type: 'plain' },
        { num: '05', text: 'export async function initializeDeveloper(): Promise<Engineer> {', type: 'func' },
        { num: '06', text: '  const aryan = new FullStackDeveloper({', type: 'keyword' },
        { num: '07', text: '    name: "Aryan Kumar",', type: 'prop' },
        { num: '08', text: '    primaryFocus: "Scalable Web & Interactive 3D Realtime UIs",', type: 'prop' },
        { num: '09', text: '    techStack: ["React 19", "Node.js", "Python", "TypeScript", "Three.js"],', type: 'prop' },
        { num: '10', text: '    cloudReady: true,', type: 'boolean' },
        { num: '11', text: '    productionStatus: "SHIPPING_DAILY",', type: 'prop' },
        { num: '12', text: '  });', type: 'plain' },
        { num: '13', text: '', type: 'plain' },
        { num: '14', text: '  await aryan.compileAndDeploy({ target: "GLOBAL_CLUSTER" });', type: 'exec' },
        { num: '15', text: '  return aryan.connectWithWorld();', type: 'keyword' },
        { num: '16', text: '}', type: 'plain' },
      ];

      // Gutter & Line Numbers
      ctx.fillStyle = '#141422';
      ctx.fillRect(200, 58, 48, ch - 58);

      codeLines.forEach((line, i) => {
        const y = 100 + i * 35;

        // Line number
        ctx.fillStyle = '#4b5563';
        ctx.font = '16px monospace';
        ctx.fillText(line.num, 210, y);

        // Code syntax styling
        ctx.font = 'bold 18px "JetBrains Mono", Consolas, monospace';
        if (line.type === 'comment') {
          ctx.fillStyle = '#6b7280';
        } else if (line.type === 'import') {
          ctx.fillStyle = '#c084fc';
        } else if (line.type === 'func') {
          ctx.fillStyle = '#38bdf8';
        } else if (line.type === 'keyword') {
          ctx.fillStyle = '#ff2a2a';
        } else if (line.type === 'prop') {
          ctx.fillStyle = '#34d399';
        } else if (line.type === 'boolean') {
          ctx.fillStyle = '#fbbf24';
        } else if (line.type === 'exec') {
          ctx.fillStyle = '#38bdf8';
        } else {
          ctx.fillStyle = '#e2e8f0';
        }
        ctx.fillText(line.text, codeStartX + 30, y);
      });

      // Bottom Mini Terminal Strip
      ctx.fillStyle = '#08080e';
      ctx.fillRect(200, ch - 110, cw - 200, 110);
      ctx.strokeStyle = '#222233';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(200, ch - 110);
      ctx.lineTo(cw, ch - 110);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('TERMINAL [zsh] — aryan-portfolio-v3', 220, ch - 80);

      ctx.fillStyle = '#34d399';
      ctx.font = '16px monospace';
      ctx.fillText('✔ Production build complete in 84ms • Vite 6 Hot-Reload Online', 220, ch - 50);

      ctx.fillStyle = '#f3f4f6';
      ctx.fillText('➜  ready for client projects [PORT 3000]', 220, ch - 22);

      // Blinking Terminal Cursor
      if (Math.floor(anim.frameCount / 24) % 2 === 0) {
        ctx.fillStyle = '#ff2a2a';
        ctx.fillRect(575, ch - 34, 10, 18);
      }
    } else if (screenView === 'terminal') {
      // ----------------------------------------------------
      // FULLSCREEN CYBER BASH CONSOLE VIEW
      // ----------------------------------------------------
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 58, cw, ch - 58);

      const logs = [
        { prompt: 'aryan@quantum-host:~$', cmd: 'docker run -d -p 3000:3000 aryan-kumar/engine:latest' },
        { prompt: '➜', cmd: 'Starting full-stack container services...' },
        { prompt: '➜', cmd: '[DB] Cloud PostgreSQL & Redis Cache: CONNECTED' },
        { prompt: '➜', cmd: '[API] Express Microservices & REST Endpoints: 200 OK' },
        { prompt: '➜', cmd: '[3D] WebGL Three.js Acceleration: HARDWARE ACCELERATED' },
        { prompt: '➜', cmd: '[SEC] SSL / TLS Encryption: ACTIVE (A+ Grade)' },
        { prompt: 'aryan@quantum-host:~$', cmd: 'git log -n 1 --oneline' },
        { prompt: '➜', cmd: '8f4c219 feat: add futuristic 3D computer workstation showcase' },
        { prompt: 'aryan@quantum-host:~$', cmd: 'npm run test:all' },
        { prompt: '➜', cmd: 'Tests: 48 passed, 0 failed, 100% test coverage' },
        { prompt: 'aryan@quantum-host:~$', cmd: 'aryan --hire --available=true' },
        { prompt: '✔', cmd: 'STATUS: Ready for Freelance, Full-time & Internship Roles' },
      ];

      logs.forEach((log, i) => {
        const y = 105 + i * 46;
        ctx.fillStyle = log.prompt === '✔' ? '#34d399' : '#ff2a2a';
        ctx.font = 'bold 20px "JetBrains Mono", Consolas, monospace';
        ctx.fillText(log.prompt, 36, y);

        ctx.fillStyle = log.prompt === '✔' ? '#34d399' : '#e5e7eb';
        ctx.font = '20px "JetBrains Mono", Consolas, monospace';
        ctx.fillText(log.cmd, 250, y);
      });

      // Blinking Cursor
      if (Math.floor(anim.frameCount / 20) % 2 === 0) {
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(36, 105 + logs.length * 46 - 22, 14, 26);
      }
    } else if (screenView === 'matrix') {
      // ----------------------------------------------------
      // MATRIX DIGITAL STREAM
      // ----------------------------------------------------
      ctx.fillStyle = 'rgba(8, 8, 14, 0.25)';
      ctx.fillRect(0, 58, cw, ch - 58);

      const matrixChars = '0123456789ABCDEF<>/*+-~#{}[]$@%!?';
      ctx.font = 'bold 24px monospace';

      for (let i = 0; i < anim.matrixDrops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * 31 + 15;
        const y = anim.matrixDrops[i] * 28 + 90;

        // Head of the drop is brilliant white, tail is cyber red & cyan
        ctx.fillStyle = Math.random() > 0.88 ? '#ffffff' : i % 2 === 0 ? '#ff2a2a' : '#00e5ff';
        ctx.fillText(char, x, y);

        if (y > ch && Math.random() > 0.97) {
          anim.matrixDrops[i] = 0;
        }
        anim.matrixDrops[i]++;
      }

      // Center High-Tech Overlay
      ctx.fillStyle = 'rgba(10, 10, 18, 0.82)';
      ctx.fillRect(cw / 2 - 320, ch / 2 - 80, 640, 160);
      ctx.strokeStyle = '#ff2a2a';
      ctx.lineWidth = 2;
      ctx.strokeRect(cw / 2 - 320, ch / 2 - 80, 640, 160);

      ctx.fillStyle = '#ff2a2a';
      ctx.font = 'bold 32px "JetBrains Mono", monospace';
      ctx.fillText('QUANTUM MATRIX CORE', cw / 2 - 205, ch / 2 - 25);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '20px monospace';
      ctx.fillText('CYBERNETIC ENCRYPTION STREAM ACTIVE', cw / 2 - 215, ch / 2 + 25);
    } else {
      // ----------------------------------------------------
      // SYSTEM METRICS & PERFORMANCE DASHBOARD VIEW
      // ----------------------------------------------------
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 58, cw, ch - 58);

      // 4 Metric Gauges Cards
      const metrics = [
        { label: 'CPU CORE 8x', val: '4.9 GHz', pct: 68, color: '#ff2a2a' },
        { label: 'RAM USAGE', val: '18.4 / 32 GB', pct: 58, color: '#38bdf8' },
        { label: 'GPU VRAM', val: '12.1 / 16 GB', pct: 75, color: '#34d399' },
        { label: 'NETWORK I/O', val: '1.2 GB/s', pct: 88, color: '#fbbf24' },
      ];

      metrics.forEach((m, idx) => {
        const cx = 50 + (idx % 2) * 600;
        const cy = 90 + Math.floor(idx / 2) * 310;

        ctx.fillStyle = '#121220';
        ctx.fillRect(cx, cy, 560, 270);
        ctx.strokeStyle = '#222238';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, 560, 270);

        ctx.fillStyle = '#9ca3af';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(m.label, cx + 30, cy + 50);

        ctx.fillStyle = m.color;
        ctx.font = 'bold 42px "JetBrains Mono", monospace';
        ctx.fillText(m.val, cx + 30, cy + 115);

        // Progress Bar
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(cx + 30, cy + 150, 500, 22);

        ctx.fillStyle = m.color;
        ctx.fillRect(cx + 30, cy + 150, 500 * (m.pct / 100), 22);

        ctx.fillStyle = '#6b7280';
        ctx.font = '16px monospace';
        ctx.fillText(`Load Factor: ${m.pct}% • Normal Operating Range`, cx + 30, cy + 215);
      });
    }

    // Refresh Texture
    texture.needsUpdate = true;
  }, [screenView, isScreenPowered]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const mount = canvasHolderRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 450;
    const height = mount.clientHeight || 420;

    // 1. Scene & Perspective Camera (Camera positioned straight in front looking slightly down)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const initialAspect = width / height;
    const fovRad = THREE.MathUtils.degToRad(36 / 2);
    const initialZ = Math.max(3.05 / (Math.tan(fovRad) * initialAspect), 2.15 / Math.tan(fovRad));
    camera.position.set(0, 0.5, initialZ);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High-DPI & Anti-aliasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    mount.replaceChildren(renderer.domElement);

    // 3. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainKeyLight.position.set(3, 5, 6);
    scene.add(mainKeyLight);

    const redRimLight = new THREE.PointLight(0xff2a2a, 3.5, 20);
    redRimLight.position.set(-4, 3, 2);
    scene.add(redRimLight);

    const cyanRimLight = new THREE.PointLight(0x00e5ff, 3.0, 20);
    cyanRimLight.position.set(4, 2, -2);
    scene.add(cyanRimLight);

    // 4. Main Computer Station Group
    const stationGroup = new THREE.Group();
    stationGroup.scale.set(1.0, 1.0, 1.0);
    computerStationGroupRef.current = stationGroup;
    scene.add(stationGroup);

    // ----------------------------------------------------
    // 4a. THE 3D CYBER MONITOR (PROMINENT, HUGE, FRONT & CENTER)
    // ----------------------------------------------------
    const monitorGroup = new THREE.Group();
    monitorGroupRef.current = monitorGroup;
    stationGroup.add(monitorGroup);

    const monitorWidth = 5.2;
    const monitorHeight = 3.25;
    const monitorThick = 0.14;

    // Monitor Outer Bezel
    const bezelMat = new THREE.MeshPhysicalMaterial({
      color: 0x111118,
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
    const bezelGeo = new THREE.BoxGeometry(monitorWidth, monitorHeight, monitorThick);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    monitorGroup.add(bezelMesh);

    // Red Accent Ring on Back of Monitor (Sleek Gaming/Cyber LED Ring)
    const backRingGeo = new THREE.RingGeometry(0.7, 0.76, 48);
    const backRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      side: THREE.DoubleSide,
    });
    const backRingMesh = new THREE.Mesh(backRingGeo, backRingMat);
    backRingMesh.position.set(0, 0, -monitorThick / 2 - 0.005);
    monitorGroup.add(backRingMesh);

    // Glowing Neon Edge Trim around Screen Bezel
    const neonEdgeGeo = new THREE.BoxGeometry(monitorWidth + 0.04, monitorHeight + 0.04, 0.02);
    const neonEdgeMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      transparent: true,
      opacity: 0.85,
    });
    const neonEdgeMesh = new THREE.Mesh(neonEdgeGeo, neonEdgeMat);
    neonEdgeMesh.position.set(0, 0, 0);
    monitorGroup.add(neonEdgeMesh);

    // FRONT DISPLAY SCREEN PLANE (MAPPED WITH 2D CANVAS TEXTURE)
    if (screenTextureRef.current) {
      const screenGeo = new THREE.PlaneGeometry(monitorWidth * 0.96, monitorHeight * 0.94);
      const screenMat = new THREE.MeshBasicMaterial({
        map: screenTextureRef.current,
        side: THREE.DoubleSide,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, monitorThick / 2 + 0.005);
      screenMeshRef.current = screenMesh;
      monitorGroup.add(screenMesh);
    }

    // Monitor Position & Angle:
    // Tilted -0.08 rad (~4.5 deg back) so it faces camera perfectly
    monitorGroup.position.set(0, 0.35, 0);
    monitorGroup.rotation.x = -0.08;

    // ----------------------------------------------------
    // 4b. SLEEK CYBER MONITOR STAND & BASE
    // ----------------------------------------------------
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x181822,
      metalness: 0.9,
      roughness: 0.3,
    });

    // Stand Neck Pillar
    const neckGeo = new THREE.BoxGeometry(0.35, 1.6, 0.2);
    const neckMesh = new THREE.Mesh(neckGeo, standMat);
    neckMesh.position.set(0, -0.6, -0.35);
    neckMesh.rotation.x = -0.15;
    stationGroup.add(neckMesh);

    // Heavy Metal Desktop Stand Base (Hexagonal / Sleek)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.1, 6);
    const baseMesh = new THREE.Mesh(baseGeo, standMat);
    baseMesh.position.set(0, -1.4, -0.2);
    stationGroup.add(baseMesh);

    // Stand Base Neon Halo Ring
    const baseHaloGeo = new THREE.RingGeometry(1.42, 1.48, 6);
    baseHaloGeo.rotateX(-Math.PI / 2);
    const baseHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
    });
    const baseHaloMesh = new THREE.Mesh(baseHaloGeo, baseHaloMat);
    baseHaloMesh.position.set(0, -1.34, -0.2);
    stationGroup.add(baseHaloMesh);

    // ----------------------------------------------------
    // 4c. ILLUMINATED CYBER KEYBOARD IN FRONT
    // ----------------------------------------------------
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, -1.35, 1.4);
    keyboardGroup.rotation.x = 0.12; // tilted toward user
    stationGroup.add(keyboardGroup);

    // Keyboard Base Plate
    const kbBaseGeo = new THREE.BoxGeometry(3.6, 0.1, 1.3);
    const kbBaseMat = new THREE.MeshStandardMaterial({
      color: 0x14141e,
      metalness: 0.8,
      roughness: 0.35,
    });
    const kbBaseMesh = new THREE.Mesh(kbBaseGeo, kbBaseMat);
    keyboardGroup.add(kbBaseMesh);

    // Illuminated Keycaps Matrix
    const kbCols = 12;
    const kbRows = 4;
    const keyGeo = new THREE.BoxGeometry(0.22, 0.06, 0.2);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x1f202e,
      roughness: 0.4,
    });

    for (let r = 0; r < kbRows; r++) {
      for (let c = 0; c < kbCols; c++) {
        const kMesh = new THREE.Mesh(keyGeo, keyMat);
        kMesh.position.set(
          -1.4 + c * 0.26,
          0.08,
          -0.38 + r * 0.26
        );
        keyboardGroup.add(kMesh);
      }
    }

    // Keyboard RGB Edge Glow Line
    const kbGlowGeo = new THREE.BoxGeometry(3.64, 0.02, 1.34);
    const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.8 });
    const kbGlowMesh = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlowMesh.position.set(0, 0.01, 0);
    keyboardGroup.add(kbGlowMesh);

    // Cyber Mouse Beside Keyboard
    const mouseGeo = new THREE.BoxGeometry(0.4, 0.14, 0.7);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1c1c28, metalness: 0.7, roughness: 0.3 });
    const mouseMesh = new THREE.Mesh(mouseGeo, mouseMat);
    mouseMesh.position.set(2.0, -1.32, 1.4);
    stationGroup.add(mouseMesh);

    // Mouse LED Scroll Wheel
    const wheelGeo = new THREE.BoxGeometry(0.06, 0.08, 0.16);
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
    wheelMesh.position.set(2.0, -1.24, 1.3);
    stationGroup.add(wheelMesh);

    // ----------------------------------------------------
    // 4d. FLOATING HOLOGRAPHIC TECH WIDGETS
    // ----------------------------------------------------
    const holoGroup = new THREE.Group();
    holographicPanelsGroupRef.current = holoGroup;
    stationGroup.add(holoGroup);

    // Holographic Left Panel (Wireframe Glass)
    const holoGeo = new THREE.PlaneGeometry(1.2, 1.8);
    const holoMat1 = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const holoMesh1 = new THREE.Mesh(holoGeo, holoMat1);
    holoMesh1.position.set(-2.6, 0.7, 0.4);
    holoMesh1.rotation.y = 0.45;
    holoGroup.add(holoMesh1);

    // Holographic Right Panel
    const holoMat2 = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const holoMesh2 = new THREE.Mesh(holoGeo, holoMat2);
    holoMesh2.position.set(2.6, 0.7, 0.4);
    holoMesh2.rotation.y = -0.45;
    holoGroup.add(holoMesh2);

    // ----------------------------------------------------
    // 4e. FLOATING PARTICLE DUST CLOUD
    // ----------------------------------------------------
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xff2a2a,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    floatingParticlesRef.current = particles;
    stationGroup.add(particles);

    // 5. Initial Screen Drawing immediately
    drawScreen();

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
        const aspect = w / h;
        cameraRef.current.aspect = aspect;
        const fovRad = THREE.MathUtils.degToRad(36 / 2);
        cameraRef.current.position.z = Math.max(
          3.05 / (Math.tan(fovRad) * aspect),
          2.15 / Math.tan(fovRad)
        );
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(mount);

    // 7. Render Animation Loop
    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      frame++;

      // Update screen content every 3 frames for smooth animation
      if (frame % 3 === 0) {
        drawScreen();
      }

      // Smooth inertia rotation
      if (!dragRef.current.isDown) {
        if (isAutoRotate) {
          dragRef.current.targetRotY += 0.005;
        }
        dragRef.current.targetRotY += dragRef.current.velY;
        dragRef.current.targetRotX += dragRef.current.velX;
        dragRef.current.velY *= 0.92;
        dragRef.current.velX *= 0.92;
      }

      // Smooth lerp rotation
      dragRef.current.rotX += (dragRef.current.targetRotX - dragRef.current.rotX) * 0.1;
      dragRef.current.rotY += (dragRef.current.targetRotY - dragRef.current.rotY) * 0.1;

      // Apply to station rig
      if (computerStationGroupRef.current) {
        computerStationGroupRef.current.rotation.x = dragRef.current.rotX;
        computerStationGroupRef.current.rotation.y = dragRef.current.rotY;

        // Zero-gravity levitation breathing
        computerStationGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.1;
      }

      // Floating holographic panels oscillation
      if (holographicPanelsGroupRef.current) {
        holographicPanelsGroupRef.current.position.y = Math.sin(elapsed * 2.2) * 0.08;
      }

      // Particle subtle rotation
      if (floatingParticlesRef.current) {
        floatingParticlesRef.current.rotation.y = elapsed * 0.08;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement && mount) {
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    };
  }, [drawScreen, isAutoRotate]);

  // Pointer drag controls for 360 inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current.isDown = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.velX = 0;
    dragRef.current.velY = 0;
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRef.current.isDown) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;

      dragRef.current.targetRotY += deltaX * 0.01;
      dragRef.current.targetRotX = Math.max(-0.45, Math.min(0.85, dragRef.current.targetRotX + deltaY * 0.01));

      dragRef.current.velY = deltaX * 0.006;
      dragRef.current.velX = deltaY * 0.006;
    } else if (containerRef.current) {
      // Subtle cursor tracking parallax
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      dragRef.current.targetRotX = 0.12 + ny * 0.2;
      dragRef.current.targetRotY += nx * 0.002;
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDown = false;
    setIsInteracting(false);
  };

  const handlePointerLeave = () => {
    dragRef.current.isDown = false;
    setIsInteracting(false);
  };

  // Quick 360 Spin Burst
  const triggerSpinBurst = () => {
    dragRef.current.targetRotY += Math.PI * 2;
    dragRef.current.velY = 0.14;
  };

  return (
    <motion.div
      ref={containerRef}
      id="hero-cyber-computer-section"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Free-Floating Ambient Cyber Halo (Zero Boxes / Zero Borders) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 42, 42, 0.22) 0%, rgba(0, 229, 255, 0.1) 42%, transparent 70%)',
        }}
      />

      {/* Free-Floating 3D Computer Canvas */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] xl:h-[520px] cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div ref={canvasHolderRef} className="w-full h-full" />

        {/* Drag Hint UX */}
        {!isInteracting && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
            <span className="px-3 py-1 rounded-full bg-black/75 border border-zinc-800 text-[11px] font-mono text-zinc-300 backdrop-blur-sm shadow-md flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-[#ff2a2a]" />
              <span>Interactive 3D Workstation • Drag to Rotate 360°</span>
            </span>
          </div>
        )}
      </div>

      {/* Floating Translucent Controls (Zero Card Box, Pure Pill Controls) */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-2 px-2">
        {/* Screen View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60 shadow-lg">
          <button
            type="button"
            id="screen-view-code-btn"
            onClick={() => setScreenView('code')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              screenView === 'code'
                ? 'bg-[#ff2a2a] text-white shadow-sm shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            type="button"
            id="screen-view-terminal-btn"
            onClick={() => setScreenView('terminal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              screenView === 'terminal'
                ? 'bg-[#ff2a2a] text-white shadow-sm shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            id="screen-view-matrix-btn"
            onClick={() => setScreenView('matrix')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              screenView === 'matrix'
                ? 'bg-[#ff2a2a] text-white shadow-sm shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matrix</span>
          </button>

          <button
            type="button"
            id="screen-view-system-btn"
            onClick={() => setScreenView('system')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              screenView === 'system'
                ? 'bg-[#ff2a2a] text-white shadow-sm shadow-[#ff2a2a]/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>

        {/* Hardware Action Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800/60 shadow-lg">
          <button
            type="button"
            id="computer-power-btn"
            onClick={() => setIsScreenPowered(!isScreenPowered)}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              isScreenPowered ? 'text-cyan-400' : 'text-zinc-500'
            }`}
            title="Toggle Screen Display Power"
          >
            <span>{isScreenPowered ? 'PWR: ON' : 'PWR: OFF'}</span>
          </button>

          <button
            type="button"
            id="computer-orbit-toggle-btn"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              isAutoRotate ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
            }`}
            title={isAutoRotate ? 'Pause Orbit Rotation' : 'Resume Orbit Rotation'}
          >
            <span>{isAutoRotate ? 'Orbit: ON' : 'Orbit: OFF'}</span>
          </button>

          <button
            type="button"
            id="computer-spin-burst-btn"
            onClick={triggerSpinBurst}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-zinc-300 hover:text-[#ff2a2a] transition-colors flex items-center gap-1"
            title="Spin 3D Workstation 360°"
          >
            <RotateCw className="w-3 h-3" />
            <span>Spin 360°</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
