'use client';

import { Code, Shield, Layers, Smartphone, Globe, Database } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const proofItems = [
  {
    icon: Code,
    title: 'Full Ownership',
    description:
      '100% custom codebase for both products — no licensing fees, no vendor lock-in, no third-party platform dependency.',
  },
  {
    icon: Layers,
    title: 'Multi-Industry Platforms',
    description:
      'Two distinct production platforms: 13+ store categories for delivery, and multi-tenant SaaS for school management — each solving industry-specific problems.',
  },
  {
    icon: Shield,
    title: 'Security-First Architecture',
    description:
      'JWT session versioning for forced logout, password re-verification on sensitive actions, per-module RBAC permissions, and comprehensive audit logging.',
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Engineering',
    description:
      'React Native cross-platform apps alongside dedicated desktop CMS platforms — the same team builds, maintains, and operates both mobile and web.',
  },
  {
    icon: Globe,
    title: 'Production-Grade Integrations',
    description:
      'Real integrations with PayFast payments, AI facial recognition (InsightFace/PyTorch), OSRM road routing, WhatsApp messaging, and push notification services.',
  },
  {
    icon: Database,
    title: 'Built for Pakistan',
    description:
      'PKR pricing, localized Urdu font rendering for fee vouchers, cash-first payment workflows, geo-aware delivery zones, and CNIC-based parent authentication.',
  },
];

export default function ProofSection() {
  return (
    <section id="why-us" className="bg-surface section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-text-muted inline-block mb-5">
            KHUSHI SOLUTIONS / WHY US
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[560px] mb-4">
            Engineering Credibility, Not Marketing Claims
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-body-lg text-text-secondary max-readable mb-12 md:mb-16">
            Every capability listed here is verified from production codebases. We don&apos;t claim what we haven&apos;t built.
          </p>
        </ScrollReveal>

        {/* Hairline */}
        <div className="w-full h-px bg-border mb-10 md:mb-12" />

        {/* Evidence grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {proofItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={0.06 * i}>
              <div className="flex flex-col">
                <item.icon
                  className="w-6 h-6 text-primary mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-h4 text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-small text-text-secondary leading-relaxed">
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
