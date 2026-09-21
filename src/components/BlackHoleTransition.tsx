import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { useAnimation3D } from '../context/Animation3DContext';

interface WarpContextType {
  warpTo: (targetSelectorOrId: string, customLabel?: string) => void;
  isWarping: boolean;
}

const WarpContext = createContext<WarpContextType>({
  warpTo: () => {},
  isWarping: false,
});

export const useBlackHoleWarp = () => useContext(WarpContext);

interface Particle {
  angle: number;
  distance: number;
  speed: number;
  radialVelocity: number;
  angularVelocity: number;
  size: number;
  color: string;
  alpha: number;
  trailLength: number;
  jet?: boolean;
  jetAxis?: number; // 1 for north jet, -1 for south jet
  jetDistance?: number;
}

interface BlastWave {
  delayMs: number;
  maxRadiusMultiplier: number;
  baseWidth: number;
  leadColor: string;
  trailColor: string;
  chromaticOffset: number;
  distortion: number;
}

/**
 * BlackHoleTransition:
 * Accurate astrophysical transition simulating a General Relativistic
 * Schwarzschild Black Hole Infall, Planck-scale Quantum Inversion,
 * and White Hole Cosmic Emergence.
 */
export const BlackHoleTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { is3DEnabled } = useAnimation3D();
  const [isWarping, setIsWarping] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'infall' | 'bounce' | 'whitehole'>('idle');
  const [targetLabel, setTargetLabel] = useState<string>('');
  const [portalPercent, setPortalPercent] = useState<number>(0);
  const [flashOpacity, setFlashOpacity] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Accurate target scrolling with navigation bar height offset
  const scrollToTargetAccurately = useCallback((selector: string) => {
    const targetEl = document.querySelector(selector) as HTMLElement | null;
    if (!targetEl) return;

    if (selector === '#home') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const navbar = document.getElementById('navbar');
    const navHeight = navbar ? navbar.getBoundingClientRect().height : 70;
    const rect = targetEl.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - navHeight - 14;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'auto',
    });
  }, []);

  const warpTo = useCallback(
    (targetSelectorOrId: string, customLabel?: string) => {
      const selector = targetSelectorOrId.startsWith('#')
        ? targetSelectorOrId
        : `#${targetSelectorOrId}`;

      const targetEl = document.querySelector(selector) as HTMLElement | null;
      if (!targetEl) {
        console.warn(`Target element "${selector}" not found`);
        return;
      }

      const label =
        customLabel ||
        selector.replace('#', '').toUpperCase() ||
        'COORDINATES';
      setTargetLabel(label);

      // If 3D is disabled, perform instant clean smooth scroll
      if (!is3DEnabled) {
        scrollToTargetAccurately(selector);
        return;
      }

      // Initiate Relativistic Infall
      setIsWarping(true);
      setPhase('infall');
      setPortalPercent(0);
      setFlashOpacity(0);
      startTimeRef.current = performance.now();

      // Timeline of Astrophysical Events:
      // 0 - 380ms: Gravitational Infall & Event Horizon Swirl
      // 380ms - 440ms: Planck Bounce / Quantum Inversion (Page silently snaps behind the flash)
      // 440ms - 960ms: White Hole Cosmic Expansion & Radial Portal Unveiling
      // 980ms: Complete Warp Transition

      setTimeout(() => {
        setPhase('bounce');
        setFlashOpacity(1);
        // Silently reposition document to target section behind the singularity veil
        scrollToTargetAccurately(selector);
      }, 380);

      setTimeout(() => {
        setPhase('whitehole');
        setFlashOpacity(0);
      }, 440);

      setTimeout(() => {
        setIsWarping(false);
        setPhase('idle');
        setPortalPercent(100);
      }, 980);
    },
    [is3DEnabled, scrollToTargetAccurately]
  );

  // Global anchor interceptor for seamless blackhole transitions
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const destination = document.querySelector(href);
        if (destination) {
          e.preventDefault();
          const label = target.textContent?.trim() || href.replace('#', '').toUpperCase();
          warpTo(href, label);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [warpTo]);

  // Main Canvas Astrophysical Simulation
  useEffect(() => {
    if (!isWarping || !is3DEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const cx = width / 2;
    const cy = height / 2;
    const cornerDistance = Math.sqrt(cx * cx + cy * cy);
    const maxCosmicRadius = cornerDistance * 1.15;

    // Relativistic particles collection
    const particleCount = 200;
    const colors = [
      '#ffffff',
      '#fff1f1',
      '#ff3b3b',
      '#ff6b35',
      '#ffa100',
      '#c084fc',
      '#38bdf8',
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const isJet = i < 30;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (maxCosmicRadius * 0.8) + 30;
      return {
        angle,
        distance,
        speed: Math.random() * 8 + 6,
        radialVelocity: 0,
        angularVelocity: (Math.random() * 0.08 + 0.035) * (Math.random() > 0.4 ? 1 : -1),
        size: Math.random() * 2.6 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        trailLength: Math.random() * 20 + 10,
        jet: isJet,
        jetAxis: Math.random() > 0.5 ? 1 : -1,
        jetDistance: Math.random() * 50,
      };
    });

    // Multi-layer shockwave wavefronts with chromatic dispersion
    const shockwaves: BlastWave[] = [
      { delayMs: 0, maxRadiusMultiplier: 1.35, baseWidth: 8, leadColor: '#ffffff', trailColor: '#67e8f9', chromaticOffset: 6, distortion: 14 },
      { delayMs: 40, maxRadiusMultiplier: 1.2, baseWidth: 16, leadColor: '#ff4d4d', trailColor: '#ff8800', chromaticOffset: -5, distortion: 10 },
      { delayMs: 90, maxRadiusMultiplier: 1.05, baseWidth: 24, leadColor: '#ff2a2a', trailColor: '#c084fc', chromaticOffset: 8, distortion: 6 },
      { delayMs: 150, maxRadiusMultiplier: 0.9, baseWidth: 32, leadColor: '#ff9900', trailColor: '#38bdf8', chromaticOffset: -4, distortion: 4 },
    ];

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;

      // Temporal Phases
      const isInfall = elapsed < 380;
      const isBounce = elapsed >= 380 && elapsed < 440;
      const isWhiteHole = elapsed >= 440;

      // Motion blur trailing accumulation
      ctx.fillStyle = isWhiteHole ? 'rgba(5, 5, 10, 0.28)' : 'rgba(3, 3, 6, 0.42)';
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // 1. ACCURATE GRAVITATIONAL INFALL (0 - 380ms)
      // ==========================================
      if (isInfall) {
        const norm = elapsed / 380;
        const horizonR = 36 + norm * 34;

        // Gravitational Spacetime Geodesics Grid
        ctx.save();
        ctx.strokeStyle = `rgba(255, 42, 42, ${0.16 * (1 - norm * 0.3)})`;
        ctx.lineWidth = 1;
        for (let r = 1; r <= 6; r++) {
          const gridR = horizonR + (r / 6) * (maxCosmicRadius * 0.55);
          ctx.beginPath();
          ctx.arc(cx, cy, gridR, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Relativistic Accretion Disk with Doppler Beaming
        const diskR = horizonR * 3.4;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(elapsed * 0.007);
        ctx.scale(1, 0.45); // Tilted orbital perspective

        // Base thermal accretion gradient
        const accGrad = ctx.createRadialGradient(0, 0, horizonR * 0.8, 0, 0, diskR);
        accGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        accGrad.addColorStop(0.24, 'rgba(255, 55, 55, 0.95)');
        accGrad.addColorStop(0.55, 'rgba(255, 140, 20, 0.7)');
        accGrad.addColorStop(0.85, 'rgba(168, 85, 247, 0.25)');
        accGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = accGrad;
        ctx.beginPath();
        ctx.arc(0, 0, diskR, 0, Math.PI * 2);
        ctx.fill();

        // Doppler Boost: Approaching limb (left side) is boosted and blueshifted
        const dopplerGrad = ctx.createLinearGradient(-diskR, 0, diskR, 0);
        dopplerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        dopplerGrad.addColorStop(0.35, 'rgba(255, 130, 130, 0.32)');
        dopplerGrad.addColorStop(0.7, 'rgba(120, 20, 20, 0.12)');
        dopplerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');

        ctx.fillStyle = dopplerGrad;
        ctx.beginPath();
        ctx.arc(0, 0, diskR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Einstein Ring & Photon Sphere (Gravitational Light Deflection at 1.5 Rs)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, horizonR * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 230, 190, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ff3b3b';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();

        // Event Horizon Singularity Void
        ctx.beginPath();
        ctx.arc(cx, cy, horizonR, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.strokeStyle = '#ff2a2a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Matter Suction Spiral Particles
        particles.forEach((p) => {
          const gravityBoost = 1 + (maxCosmicRadius / (p.distance + 15)) * 0.45;
          p.distance -= p.speed * gravityBoost;
          p.angle += p.angularVelocity * (1 + 95 / (p.distance + 10));

          if (p.distance <= horizonR * 0.8) {
            p.distance = maxCosmicRadius * (0.8 + Math.random() * 0.3);
            p.angle = Math.random() * Math.PI * 2;
          }

          const px = cx + Math.cos(p.angle) * p.distance;
          const py = cy + Math.sin(p.angle) * p.distance;

          const trailLen = Math.min(32, (maxCosmicRadius - p.distance) * 0.1);
          const trailAngle = p.angle + Math.PI;
          const tx = px + Math.cos(trailAngle) * trailLen;
          const ty = py + Math.sin(trailAngle) * trailLen;

          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tx, ty);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ==========================================
      // 2. QUANTUM BOUNCE / INVERSION (380 - 440ms)
      // ==========================================
      if (isBounce) {
        const bounceElapsed = elapsed - 380;
        const bounceNorm = bounceElapsed / 60; // 0 to 1

        const flashR = 85 + Math.sin(bounceNorm * Math.PI) * 140;
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        flashGrad.addColorStop(0.3, 'rgba(255, 190, 190, 0.95)');
        flashGrad.addColorStop(0.7, 'rgba(255, 42, 42, 0.65)');
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, flashR * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      // ==========================================
      // 3. REALISTIC WHITE HOLE EMERGENCE (440 - 980ms)
      // ==========================================
      if (isWhiteHole) {
        const whElapsed = elapsed - 440;
        const totalWHDuration = 540;
        const progressWH = Math.min(1, whElapsed / totalWHDuration);

        // Relativistic cosmological expansion curve
        const blastExpansion = 1 - Math.pow(1 - progressWH, 2.8);
        const currentApertureRadius = blastExpansion * maxCosmicRadius * 1.35;
        const currentAperturePercent = (currentApertureRadius / cornerDistance) * 100;
        setPortalPercent(currentAperturePercent);

        // White Hole Photosphere (Fading as blast disperses)
        const coreR = Math.max(0, 95 * (1 - progressWH));
        if (coreR > 1) {
          const whGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
          whGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          whGrad.addColorStop(0.25, 'rgba(255, 200, 180, 0.85)');
          whGrad.addColorStop(0.6, 'rgba(255, 42, 42, 0.45)');
          whGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = whGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bipolar Relativistic Synchrotron Plasma Jets (Violent Ejection along Polar Axis)
        const jetLength = maxCosmicRadius * 1.5 * blastExpansion;
        const jetAlpha = Math.max(0, 1 - progressWH * 1.15);

        if (jetAlpha > 0.02) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4 + Math.sin(whElapsed * 0.025) * 0.04);

          [-1, 1].forEach((dir) => {
            const jetGrad = ctx.createLinearGradient(0, 0, 0, dir * jetLength);
            jetGrad.addColorStop(0, `rgba(255, 255, 255, ${jetAlpha})`);
            jetGrad.addColorStop(0.18, `rgba(255, 200, 200, ${jetAlpha * 0.95})`);
            jetGrad.addColorStop(0.45, `rgba(255, 42, 42, ${jetAlpha * 0.75})`);
            jetGrad.addColorStop(0.8, `rgba(168, 85, 247, ${jetAlpha * 0.4})`);
            jetGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = jetGrad;
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(5, 0);
            ctx.lineTo(26, dir * jetLength);
            ctx.lineTo(-26, dir * jetLength);
            ctx.closePath();
            ctx.fill();

            // Periodic Relativistic Mach Knots (Shock Diamonds)
            const knotCount = 5;
            for (let k = 1; k <= knotCount; k++) {
              const kDist = (k / (knotCount + 1)) * jetLength * dir;
              const kSize = 7 + k * 3;
              ctx.fillStyle = `rgba(255, 255, 255, ${jetAlpha * 0.9})`;
              ctx.beginPath();
              ctx.ellipse(0, kDist, kSize, kSize * 0.38, 0, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          ctx.restore();
        }

        // Multi-Layer Blast Shockwaves with Chromatic Dispersion
        shockwaves.forEach((sw) => {
          const waveElapsed = Math.max(0, whElapsed - sw.delayMs);
          const waveProgress = Math.min(1, waveElapsed / (totalWHDuration * 0.85));
          const waveEase = 1 - Math.pow(1 - waveProgress, 2.5);
          const currentR = waveEase * cornerDistance * sw.maxRadiusMultiplier;
          const waveAlpha = Math.max(0, (1 - waveProgress) * 0.95);

          if (waveAlpha > 0.01 && currentR > 10) {
            ctx.save();

            // 1. Primary Shock Wavefront Ring
            ctx.lineWidth = sw.baseWidth * (1 - waveProgress * 0.65);
            ctx.strokeStyle = sw.leadColor;
            ctx.globalAlpha = waveAlpha;
            ctx.shadowColor = sw.leadColor;
            ctx.shadowBlur = 24 * (1 - waveProgress);

            ctx.beginPath();
            ctx.arc(cx, cy, currentR, 0, Math.PI * 2);
            ctx.stroke();

            // 2. Trailing Chromatic Dispersion Fringe (Blueshift / Redshift split)
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = sw.trailColor;
            ctx.globalAlpha = waveAlpha * 0.75;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(0, currentR + sw.chromaticOffset), 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
          }
        });

        // Relativistic Expelled Matter Particles (Violent Outward Ejection)
        particles.forEach((p) => {
          p.distance += p.speed * 3.4 * (1 + whElapsed / 180);
          p.angle += p.angularVelocity * 0.25;

          const px = cx + Math.cos(p.angle) * p.distance;
          const py = cy + Math.sin(p.angle) * p.distance;
          const particleAlpha = Math.max(0, 1 - progressWH * 1.15);

          if (particleAlpha > 0.02) {
            const streakLen = Math.min(50, p.speed * 6);
            const tx = px - Math.cos(p.angle) * streakLen;
            const ty = py - Math.sin(p.angle) * streakLen;

            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * (1 - progressWH * 0.45);
            ctx.globalAlpha = particleAlpha;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(tx, ty);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, p.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        });
      }

      if (elapsed < 980) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [isWarping, is3DEnabled]);

  return (
    <WarpContext.Provider value={{ warpTo, isWarping }}>
      {/* 
        Child DOM remains intact without broken transforms on fixed elements.
        The reveal is handled via the full-screen optical spacetime aperture overlay!
      */}
      {children}

      {/* Relativistic Spacetime Overlay & White Hole Portal Mask */}
      {isWarping && is3DEnabled && (
        <div
          id="blackhole-transition-overlay"
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            perspective: '1200px',
            // During White Hole expansion, the center turns transparent in an expanding circle,
            // revealing the newly arrived destination section in pristine clarity!
            ...(phase === 'whitehole'
              ? {
                  maskImage: `radial-gradient(circle at center, transparent ${Math.max(
                    0,
                    portalPercent - 18
                  )}%, rgba(0,0,0,0.4) ${portalPercent - 6}%, black ${portalPercent + 12}%)`,
                  WebkitMaskImage: `radial-gradient(circle at center, transparent ${Math.max(
                    0,
                    portalPercent - 18
                  )}%, rgba(0,0,0,0.4) ${portalPercent - 6}%, black ${portalPercent + 12}%)`,
                }
              : {}),
          }}
        >
          {/* Canvas Relativistic Simulation */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Searing Planck Bounce Flash */}
          {phase === 'bounce' && (
            <div
              className="absolute inset-0 bg-white pointer-events-none"
              style={{ opacity: flashOpacity * 0.9 }}
            />
          )}

          {/* Real-time Relativistic Telemetry HUD */}
          <div className="relative z-50 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
            {phase === 'infall' && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-150">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/90 border border-[#ff2a2a]/70 shadow-[0_0_24px_rgba(255,42,42,0.7)] mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping" />
                  <span className="text-[11px] font-mono tracking-widest text-[#ff6b6b] uppercase">
                    GRAVITATIONAL INFALL
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_16px_rgba(255,42,42,0.9)] flex items-center gap-2">
                  <span className="text-[#ff2a2a]">&gt;&gt;</span>
                  <span>APPROACHING {targetLabel}</span>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 mt-1 tracking-widest opacity-85">
                  EVENT HORIZON CROSSING • REDSHIFT z &rarr; &infin;
                </p>
              </div>
            )}

            {phase === 'bounce' && (
              <div className="flex flex-col items-center">
                <div className="px-3.5 py-1 rounded-full bg-black/95 border border-white text-[11px] font-mono tracking-widest text-white shadow-[0_0_28px_#ffffff] uppercase">
                  PLANCK BOUNCE • SPACETIME INVERSION
                </div>
              </div>
            )}

            {phase === 'whitehole' && (
              <div className="flex flex-col items-center animate-out fade-out duration-300">
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/85 border border-[#ff8800]/80 shadow-[0_0_28px_rgba(255,136,0,0.85)] mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-ping" />
                  <span className="text-[11px] font-mono tracking-widest text-[#ffc078] uppercase">
                    WHITE HOLE EMERGENCE
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_18px_rgba(255,170,0,0.95)] flex items-center gap-2">
                  <span className="text-[#ffaa00]">&gt;</span>
                  <span>MATERIALIZED: {targetLabel}</span>
                </div>
                <p className="text-[10px] font-mono text-zinc-300 mt-1 tracking-widest opacity-90">
                  EXPANSION FRONT v &asymp; 0.99c • SYNCHROTRON JETS
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </WarpContext.Provider>
  );
};
