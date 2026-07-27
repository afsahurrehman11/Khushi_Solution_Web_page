'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { useCountUp } from '@/hooks/useCountUp';
import { company } from '@/data/company';

function AnimatedCounterCard({ label, valueStr, description }: { label: string, valueStr: string, description: string }) {
  const isPlus = valueStr.endsWith('+');
  const numericValue = parseInt(valueStr.replace(/\D/g, ''), 10);
  
  const [trigger, setTrigger] = useState(false);
  const count = useCountUp(numericValue, 1500, trigger);

  return (
    <div 
      className="bg-white border border-border shadow-sm rounded-md p-4 sm:p-5 md:p-6 flex flex-col items-center sm:items-start text-center sm:text-left h-full"
    >
      <ScrollReveal delay={0.1} onReveal={() => setTrigger(true)}>
        <span className="text-technical text-text-muted block mb-2 sm:mb-3">{label}</span>
        <div className="text-h2 font-heading text-text-primary mb-1 sm:mb-2 flex justify-center sm:justify-start items-baseline">
          {trigger ? count : 0}{isPlus ? '+' : ''}
        </div>
        <p className="text-small text-text-secondary leading-tight">{description}</p>
      </ScrollReveal>
    </div>
  );
}

export default function AboutSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="about" className="bg-surface section-padding overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column - Text and Counters */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
            <ScrollReveal>
              <span className="text-technical text-primary inline-block mb-3">
                ABOUT
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-h2 text-text-primary mb-4">
                We Build Software That Works
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-body-lg text-text-secondary max-w-[600px] mb-10">
                {company.aboutStatement}
              </p>
            </ScrollReveal>

            {/* Counter Cards */}
            {/* 3 cards in a row >= 375px, stacked vertically < 375px */}
            <div className="grid grid-cols-1 sm:grid-cols-3 min-[375px]:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mt-2">
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

          {/* Right Column - Image Slot */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <ScrollReveal delay={0.2} className="w-full max-w-[400px]">
              <div className="relative w-full aspect-[4/3] rounded-lg border-2 border-primary/20 overflow-hidden shadow-sm bg-white p-1">
                <div className="relative w-full h-full rounded bg-primary-light/30 overflow-hidden flex items-center justify-center">
                  {!imageError ? (
                    <Image
                      src="/images/company/about.webp"
                      alt="Khushi Solutions Team"
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ImagePlaceholder label="Company Image" className="w-full h-full border-none" />
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
