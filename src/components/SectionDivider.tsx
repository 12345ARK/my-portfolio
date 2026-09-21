import React, { useEffect, useRef } from 'react';
import { useAnimation3D } from '../context/Animation3DContext';

export interface SectionDividerProps {
  id?: string;
  className?: string;
  variant?: 'cyber' | 'diamonds' | 'pulse' | 'portal';
  badgeText?: string;
  glowColor?: string; // e.g. '#ff2a2a'
}

/**
 * SectionDivider:
 * Decorative divider featuring subtle glowing gradient lines, 
 * a central 3D perspective beacon glyph, and floating glowing particle sparks
 * to visually separate major portfolio sections.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  id,
  className = '',
  variant = 'cyber',
  badgeText,
  glowColor = '#ff2a2a',
}) => {
  const { is3DEnabled } = useAnimation3D();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle floating particles canvas along the divider line
  useEffect(() => {
    if (!is3DEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 40);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 40;
    };

    window.addEventListener('resize', handleResize);

    // Particle spark objects
    const particleCount = 24;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      maxAlpha: Math.random() * 0.6 + 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      hueOffset: Math.random() * 20 - 10,
    }));

    let step = 0;
    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Distance from center attenuates alpha towards edge
        const distFromCenter = Math.abs(p.x - centerX);
        const centerFalloff = Math.max(0, 1 - distFromCenter / (width * 0.45));

        // Oscillate brightness
        const dynamicAlpha =
          (Math.sin(step * p.pulseSpeed) * 0.3 + 0.7) * p.maxAlpha * centerFalloff;

        if (dynamicAlpha > 0.05) {
          // Draw soft glowing spark
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 3
          );
          gradient.addColorStop(0, `rgba(255, 60, 60, ${dynamicAlpha})`);
          gradient.addColorStop(0.5, `rgba(255, 42, 42, ${dynamicAlpha * 0.6})`);
          gradient.addColorStop(1, 'rgba(255, 42, 42, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core bright white-red center
          ctx.fillStyle = `rgba(255, 230, 230, ${dynamicAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [is3DEnabled]);

  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full max-w-6xl mx-auto py-12 sm:py-16 px-4 flex items-center justify-center pointer-events-none select-none overflow-hidden ${className}`}
    >
      {/* Floating Canvas Particles */}
      {is3DEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85 z-10"
        />
      )}

      {/* Outer subtle glow corridor */}
      <div
        className="absolute w-3/4 h-12 bg-gradient-to-r from-transparent via-[#ff2a2a]/8 to-transparent blur-xl pointer-events-none"
      />

      {/* Main Base Structure */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Tapering Gradient Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-[#ff2a2a]/60" />

        {/* Left Secondary Diffuse Glow Line */}
        <div className="absolute left-0 right-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#ff2a2a]/20 to-[#ff2a2a]/40 blur-[1px]" />

        {/* Center 3D Dimensional Beacon */}
        <div className="relative mx-4 sm:mx-6 flex items-center justify-center z-20">
          {/* Radial Beacon Glow */}
          <div
            className="absolute w-12 h-12 rounded-full bg-[#ff2a2a]/20 blur-md animate-pulse"
            style={{ animationDuration: '3s' }}
          />

          {badgeText ? (
            /* Optional Badge Text Pill */
            <div className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d0d12] border border-[#ff2a2a]/40 text-[10px] font-mono uppercase tracking-widest text-zinc-300 shadow-lg shadow-black/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-ping" />
              <span>{badgeText}</span>
            </div>
          ) : variant === 'diamonds' ? (
            /* Diamond 3D Geometry */
            <div className="relative flex items-center gap-1.5">
              <span className="w-1 h-1 rotate-45 bg-[#ff2a2a]/40" />
              <div className="w-3.5 h-3.5 rotate-45 border border-[#ff2a2a] bg-[#0c0c12] shadow-md shadow-[#ff2a2a]/50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#ff2a2a] rounded-[1px]" />
              </div>
              <span className="w-1 h-1 rotate-45 bg-[#ff2a2a]/40" />
            </div>
          ) : variant === 'portal' ? (
            /* Portal Concentric Ring Geometry */
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-[#ff2a2a]/30 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                <div className="w-4 h-4 rounded-full border border-[#ff5252]/60 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white" />
                </div>
              </div>
            </div>
          ) : (
            /* Default Cyber Core Beacon */
            <div className="relative flex items-center gap-2">
              <span className="h-[1px] w-4 bg-gradient-to-r from-transparent to-[#ff2a2a]" />
              <div className="w-3 h-3 rotate-45 border border-[#ff2a2a] bg-[#0a0a0f] shadow-lg shadow-[#ff2a2a]/60 flex items-center justify-center transition-transform hover:rotate-90 duration-500">
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff]" />
              </div>
              <span className="h-[1px] w-4 bg-gradient-to-l from-transparent to-[#ff2a2a]" />
            </div>
          )}
        </div>

        {/* Right Tapering Gradient Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-zinc-800 to-[#ff2a2a]/60" />

        {/* Right Secondary Diffuse Glow Line */}
        <div className="absolute left-1/2 right-0 h-[2px] bg-gradient-to-l from-transparent via-[#ff2a2a]/20 to-[#ff2a2a]/40 blur-[1px]" />
      </div>
    </div>
  );
};
