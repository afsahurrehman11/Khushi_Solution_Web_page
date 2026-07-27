'use client';

import { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, Play, Pause, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductData } from '@/data/products';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function ProductDetailHero({ product }: { product: ProductData }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollTo } = useSmoothScroll();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const videoPoster = `/images/products/${product.id === 'bites' ? 'product-1' : 'product-2'}/desktop/${product.id === 'bites' ? 'product-1-hero-desktop' : 'product-2-hero-desktop'}.webp`;
  const videoSrc = `/videos/${product.id}-demo.mp4`;

  return (
    <section className="pt-20 lg:pt-24 pb-8 lg:pb-12 overflow-hidden relative">
      {/* High-Visibility Vibrant Top Back Button (Moved Upwards) */}
      <div className="absolute top-10 lg:top-12 left-4 sm:left-6 lg:left-12 z-40">
        <Link
          href="/"
          title="Back to Home"
          aria-label="Back to Home"
          className="w-11 h-11 rounded-full text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          style={{
            background: accentColor,
            boxShadow: `0 6px 20px ${product.accent === 'blue' ? 'rgba(37,99,235,0.45)' : 'rgba(16,185,129,0.45)'}`,
          }}
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column — Eyebrow, Title, Premium Description Card, Tech Pills & CTA */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <span className="eyebrow-pill mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: accentColor }} />
              PRODUCT {product.number} — {product.category.toUpperCase()}
            </span>

            <h1 
              className="text-text-primary mb-5 font-extrabold tracking-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 4.8vw, 3.6rem)',
                lineHeight: 1.08,
              }}
            >
              {product.name}
            </h1>

            {/* Elevated & Premium Description Card */}
            <div 
              className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 mb-6 shadow-sm relative overflow-hidden w-full"
              style={{
                borderLeft: `4px solid ${accentColor}`,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              }}
            >
              <p className="text-sm md:text-base text-text-primary font-medium leading-relaxed mb-3">
                {product.shortIntro}
              </p>

              {/* Value Prop Accent Highlight */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-text-secondary">
                <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: accentColor }} />
                <span className="truncate">{product.valueProp.split('.')[0]}.</span>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-1">Stack:</span>
              {product.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3.5 py-1.5 bg-slate-100/90 border border-slate-200/80 rounded-full text-xs font-semibold text-text-primary shadow-xs hover:border-slate-300 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Direct Contact CTA Button */}
            <Link
              href="#contact"
              onClick={(e) => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  e.preventDefault();
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else if (window.location.pathname !== '/') {
                  // Fallback to homepage contact section
                  window.location.href = '/#contact';
                }
              }}
              className="btn-primary-gradient inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs lg:text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started with {product.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Column — Standard 16:9 Landscape Video Container with Custom UI Controls */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="lg:col-span-6 w-full"
          >
            <div 
              className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-900/10 shadow-2xl bg-slate-950 group"
              style={{
                boxShadow: product.id === 'bites' 
                  ? '0 20px 40px rgba(16,185,129,0.18)'
                  : '0 20px 40px rgba(37,99,235,0.18)',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={videoPoster}
                className="w-full h-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* Custom UI Play/Pause Control Overlay */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
              </button>

              {/* Live Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>LIVE PLATFORM DEMO</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
