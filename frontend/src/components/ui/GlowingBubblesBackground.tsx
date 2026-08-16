'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BubbleData {
  id: number;
  size: string;
  top: string;
  duration: number;
  delay: number;
  gradient: string;
  yCurve: number[];
}

interface Particle {
  x: number;
  y: number;
  size: string;
}

const bubbleConfig: BubbleData[] = [
  { id: 1,  size: 'w-24 h-24 md:w-36 md:h-36', top: '4%',  duration: 28, delay: 0,    gradient: 'radial-gradient(circle, rgba(16,185,129,0.36) 0%, rgba(59,130,246,0.14) 55%, transparent 70%)', yCurve: [0, -20, 14, -16, 0] },
  { id: 2,  size: 'w-18 h-18 md:w-28 md:h-28', top: '10%', duration: 30, delay: 5.0,  gradient: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(99,102,241,0.12) 55%, transparent 70%)', yCurve: [0, -16, 20, -14, 0] },
  { id: 3,  size: 'w-28 h-28 md:w-40 md:h-40', top: '18%', duration: 32, delay: 11.0, gradient: 'radial-gradient(circle, rgba(16,185,129,0.34) 0%, rgba(6,182,212,0.14) 55%, transparent 70%)', yCurve: [0, -22, 16, -18, 0] },
  { id: 4,  size: 'w-14 h-14 md:w-22 md:h-22', top: '25%', duration: 27, delay: 16.5, gradient: 'radial-gradient(circle, rgba(59,130,246,0.36) 0%, rgba(16,185,129,0.15) 60%, transparent 70%)', yCurve: [0, 16, -20, 14, 0] },
  { id: 5,  size: 'w-20 h-20 md:w-32 md:h-32', top: '32%', duration: 31, delay: 2.0,  gradient: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(59,130,246,0.12) 55%, transparent 70%)', yCurve: [0, -18, 14, -16, 0] },
  { id: 6,  size: 'w-24 h-24 md:w-36 md:h-36', top: '39%', duration: 33, delay: 8.0,  gradient: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(20,184,166,0.14) 55%, transparent 70%)', yCurve: [0, -20, 18, -14, 0] },
  { id: 7,  size: 'w-16 h-16 md:w-24 md:h-24', top: '46%', duration: 29, delay: 14.0, gradient: 'radial-gradient(circle, rgba(59,130,246,0.36) 0%, rgba(16,185,129,0.14) 55%, transparent 70%)', yCurve: [0, -18, 16, -14, 0] },
  { id: 8,  size: 'w-28 h-28 md:w-42 md:h-42', top: '53%', duration: 34, delay: 1.0,  gradient: 'radial-gradient(circle, rgba(16,185,129,0.36) 0%, rgba(59,130,246,0.14) 55%, transparent 70%)', yCurve: [0, -22, 16, -18, 0] },
  { id: 9,  size: 'w-14 h-14 md:w-20 md:h-20', top: '60%', duration: 27, delay: 6.5,  gradient: 'radial-gradient(circle, rgba(59,130,246,0.38) 0%, rgba(20,184,166,0.15) 60%, transparent 70%)', yCurve: [0, 18, -20, 14, 0] },
  { id: 10, size: 'w-20 h-20 md:w-32 md:h-32', top: '67%', duration: 31, delay: 12.0, gradient: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(99,102,241,0.12) 55%, transparent 70%)', yCurve: [0, -16, 18, -14, 0] },
  { id: 11, size: 'w-24 h-24 md:w-36 md:h-36', top: '75%', duration: 32, delay: 17.5, gradient: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(20,184,166,0.14) 55%, transparent 70%)', yCurve: [0, -20, 16, -18, 0] },
  { id: 12, size: 'w-16 h-16 md:w-24 md:h-24', top: '82%', duration: 28, delay: 4.0,  gradient: 'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(59,130,246,0.15) 60%, transparent 70%)', yCurve: [0, 16, -18, 12, 0] },
  { id: 13, size: 'w-22 h-22 md:w-34 md:h-34', top: '90%', duration: 30, delay: 10.0, gradient: 'radial-gradient(circle, rgba(20,184,166,0.38) 0%, rgba(6,182,212,0.15) 60%, transparent 70%)', yCurve: [0, -18, 16, -14, 0] },
];

function generateRandomBurst(): Particle[] {
  const count = 5 + Math.floor(Math.random() * 3);
  const sizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5', 'w-6 h-6'];
  const result: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 35;
    result.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: sizes[Math.floor(Math.random() * sizes.length)],
    });
  }
  return result;
}

function InteractiveBubble({ b }: { b: BubbleData }) {
  const [isPopped, setIsPopped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const isPoppedRef = useRef(false);

  const triggerBurst = useCallback(() => {
    if (isPoppedRef.current) return;
    isPoppedRef.current = true;
    setParticles(generateRandomBurst());
    setIsPopped(true);
  }, []);

  useEffect(() => {
    const handleGlobalPointer = (e: MouseEvent | TouchEvent) => {
      if (isPoppedRef.current || !bubbleRef.current) return;

      const clientX = 'touches' in e ? (e as TouchEvent).touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0]?.clientY : (e as MouseEvent).clientY;

      if (clientX === undefined || clientY === undefined) return;

      const rect = bubbleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(clientX - centerX, clientY - centerY);

      // Trigger burst instantly if pointer comes within 70px of bubble center!
      if (dist < 70) {
        triggerBurst();
      }
    };

    window.addEventListener('mousemove', handleGlobalPointer, { passive: true });
    window.addEventListener('touchmove', handleGlobalPointer, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleGlobalPointer);
      window.removeEventListener('touchmove', handleGlobalPointer);
    };
  }, [triggerBurst]);

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer z-30"
      style={{
        top: b.top,
        left: '-180px',
        willChange: 'transform',
      }}
      animate={{
        x: ['-10vw', '112vw'],
        y: b.yCurve,
      }}
      transition={{
        x: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay },
        y: { duration: b.duration / 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      }}
    >
      <div
        ref={bubbleRef}
        onPointerEnter={triggerBurst}
        onPointerOver={triggerBurst}
        onTouchStart={triggerBurst}
        className="relative flex items-center justify-center min-w-[72px] min-h-[72px] p-4 group"
      >
        <AnimatePresence>
          {!isPopped ? (
            <motion.div
              key="main"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              whileHover={{ scale: 1.25 }}
              transition={{ duration: 0.05 }}
              className={`relative rounded-full ${b.size}`}
              style={{ background: b.gradient }}
            >
              <div 
                className="absolute inset-0 rounded-full border border-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"
              />
            </motion.div>
          ) : (
            <motion.div
              key="particles"
              initial={{ scale: 0.8, opacity: 1, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 45 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.05 }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  isPoppedRef.current = false;
                  setIsPopped(false);
                }, 1200);
              }}
              className="relative w-28 h-28 flex items-center justify-center"
            >
              {particles.map((pt, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                  animate={{ x: pt.x, y: pt.y, opacity: 0.9, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                  className={`absolute rounded-full ${pt.size} shadow-sm`}
                  style={{ background: b.gradient }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function GlowingBubblesBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
      }}
    >
      {bubbleConfig.map((b) => (
        <InteractiveBubble key={b.id} b={b} />
      ))}
    </div>
  );
}
