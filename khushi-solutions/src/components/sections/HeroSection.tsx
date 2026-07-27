'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

const carouselFrames = [
  {
    label: 'Bites — Admin Dashboard',
    src: '/images/products/product-1/desktop/product-1-hero-desktop.webp',
    accent: '#10b981',
  },
  {
    label: 'Bites — Mobile App',
    src: '/images/products/product-1/mobile/product-1-hero-mobile.webp',
    accent: '#10b981',
  },
  {
    label: 'Khushi SMS — Dashboard',
    src: '/images/products/product-2/desktop/product-2-hero-desktop.webp',
    accent: '#2C64B4',
  },
  {
    label: 'Khushi SMS — Parent App',
    src: '/images/products/product-2/mobile/product-2-hero-mobile.webp',
    accent: '#2C64B4',
  },
];

export default function HeroSection() {
  const bgRef = useRef<HTMLElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* Mouse parallax */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!bgRef.current) return;
    const xPct = (e.clientX / window.innerWidth) * 30;
    const yPct = (e.clientY / window.innerHeight) * 20;
    bgRef.current.style.backgroundPosition = `${xPct}% ${yPct}%`;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  /* Auto-play */
  useEffect(() => {
    if (!isAutoPlaying) return;
    autoPlayRef.current = setTimeout(() => {
      setCurrentFrame((prev) => (prev + 1) % carouselFrames.length);
    }, 3800);
    return () => clearTimeout(autoPlayRef.current);
  }, [currentFrame, isAutoPlaying]);

  const goTo = (idx: number) => {
    setIsAutoPlaying(false);
    setCurrentFrame(idx);
    // Resume auto-play after 6s of inactivity
    clearTimeout(autoPlayRef.current);
    autoPlayRef.current = setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const prev = () => goTo((currentFrame - 1 + carouselFrames.length) % carouselFrames.length);
  const next = () => goTo((currentFrame + 1) % carouselFrames.length);

  const frame = carouselFrames[currentFrame];

  return (
    <section
      id="hero"
      ref={bgRef}
      className="relative section-full pt-[72px] overflow-hidden"
      style={{ backgroundPosition: '15% 50%' }}
    >
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid pointer-events-none" aria-hidden="true" />

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/5 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(29,78,216,0.09) 0%, transparent 70%)' }} aria-hidden="true" />

      <div className="container-main relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full py-16 lg:py-0">

          {/* LEFT — Text + CTA */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-start">
            {/* Eyebrow */}
            <motion.span
              variants={fadeLeft}
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#34d399',
                letterSpacing: '0.12em',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              KHUSHI SOLUTIONS
            </motion.span>

            <motion.h1
              variants={fadeLeft}
              className="text-white mb-5"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2.6rem, 5.5vw, 4.25rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
              }}
            >
              Software That Runs{' '}
              <span style={{
                background: 'linear-gradient(135deg, #34d399 0%, #2C64B4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Real Businesses.
              </span>
            </motion.h1>

            <motion.p variants={fadeLeft} className="text-base mb-8 max-w-[460px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.68)' }}>
              Delivery platforms and school management systems — built and proven in production.
            </motion.p>

            <motion.div variants={fadeLeft} className="flex flex-col sm:flex-row gap-3">
              <Link href="#products"
                className="btn-primary-gradient inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full">
                See Our Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white rounded-full transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Fixed-ratio carousel with manual nav */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="relative w-full"
          >
            {/* Outer frame with accent border */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${frame.accent}30`,
                boxShadow: `0 0 0 1px ${frame.accent}15, 0 24px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-4 py-2.5"
                style={{ background: 'rgba(4,10,28,0.9)', borderBottom: `1px solid ${frame.accent}20` }}>
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="text-xs ml-2 font-mono font-medium" style={{ color: frame.accent, opacity: 0.8 }}>
                  {frame.label}
                </span>
              </div>

              {/* STRICT 16/9 bounding box — all images forced to fill this */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFrame}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={frame.src}
                      alt={frame.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={currentFrame === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Manual navigation — arrows + dots below the frame */}
            <div className="flex items-center justify-between mt-4 px-1">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {carouselFrames.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === currentFrame ? '24px' : '6px',
                      height: '6px',
                      background: i === currentFrame ? frame.accent : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
