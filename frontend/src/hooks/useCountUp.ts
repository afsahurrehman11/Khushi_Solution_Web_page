import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating a number from 0 to a target value.
 * @param target The final number to count to.
 * @param duration The duration of the animation in milliseconds.
 * @param trigger A boolean that triggers the animation when it becomes true.
 * @returns The current animated value (integer).
 */
export function useCountUp(target: number, duration: number = 1500, trigger: boolean = true) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (trigger) {
        setCount(target);
      }
      return;
    }

    if (!trigger) return;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      const easedProgress = easeOutQuart(percentage);
      const currentCount = Math.floor(easedProgress * target);

      setCount(currentCount);

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration, trigger]);

  return count;
}
