'use client';

import { Code, Shield, Layers, Smartphone, Globe, Database } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const proofItems = [
  {
    icon: Code,
    title: 'Full Ownership',
    description:
      '100% custom software for both products — no licensing fees, no vendor lock-in, and full control over your platform.',
  },
  {
    icon: Layers,
    title: 'Multi-Industry Platforms',
    description:
      'Two complete platforms serving different needs: local delivery logistics and comprehensive school administration.',
  },
  {
    icon: Shield,
    title: 'Security-First Design',
    description:
      'Secure logins, forced logouts on suspicious activity, exact role-based access control, and full activity tracking for every user.',
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Apps',
    description:
      'Seamless experiences across web and mobile. The same team builds, maintains, and operates both platforms.',
  },
  {
    icon: Globe,
    title: 'Powerful Integrations',
    description:
      'Real integrations with online payments, AI facial recognition, actual road routing, and automated messaging services.',
  },
  {
    icon: Database,
    title: 'Built for Local Needs',
    description:
      'Rs. pricing, localized Urdu typography, cash-first payment workflows, and national ID-based security.',
  },
];

export default function ProofSection() {
  return (
    <section id="why-us" className="bg-surface section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-primary inline-block mb-3">
            WHY US
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[560px] mb-4">
            Software Built for Reliability
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-body-lg text-text-secondary max-readable mb-10 md:mb-12">
            Every feature we offer is tested and proven in the real world. We don&apos;t make claims — we build solutions.
          </p>
        </ScrollReveal>

        {/* Evidence grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {proofItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={0.06 * i} className="h-full">
              <div className="flex flex-col bg-white p-6 md:p-8 rounded-[var(--radius-lg)] border border-border shadow-sm h-full">
                <div className="w-12 h-12 rounded-lg bg-primary-light/50 flex items-center justify-center mb-6">
                  <item.icon
                    className="w-6 h-6 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-h4 text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">
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
