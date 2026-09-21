import React, { useRef, useState, useCallback, ReactNode, MouseEvent } from 'react';
import { useAnimation3D } from '../context/Animation3DContext';

export interface ThreeDTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees (default 12)
  perspective?: number; // Perspective in pixels (default 1000)
  scale?: number; // Scale on hover (default 1.02)
  glare?: boolean; // Enable interactive specular glare effect
  glareOpacity?: number; // Max opacity of the specular glare (default 0.25)
  speed?: number; // Transition speed in ms (default 400)
  gyroscope?: boolean;
}

/**
 * ThreeDTilt: Interactive 3D perspective card container.
 * Calculates precise rotateX, rotateY, and dynamic specular lighting
 * with hardware-accelerated CSS 3D transforms and translateZ depth.
 */
export const ThreeDTilt: React.FC<ThreeDTiltProps> = ({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  glareOpacity = 0.2,
  speed = 400,
}) => {
  const { is3DEnabled } = useAnimation3D();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<{
    rotateX: number;
    rotateY: number;
    scale: number;
  }>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const [glarePosition, setGlarePosition] = useState<{
    x: number;
    y: number;
    opacity: number;
  }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      if (!is3DEnabled) {
        setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;

      // Calculate tilt percentages from center (-1 to +1)
      const percentX = (x / width) * 2 - 1;
      const percentY = (y / height) * 2 - 1;

      // Note: moving mouse down tilts card backwards (-rotateX)
      const rotateX = -(percentY * maxTilt);
      const rotateY = percentX * maxTilt;

      setTransform({
        rotateX,
        rotateY,
        scale,
      });

      if (glare) {
        setGlarePosition({
          x: (x / width) * 100,
          y: (y / height) * 100,
          opacity: glareOpacity,
        });
      }
    },
    [is3DEnabled, maxTilt, scale, glare, glareOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
    setGlarePosition((prev) => ({
      ...prev,
      opacity: 0,
    }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
      }}
      className={`relative select-none ${className}`}
    >
      <div
        style={{
          transform: `perspective(${perspective}px) rotateX(${transform.rotateX.toFixed(
            2
          )}deg) rotateY(${transform.rotateY.toFixed(2)}deg) scale3d(${
            transform.scale
          }, ${transform.scale}, ${transform.scale})`,
          transition: isHovered
            ? 'transform 100ms ease-out'
            : `transform ${speed}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Specular 3D Glare Overlay */}
        {glare && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-30 transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 42, 42, 0.15) 30%, transparent 70%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>
    </div>
  );
};
