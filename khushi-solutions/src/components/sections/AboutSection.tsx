'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import { company } from '@/data/company';

export default function AboutSection() {
  return (
    <section id="about" className="bg-surface section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-primary inline-block mb-5">
            KHUSHI SOLUTIONS / ABOUT
          </span>
        </ScrollReveal>

        {/* Large company statement */}
        <ScrollReveal delay={0.1}>
          <h2 className="text-h2 text-text-primary max-w-[680px] mb-6">
            {company.aboutStatement}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-body-lg text-text-secondary max-readable mb-12 md:mb-16">
            {company.aboutDescription}
          </p>
        </ScrollReveal>

        {/* Hairline rule */}
        <div className="w-full h-px bg-border mb-10 md:mb-12" />

        {/* Evidence facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {company.facts.map((fact, i) => (
            <ScrollReveal key={fact.label} delay={0.1 * i}>
              <div>
                <span className="text-technical text-text-muted block mb-2">
                  {fact.label.toUpperCase()}
                </span>
                <p className="text-h2 text-text-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {fact.value}
                </p>
                <p className="text-small text-text-secondary">
                  {fact.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
