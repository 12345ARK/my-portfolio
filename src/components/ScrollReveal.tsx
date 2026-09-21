import React, { ReactNode } from 'react';
import { useScrollReveal, UseScrollRevealOptions } from '../hooks/useScrollReveal';
import { useAnimation3D } from '../context/Animation3DContext';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'blur-in'
  | 'tilt-3d-up'
  | 'tilt-3d-left'
  | 'tilt-3d-right'
  | 'flip-3d'
  | 'zoom-3d';

export interface ScrollRevealProps extends UseScrollRevealOptions {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number; // Milliseconds delay before starting reveal animation
  duration?: number; // Milliseconds duration of reveal transition
  className?: string;
  as?: React.ElementType;
  id?: string;
}

/**
 * ScrollReveal utility component:
 * Wraps sections or elements and triggers entrance animations
 * as they intersect the viewport during scrolling up or down.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 650,
  className = '',
  as: Component = 'div',
  id,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  once = false,
  onEnter,
  onLeave,
}) => {
  const { is3DEnabled } = useAnimation3D();
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
    onEnter,
    onLeave,
  });

  const getVariantStyles = (): { hidden: string; visible: string } => {
    // If 3D animations are disabled, fall back to clean 2D transitions
    const effectiveVariant = !is3DEnabled && variant.includes('3d') ? 'fade-up' : variant;

    switch (effectiveVariant) {
      case 'fade-up':
        return {
          hidden: 'opacity-0 translate-y-12',
          visible: 'opacity-100 translate-y-0',
        };
      case 'fade-down':
        return {
          hidden: 'opacity-0 -translate-y-12',
          visible: 'opacity-100 translate-y-0',
        };
      case 'fade-left':
        return {
          hidden: 'opacity-0 -translate-x-12',
          visible: 'opacity-100 translate-x-0',
        };
      case 'fade-right':
        return {
          hidden: 'opacity-0 translate-x-12',
          visible: 'opacity-100 translate-x-0',
        };
      case 'zoom-in':
        return {
          hidden: 'opacity-0 scale-95',
          visible: 'opacity-100 scale-100',
        };
      case 'blur-in':
        return {
          hidden: 'opacity-0 blur-sm scale-[0.98]',
          visible: 'opacity-100 blur-none scale-100',
        };
      case 'tilt-3d-up':
        return {
          hidden: 'opacity-0 [transform:rotateX(20deg)_translateY(40px)_translateZ(-40px)]',
          visible: 'opacity-100 [transform:rotateX(0deg)_translateY(0)_translateZ(0)]',
        };
      case 'tilt-3d-left':
        return {
          hidden: 'opacity-0 [transform:rotateY(-20deg)_translateX(-40px)_translateZ(-40px)]',
          visible: 'opacity-100 [transform:rotateY(0deg)_translateX(0)_translateZ(0)]',
        };
      case 'tilt-3d-right':
        return {
          hidden: 'opacity-0 [transform:rotateY(20deg)_translateX(40px)_translateZ(-40px)]',
          visible: 'opacity-100 [transform:rotateY(0deg)_translateX(0)_translateZ(0)]',
        };
      case 'flip-3d':
        return {
          hidden: 'opacity-0 [transform:rotateX(32deg)_scale(0.92)_translateZ(-30px)]',
          visible: 'opacity-100 [transform:rotateX(0deg)_scale(1)_translateZ(0)]',
        };
      case 'zoom-3d':
        return {
          hidden: 'opacity-0 [transform:translateZ(-100px)_scale(0.88)]',
          visible: 'opacity-100 [transform:translateZ(0)_scale(1)]',
        };
      default:
        return {
          hidden: 'opacity-0 translate-y-12',
          visible: 'opacity-100 translate-y-0',
        };
    }
  };

  const { hidden, visible } = getVariantStyles();

  return (
    <Component
      id={id}
      ref={ref}
      style={{
        ...(is3DEnabled ? { perspective: '1200px', transformStyle: 'preserve-3d' } : {}),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-all will-change-[transform,opacity] ${
        isVisible ? visible : hidden
      } ${className}`}
    >
      {children}
    </Component>
  );
};
