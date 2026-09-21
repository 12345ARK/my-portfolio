import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { Box, Sparkles, Layers, RotateCw } from 'lucide-react';

export const ThreeDCube: React.FC = () => {
  const [rotate, setRotate] = useState({ x: -20, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;

    const animate = () => {
      setRotate((prev) => ({
        x: prev.x + 0.25 * Math.sin(Date.now() / 2500),
        y: (prev.y + 0.6) % 360,
      }));
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotate, isDragging]);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotate((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.6)),
      y: (prev.y + deltaX * 0.6) % 360,
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const faces = [
    {
      label: 'React',
      iconClass: 'devicon-react-original text-cyan-400',
      transform: 'rotateY(0deg) translateZ(48px)',
      border: 'border-cyan-500/40',
      glow: 'rgba(6, 182, 212, 0.25)',
    },
    {
      label: 'TypeScript',
      iconClass: 'devicon-typescript-plain text-blue-400',
      transform: 'rotateY(90deg) translateZ(48px)',
      border: 'border-blue-500/40',
      glow: 'rgba(59, 130, 246, 0.25)',
    },
    {
      label: 'Node.js',
      iconClass: 'devicon-nodejs-plain text-emerald-400',
      transform: 'rotateY(180deg) translateZ(48px)',
      border: 'border-emerald-500/40',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      label: 'Python',
      iconClass: 'devicon-python-plain text-amber-400',
      transform: 'rotateY(-90deg) translateZ(48px)',
      border: 'border-amber-500/40',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    {
      label: 'Next / Vite',
      iconClass: 'devicon-vite-plain text-purple-400',
      transform: 'rotateX(90deg) translateZ(48px)',
      border: 'border-purple-500/40',
      glow: 'rgba(168, 85, 247, 0.25)',
    },
    {
      label: 'SQL & DB',
      iconClass: 'devicon-postgresql-plain text-rose-500',
      transform: 'rotateX(-90deg) translateZ(48px)',
      border: 'border-rose-500/40',
      glow: 'rgba(244, 63, 94, 0.25)',
    },
  ];

  return (
    <div
      className="flex flex-col items-center select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Scene Viewport */}
      <div
        className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center cursor-grab active:cursor-grabbing relative"
        style={{ perspective: '800px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Ambient Ring in 3D */}
        <div
          className="absolute w-36 h-36 rounded-full border border-[#ff2a2a]/20 pointer-events-none animate-spin"
          style={{
            animationDuration: '20s',
            transform: 'rotateX(75deg) translateZ(-20px)',
          }}
        />

        {/* 3D Cube Container */}
        <div
          style={{
            width: '96px',
            height: '96px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transition: isDragging ? 'none' : 'transform 100ms ease-out',
          }}
        >
          {faces.map((face, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '96px',
                height: '96px',
                transform: face.transform,
                boxShadow: `0 0 20px ${face.glow}`,
                backfaceVisibility: 'visible',
              }}
              className={`rounded-2xl border-2 ${face.border} bg-zinc-950/85 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center transition-colors shadow-2xl`}
            >
              <i className={`${face.iconClass} text-2xl sm:text-3xl mb-1 drop-shadow-md`} />
              <span className="text-[10px] font-bold text-white tracking-wider uppercase font-mono">
                {face.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Controls & Hint */}
      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
        <span className="inline-flex items-center gap-1 font-mono text-[#ff2a2a]">
          <Box className="w-3.5 h-3.5" /> 3D Stack Cube
        </span>
        <span className="text-zinc-600">•</span>
        <button
          type="button"
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className="hover:text-white transition-colors underline flex items-center gap-1 text-[11px]"
        >
          <RotateCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          {isAutoRotate ? 'Spinning' : 'Resume'}
        </button>
      </div>
    </div>
  );
};
