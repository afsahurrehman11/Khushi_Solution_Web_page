'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const cursorX = useSpring(-100, { stiffness: 1000, damping: 50, mass: 0.1 });
  const cursorY = useSpring(-100, { stiffness: 1000, damping: 50, mass: 0.1 });
  
  const outerCursorX = useSpring(-100, { stiffness: 400, damping: 28, mass: 0.2 });
  const outerCursorY = useSpring(-100, { stiffness: 400, damping: 28, mass: 0.2 });

  useEffect(() => {
    setIsMounted(true);
    // Explicitly check for fine pointers (mouse) to prevent rendering on touch devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      outerCursorX.set(e.clientX);
      outerCursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [isPointerFine, cursorX, cursorY, outerCursorX, outerCursorY]);

  // Don't render anything on touch devices or during SSR
  if (!isMounted || !isPointerFine) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Spring Circle - Sleeker, balanced size with responsive spring physics */}
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 border-[1.5px] border-emerald-500/60 rounded-full flex items-center justify-center"
        style={{
          x: outerCursorX,
          y: outerCursorY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.05) 100%)',
          boxShadow: '0 0 8px rgba(16,185,129,0.2)',
        }}
      />
      
      {/* Inner zero-latency dot - Solid slate/dark blue to contrast well on Pearl */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 bg-text-primary rounded-full mix-blend-multiply"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
}
