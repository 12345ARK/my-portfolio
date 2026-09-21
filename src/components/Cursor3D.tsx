import React, { useEffect, useRef, useState } from 'react';
import { useAnimation3D } from '../context/Animation3DContext';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export const Cursor3D: React.FC = () => {
  const { is3DEnabled } = useAnimation3D();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const gimbalRef = useRef<HTMLDivElement | null>(null);
  const polyRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Position & Velocity tracking
  const posRef = useRef({
    currentX: -100,
    currentY: -100,
    targetX: -100,
    targetY: -100,
    trailX: -100,
    trailY: -100,
    polyX: -100,
    polyY: -100,
    vx: 0,
    vy: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  const particlesRef = useRef<Particle3D[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable if 3D animations are toggled off or on touch devices
    if (!is3DEnabled || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const dx = e.clientX - posRef.current.targetX;
      const dy = e.clientY - posRef.current.targetY;
      posRef.current.vx = dx;
      posRef.current.vy = dy;

      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      // Spawn glowing 3D trail particles on movement
      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 2) {
        const count = Math.min(Math.floor(speed / 6) + 1, 3);
        const palette = ['#ff2a2a', '#ff5959', '#ff8585', '#06b6d4', '#ffffff'];

        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            z: Math.random() * 20 - 10,
            vx: -dx * 0.12 + (Math.random() - 0.5) * 1.5,
            vy: -dy * 0.12 + (Math.random() - 0.5) * 1.5,
            vz: (Math.random() - 0.5) * 1.2,
            size: 2.2 + Math.random() * 2.8,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0.85,
            decay: 0.02 + Math.random() * 0.025,
          });
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Spawn radial 3D spark explosion
      const sparkCount = 18;
      const colors = ['#ff2a2a', '#ffffff', '#ff6b6b', '#06b6d4'];
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.3;
        const force = 3.5 + Math.random() * 4.5;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          alpha: 1.0,
          color: colors[i % colors.length],
          size: 2.5 + Math.random() * 2,
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect clickable elements for magnetic hover scale
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, textarea, select, [role="button"], [data-hover-3d]');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    // Render Animation Loop
    let angle = 0;
    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      angle += 0.04;

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer lerp
      posRef.current.currentX += (posRef.current.targetX - posRef.current.currentX) * 0.35;
      posRef.current.currentY += (posRef.current.targetY - posRef.current.currentY) * 0.35;

      // Trailing gimbal lerp
      posRef.current.trailX += (posRef.current.targetX - posRef.current.trailX) * 0.18;
      posRef.current.trailY += (posRef.current.targetY - posRef.current.trailY) * 0.18;

      // Trailing 3D polyhedron lerp (with elastic lag)
      posRef.current.polyX += (posRef.current.targetX - posRef.current.polyX) * 0.1;
      posRef.current.polyY += (posRef.current.targetY - posRef.current.polyY) * 0.1;

      // Velocity-based 3D rotation angles
      const targetRotX = Math.max(Math.min(-posRef.current.vy * 1.2, 45), -45);
      const targetRotY = Math.max(Math.min(posRef.current.vx * 1.2, 45), -45);
      posRef.current.rotX += (targetRotX - posRef.current.rotX) * 0.1;
      posRef.current.rotY += (targetRotY - posRef.current.rotY) * 0.1;
      posRef.current.rotZ += 0.03;

      // Update Cursor Elements in DOM with hardware accelerated 3D transforms
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.currentX}px, ${posRef.current.currentY}px, 0)`;
      }

      if (gimbalRef.current) {
        gimbalRef.current.style.transform = `translate3d(${posRef.current.trailX}px, ${posRef.current.trailY}px, 0) rotateX(${posRef.current.rotX * 0.6}deg) rotateY(${posRef.current.rotY * 0.6}deg) rotateZ(${angle * 15}deg)`;
      }

      if (polyRef.current) {
        polyRef.current.style.transform = `translate3d(${posRef.current.polyX}px, ${posRef.current.polyY}px, 0) rotateX(${posRef.current.rotX + angle * 25}deg) rotateY(${posRef.current.rotY + angle * 35}deg) rotateZ(${angle * 10}deg)`;
      }

      // 1. Draw 3D Particle Ribbon Trail on Canvas
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Perspective 3D depth scale
        const scale = Math.max(0.4, (p.z + 50) / 50);
        const radius = p.size * scale;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Click Sparks on Canvas
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.alpha -= 0.035;

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [isVisible, is3DEnabled]);

  if (!is3DEnabled) {
    return null;
  }

  return (
    <div
      id="cursor-3d-root"
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 3D Particle Trail & Sparks Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* 1. Micro Center Laser Dot */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isClicking
              ? 'w-4 h-4 bg-white shadow-lg shadow-white'
              : isHovered
              ? 'w-3 h-3 bg-cyan-400 shadow-md shadow-cyan-400/80'
              : 'w-2 h-2 bg-[#ff2a2a] shadow-md shadow-[#ff2a2a]'
          }`}
        />
      </div>

      {/* 2. Concentric 3D Gimbal Reticle Ring with HUD Tick Marks */}
      <div
        ref={gimbalRef}
        style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
      >
        <div
          className={`relative rounded-full border border-dashed transition-all duration-300 flex items-center justify-center ${
            isHovered
              ? 'w-12 h-12 border-cyan-400/70 bg-cyan-500/10 shadow-lg shadow-cyan-500/30 scale-125'
              : isClicking
              ? 'w-7 h-7 border-white/80 bg-[#ff2a2a]/30 shadow-xl shadow-[#ff2a2a]/60 scale-90'
              : 'w-9 h-9 border-[#ff2a2a]/50 bg-[#ff2a2a]/5 shadow-md shadow-[#ff2a2a]/20'
          }`}
        >
          {/* Subtle Crosshair Ticks */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0.5 h-1.5 bg-[#ff2a2a]/70" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-0.5 h-1.5 bg-[#ff2a2a]/70" />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-0.5 bg-[#ff2a2a]/70" />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1.5 h-0.5 bg-[#ff2a2a]/70" />
        </div>
      </div>

      {/* 3. Trailing 3D Polyhedron / Floating Holographic Diamond */}
      <div
        ref={polyRef}
        style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
      >
        <div
          style={{ transformStyle: 'preserve-3d' }}
          className={`relative transition-all duration-300 ${
            isHovered ? 'w-6 h-6 scale-125' : 'w-4 h-4'
          }`}
        >
          {/* 3D Wireframe Cube/Diamond Faces */}
          <div
            style={{ transform: 'rotateY(0deg) translateZ(8px)' }}
            className="absolute inset-0 border border-[#ff2a2a]/40 bg-[#ff2a2a]/5 rounded-sm"
          />
          <div
            style={{ transform: 'rotateY(90deg) translateZ(8px)' }}
            className="absolute inset-0 border border-cyan-400/40 bg-cyan-500/5 rounded-sm"
          />
          <div
            style={{ transform: 'rotateX(90deg) translateZ(8px)' }}
            className="absolute inset-0 border border-[#ff6b6b]/40 bg-[#ff6b6b]/5 rounded-sm"
          />
        </div>
      </div>
    </div>
  );
};
