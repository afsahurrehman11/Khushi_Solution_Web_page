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
    <section id="why-us" className="section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(44,100,180,0.1)',
              border: '1px solid rgba(44,100,180,0.3)',
              color: '#60a5fa',
              letterSpacing: '0.12em',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            WHY US
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-white max-w-[500px] mb-4">
            Software Built for Reliability
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-base max-readable mb-10 md:mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Every feature we offer is tested and proven in the real world.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {proofItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={0.05 * i} className="h-full">
              <div
                className="rounded-2xl p-6 md:p-7 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] group"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    boxShadow: '0 0 16px rgba(16,185,129,0.08)',
                  }}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} style={{ color: '#34d399' }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
