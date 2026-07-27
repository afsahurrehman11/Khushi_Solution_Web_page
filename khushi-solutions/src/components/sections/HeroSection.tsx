'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import DynamicCarousel from '@/components/ui/DynamicCarousel';
import CornerMarks from '@/components/ui/CornerMarks';

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-primary-dark overflow-hidden hero-gradient pt-24"
    >
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-15" aria-hidden="true" />

      {/* Very subtle ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.08]"
        style={{
          background:
            'radial-gradient(ellipse, #2C64B4 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10 pt-16 md:pt-20 lg:pt-24 pb-8 flex-1 flex flex-col justify-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-hero-text mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.span
            variants={fadeUp}
            className="text-technical text-white/70 inline-block mb-3"
          >
            KHUSHI SOLUTIONS
          </motion.span>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="text-display text-white mb-4"
          >
            Software That Runs Real Businesses
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-body-lg text-white/80 max-w-[600px] mx-auto mb-8"
          >
            Delivery platforms and school management systems — built and proven.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-medium rounded-[var(--radius-sm)] hover:bg-secondary-hover transition-colors duration-200 text-sm w-full sm:w-auto justify-center"
            >
              See Our Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero carousel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-16 max-w-[960px] mx-auto w-full relative"
        >
          <CornerMarks accentColor="blue" size={20} />
          <div className="p-[1px] rounded-lg bg-border-subtle/20 shadow-lg relative overflow-hidden">
             {/* Browser top bar simulation */}
             <div className="bg-[#1A2C47] border-b border-white/10 px-4 py-2 flex items-center gap-2 rounded-t-lg">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
              </div>
              <DynamicCarousel folderPath="/images/hero" aspectRatio="aspect-video" className="rounded-b-lg" />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center mt-8 md:mt-12"
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </div>
    </section>
  );
}
