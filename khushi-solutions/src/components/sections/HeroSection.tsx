'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

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
  const { scrollTo } = useSmoothScroll();

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

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo('#contact');
  };
  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo('#products');
  };

  return (
    <section
      id="hero"
      ref={bgRef}
      className="relative pt-28 lg:pt-32 pb-14 lg:pb-20 overflow-hidden"
    >
      <div className="container-main relative z-10">
        {/* Strict mobile stacking: flex-col-reverse ensures text is below carousel on mobile, or standard 2-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full py-2 flex-col-reverse lg:flex-row flex lg:grid">

          {/* LEFT — Text + CTA */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-start w-full">
            {/* Eyebrow */}
            <motion.span
              variants={fadeLeft}
              className="eyebrow-pill"
            >
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              KHUSHI SOLUTIONS
            </motion.span>

            <motion.h1
              variants={fadeLeft}
              className="mb-5 text-text-primary"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', /* Fluid typography scaling down for mobile */
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Software That Runs{' '}
              <span style={{
                background: 'linear-gradient(135deg, #059669 0%, #2C64B4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Real Businesses.
              </span>
            </motion.h1>

            <motion.p variants={fadeLeft} className="text-body-lg mb-8 max-w-[480px] text-text-secondary">
              Delivery platforms and school management systems — built and proven in production.
            </motion.p>

            <motion.div variants={fadeLeft} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="#products" onClick={handleProductClick}
                className="btn-primary-gradient inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-full w-full sm:w-auto">
                See Our Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#contact" onClick={handleContactClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-text-primary hover:bg-slate-200/50 rounded-full transition-colors w-full sm:w-auto"
                style={{ border: '1px solid var(--color-border)' }}>
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
            {/* Outer Neumorphic frame */}
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-white"
              style={{
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Browser chrome bar - Light mode */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-border">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-xs ml-2 font-mono font-medium text-text-muted">
                  {frame.label}
                </span>
              </div>

              {/* STRICT 16/9 aspect-video bounding box — all images forced to fit */}
              <div className="relative w-full aspect-video bg-slate-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFrame}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
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
            <div className="flex items-center justify-between mt-5 px-1">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {carouselFrames.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === currentFrame ? '24px' : '8px',
                      height: '8px',
                      background: i === currentFrame ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  />
                ))}
              </div>

              {/* Arrow buttons - Light mode styling */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-slate-100 text-text-primary bg-white shadow-sm border border-border"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-slate-100 text-text-primary bg-white shadow-sm border border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
