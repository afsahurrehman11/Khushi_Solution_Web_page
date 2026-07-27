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

  return (
    <section className="bg-surface section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-3`}>
            PRODUCT {productNumber} / CAPABILITIES
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[560px] mb-4">
            What {productName} Can Do
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
              <ScrollReveal key={cap.name} delay={0.05 * i} className="h-full">
                <div
                  className={`group relative h-full bg-white rounded-[var(--radius-md)] border border-border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-1 ${accentBorderHover}`}
                >
                  <div className="p-5 md:p-6 flex flex-col h-full z-10 relative bg-white">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] bg-surface border border-border mb-4 transition-colors group-hover:bg-primary-light/10`}>
                      <Icon className={`w-5 h-5 ${accentText}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-h4 text-text-primary mb-2 transition-colors">
                      {cap.name}
                    </h3>
                    
                    {/* Desktop: reveal on hover, Mobile: always visible */}
                    <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-all duration-300 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-small text-text-secondary leading-relaxed pt-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          {cap.description}
                        </p>
                      </div>
                    </div>
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
