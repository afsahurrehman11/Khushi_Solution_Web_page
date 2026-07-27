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

          {/* Right Column - Experience visualization */}
          <div className="lg:col-span-5 xl:col-span-4 lg:col-start-8 xl:col-start-9 hidden lg:flex items-center justify-center">
            <ScrollReveal delay={0.3} className="w-full">
              <div
                className="relative w-full aspect-square rounded-full flex items-center justify-center bg-white"
                style={{
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Core animated rings */}
                <div className="absolute inset-4 rounded-full border border-dashed border-border animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-slate-200 animate-[spin_15s_linear_infinite_reverse]" />
                
                <div className="text-center z-10 relative">
                  <div className="text-5xl font-bold mb-2 text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                    100%
                  </div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-widest leading-relaxed">
                    Production-Grade<br />Custom Architecture
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
