import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseScrollRevealOptions {
  /**
   * Proportion of element that must be visible before triggering (0.0 to 1.0).
   * Default: 0.12
   */
  threshold?: number;
  /**
   * Margin around the root element (e.g. '0px 0px -50px 0px').
   * Default: '0px 0px -40px 0px'
   */
  rootMargin?: string;
  /**
   * If true, observer unobserves after first reveal.
   * If false (default), triggers every time the section enters/leaves viewport when sliding up or down.
   */
  once?: boolean;
  /** Callback fired when element enters viewport */
  onEnter?: () => void;
  /** Callback fired when element leaves viewport */
  onLeave?: () => void;
}

/**
 * Custom React hook that utilizes the native IntersectionObserver API
 * to detect when elements enter or exit the viewport during scrolling,
 * dynamically applying reveal states.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T>, boolean] {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -40px 0px',
    once = false,
    onEnter,
    onLeave,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Safety fallback for server environments or browsers lacking IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      element.classList.add('reveal-active');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            element.classList.add('reveal-active');
            element.classList.remove('reveal-hidden');
            onEnter?.();

            if (once) {
              observer.unobserve(entry.target);
            }
          } else {
            if (!once) {
              setIsVisible(false);
              element.classList.remove('reveal-active');
              element.classList.add('reveal-hidden');
              onLeave?.();
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, onEnter, onLeave]);

  return [elementRef, isVisible];
}
