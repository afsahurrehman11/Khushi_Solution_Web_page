'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import CornerMarks from '@/components/ui/CornerMarks';

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
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
      className="relative min-h-screen flex flex-col justify-center bg-primary-dark overflow-hidden"
    >
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" aria-hidden="true" />

      {/* Very subtle ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background:
            'radial-gradient(ellipse, #2C64B4 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10 pt-28 md:pt-32 lg:pt-36 pb-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-hero-text mx-auto text-center"
        >
          {/* Technical eyebrow */}
          <motion.span
            variants={fadeUp}
            className="text-technical text-primary/80 inline-block mb-5"
          >
            KHUSHI SOLUTIONS / SOFTWARE ENGINEERING
          </motion.span>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="text-display text-text-inverse mb-6"
          >
            Engineered Software
            <br className="hidden sm:block" />
            <span className="text-secondary"> for Real Businesses</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-body-lg text-text-inverse/70 max-w-[600px] mx-auto mb-8"
          >
            From multi-store delivery platforms to AI-powered school management systems — we build production-grade software that serves real users and solves real problems.
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
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-text-inverse font-medium rounded-[var(--radius-sm)] hover:bg-white/5 transition-colors duration-200 text-sm w-full sm:w-auto justify-center"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero screenshot */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-16 max-w-[960px] mx-auto relative"
        >
          <CornerMarks accentColor="blue" size={20} />
          <ScreenshotFrame
            src="/images/products/product-1/desktop/product-1-hero-desktop.webp"
            alt="Bites Admin Dashboard — Multi-store delivery management platform"
            width={1200}
            height={700}
            priority
            accentColor="blue"
            label="BITES / ADMIN DASHBOARD"
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center mt-8 md:mt-12"
        >
          <ChevronDown className="w-5 h-5 text-text-inverse/40" />
        </motion.div>
      </div>
    </section>
  );
}
