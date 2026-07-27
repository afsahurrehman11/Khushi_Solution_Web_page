'use client';

import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
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
  const icons = (LucideIcons as unknown) as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>;
  return icons[iconName] || LucideIcons.Zap;
}

export default function CapabilityGrid({
  capabilities,
  accent,
  productName,
  productNumber,
}: CapabilityGridProps) {
  const accentText = accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBorderHover = accent === 'blue' ? 'hover:border-primary/30' : 'hover:border-secondary/30';
  const accentColor = accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';

  return (
    <section className="bg-surface section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-3`}>
            PRODUCT {productNumber} / CAPABILITIES
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[500px] mb-4">
            Engineered for Scale
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-body text-text-secondary max-readable mb-10 md:mb-14">
            Core features built to handle real operational scale.
          </p>
        </ScrollReveal>

        {/* Capability grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {capabilities.map((cap, i) => {
            const Icon = getIcon(cap.icon);
            return (
              <ScrollReveal key={cap.name} delay={0.1 * i} className="h-full">
                <div
                  className="bg-white rounded-[var(--radius-xl)] p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-border group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: 'rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <span style={{ color: accentColor }} className="flex items-center justify-center">
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </span>
                    </div>
                    <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                      {cap.name}
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
