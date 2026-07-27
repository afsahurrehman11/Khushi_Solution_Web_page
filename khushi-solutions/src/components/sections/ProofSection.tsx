'use client';

import { Code, Shield, Layers, Smartphone, Globe, Database } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const proofItems = [
  {
    icon: Code,
    title: 'Full Ownership',
    description: '100% custom software — no licensing fees, no vendor lock-in, and full control over your platform.',
  },
  {
    icon: Layers,
    title: 'Multi-Industry Platforms',
    description: 'Two complete platforms serving different needs: local delivery logistics and school administration.',
  },
  {
    icon: Shield,
    title: 'Security-First Design',
    description: 'Secure logins, forced logouts, exact role-based access control, and full activity tracking.',
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Apps',
    description: 'Seamless experiences across web and mobile. The same team builds and maintains both platforms.',
  },
  {
    icon: Globe,
    title: 'Powerful Integrations',
    description: 'Real integrations: online payments, AI facial recognition, road routing, and automated messaging.',
  },
  {
    icon: Database,
    title: 'Built for Local Needs',
    description: 'Rs. pricing, localized Urdu typography, cash-first payment workflows, and national ID-based security.',
  },
];

export default function ProofSection() {
  return (
    <section id="why-us" className="section-padding relative">
      <div className="container-main relative z-10">
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <ScrollReveal>
            <span className="eyebrow-pill">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              WHY US
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h2 className="text-h2 text-text-primary max-w-[500px] mb-4">
              Software Built for Reliability
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Every feature we offer is tested and proven in the real world.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {proofItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={0.05 * i} className="h-full">
              <div
                className="neu-card-strong rounded-[var(--radius-xl)] p-6 md:p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shadow-sm"
                  style={{
                    background: 'var(--color-secondary)',
                  }}
                >
                  <item.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
