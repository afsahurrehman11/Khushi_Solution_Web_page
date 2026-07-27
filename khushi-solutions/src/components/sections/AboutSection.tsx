'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { useCountUp } from '@/hooks/useCountUp';
import { company } from '@/data/company';

function AnimatedCounterCard({ label, valueStr, description }: { label: string; valueStr: string; description: string }) {
  const isPlus = valueStr.endsWith('+');
  const numericValue = parseInt(valueStr.replace(/\D/g, ''), 10);
  const [trigger, setTrigger] = useState(false);
  const count = useCountUp(numericValue, 1500, trigger);

  return (
    <div
      className="glass-card rounded-[var(--radius-md)] p-5 md:p-6 flex flex-col items-center sm:items-start text-center sm:text-left h-full"
    >
      <ScrollReveal delay={0.1} onReveal={() => setTrigger(true)}>
        <span className="text-technical mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
        <div
          className="mb-1 flex justify-center sm:justify-start items-baseline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            color: 'white',
          }}
        >
          {trigger ? count : 0}{isPlus ? '+' : ''}
        </div>
        <p className="text-small" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {description}
        </p>
      </ScrollReveal>
    </div>
  );
}

export default function AboutSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="about" className="section-padding overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Column */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
            <ScrollReveal>
              <span className="eyebrow-pill">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                ABOUT
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-h2 text-text-primary mb-6 lg:mb-8 max-w-[640px]">
                We build the software that your business actually needs.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-body-lg text-text-secondary max-w-[600px] mb-8">
                Khushi Solutions is a software company focused on real-world operations. We don&apos;t build disposable marketing sites; we engineer production-grade platforms. Our software manages thousands of daily deliveries and handles the administration of major educational institutions.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-8">
              {company.facts.map((fact, i) => (
                <ScrollReveal key={fact.label} delay={0.2 + (i * 0.1)}>
                  <div className="relative pl-5 border-l-2" style={{ borderColor: 'var(--color-primary)' }}>
                    <div className="text-3xl lg:text-4xl font-bold mb-1 text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                      {fact.value}
                    </div>
                    <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                      {fact.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Column - Animated Experience & Architecture visualization */}
          <div className="lg:col-span-5 xl:col-span-4 lg:col-start-8 xl:col-start-9 flex items-center justify-center mt-8 lg:mt-0">
            <ScrollReveal delay={0.2} className="w-full max-w-[280px] sm:max-w-[320px]">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full aspect-square rounded-full flex items-center justify-center bg-white border border-border shadow-xl group cursor-pointer"
              >
                {/* Expanding Soft Radar Pulse Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/15 via-emerald-500/15 to-blue-500/15 animate-ping opacity-20 pointer-events-none" />

                {/* Ambient Gradient Glow Backdrop */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-50/60 via-slate-50 to-emerald-50/60 blur-sm pointer-events-none" />

                {/* Orbit Ring 1 — Clockwise Dashed Gradient */}
                <div className="absolute inset-3 rounded-full border-2 border-dashed border-blue-500/30 animate-[spin_18s_linear_infinite]" />

                {/* Orbit Ring 2 — Counter-Clockwise Dotted Gradient */}
                <div className="absolute inset-7 rounded-full border border-dotted border-emerald-500/40 animate-[spin_14s_linear_infinite_reverse]" />

                {/* Orbiting Satellite Dots */}
                <div className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)] absolute -top-1.5 left-1/2 -translate-x-1/2 border-2 border-white" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-2 border-white" />
                </div>

                {/* Center Core Badge */}
                <div className="text-center z-10 relative p-6 flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent tracking-tight" 
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    100%
                  </motion.div>

                  <div className="text-[11px] md:text-xs font-bold text-text-primary uppercase tracking-widest leading-relaxed">
                    Production-Grade<br />
                    <span className="text-secondary font-extrabold">Custom Architecture</span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
