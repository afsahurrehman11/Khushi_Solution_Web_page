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
              <span
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34d399',
                  letterSpacing: '0.12em',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                ABOUT
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-h2 text-white mb-4">We Build Software That Works</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-body-lg max-w-[600px] mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {company.aboutStatement}
              </p>
            </ScrollReveal>

            {/* Counter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {company.facts.map((fact) => (
                <AnimatedCounterCard
                  key={fact.label}
                  label={fact.label}
                  valueStr={fact.value}
                  description={fact.description}
                />
              ))}
            </div>
          </div>

          {/* Right Column — Image slot */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <ScrollReveal delay={0.2} className="w-full max-w-[400px]">
              <div
                className="relative w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                }}
              >
                {!imageError ? (
                  <Image
                    src="/images/company/about.webp"
                    alt="Khushi Solutions Team"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <ImagePlaceholder
                    label="Company Image"
                    accentColor="blue"
                    className="w-full h-full border-none"
                  />
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
