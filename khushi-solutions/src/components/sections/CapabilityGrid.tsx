'use client';

import * as LucideIcons from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProductCapability, ProductAccent } from '@/data/products';

interface CapabilityGridProps {
  capabilities: ProductCapability[];
  accent: ProductAccent;
  productName: string;
  productNumber: string;
}

/* Dynamically resolve Lucide icon by name */
function getIcon(iconName: string) {
  const icons = LucideIcons as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>;
  return icons[iconName] || LucideIcons.Zap;
}

export default function CapabilityGrid({
  capabilities,
  accent,
  productName,
  productNumber,
}: CapabilityGridProps) {
  const accentText = accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBg = accent === 'blue' ? 'bg-primary-light' : 'bg-secondary-light';
  const accentIconBg = accent === 'blue' ? 'bg-primary/10' : 'bg-secondary/10';
  const sectionBg = accent === 'blue' ? 'bg-surface' : 'bg-white';

  return (
    <section className={`${sectionBg} section-padding`}>
      <div className="container-main">
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-4`}>
            PRODUCT {productNumber} / KEY CAPABILITIES
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[560px] mb-4">
            What {productName} Delivers
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-body text-text-secondary max-readable mb-10 md:mb-14">
            Core capabilities verified from the production codebase.
          </p>
        </ScrollReveal>

        {/* Capability grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {capabilities.map((cap, i) => {
            const Icon = getIcon(cap.icon);
            return (
              <ScrollReveal key={cap.name} delay={0.05 * i}>
                <div
                  className={`${accentBg} rounded-[var(--radius-md)] border border-border/50 p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]`}
                >
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] ${accentIconBg} mb-3`}>
                    <Icon className={`w-[18px] h-[18px] ${accentText}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-h4 text-text-primary mb-1.5">
                    {cap.name}
                  </h3>
                  <p className="text-small text-text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
