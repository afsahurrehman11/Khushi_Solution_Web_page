'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import MobileFrame from '@/components/ui/MobileFrame';
import CornerMarks from '@/components/ui/CornerMarks';
import type { ProductData } from '@/data/products';

interface ProductShowcaseProps {
  product: ProductData;
}

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const accentText =
    product.accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBg =
    product.accent === 'blue' ? 'bg-primary' : 'bg-secondary';
  const accentHoverBg =
    product.accent === 'blue' ? 'hover:bg-primary-hover' : 'hover:bg-secondary-hover';
  const sectionBg =
    product.accent === 'blue' ? 'bg-white' : 'bg-surface';
  const dotGridClass =
    product.accent === 'blue' ? 'dot-grid' : 'dot-grid-green';

  return (
    <section id={product.id} className={`${sectionBg} section-padding relative overflow-hidden`}>
      {/* Subtle dot grid in background */}
      <div className={`absolute inset-0 ${dotGridClass} opacity-30`} aria-hidden="true" />

      <div className="container-main relative z-10">
        {/* Product header */}
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-4`}>
            KHUSHI SOLUTIONS / PRODUCT {product.number}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h1 text-text-primary mb-3">
            {product.name}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="text-h4 text-text-secondary font-normal mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            {product.headline}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <p className="text-body-lg text-text-secondary max-readable mb-8">
            {product.shortIntro.substring(0, 280)}
          </p>
        </ScrollReveal>

        {product.url && (
          <ScrollReveal delay={0.2}>
            <Link
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 ${accentBg} text-white font-medium rounded-[var(--radius-sm)] ${accentHoverBg} transition-colors duration-200 text-sm mb-10`}
            >
              Visit {product.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        )}

        {/* Primary product screenshots */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 md:mt-12 relative">
            <CornerMarks accentColor={product.accent} size={18} />

            {/* Desktop + Mobile side-by-side */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-end">
              {/* Desktop screenshot */}
              <div className="flex-1 min-w-0">
                <ScreenshotFrame
                  src={product.heroScreenshot.desktop}
                  alt={product.heroScreenshot.alt}
                  width={1200}
                  height={750}
                  accentColor={product.accent}
                  label={`${product.name.toUpperCase()} / DASHBOARD`}
                />
              </div>

              {/* Mobile screenshot */}
              {product.heroScreenshot.mobile && (
                <div className="flex justify-center lg:justify-end shrink-0">
                  <MobileFrame
                    src={product.heroScreenshot.mobile}
                    alt={`${product.name} Mobile Application`}
                    accentColor={product.accent}
                  />
                </div>
              )}
            </div>

            {/* Technical label */}
            <div className="mt-4 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${accentBg}`} />
              <span className="text-technical text-text-muted">
                {product.accent === 'blue'
                  ? 'CROSS-PLATFORM / REACT NATIVE + EXPO'
                  : 'DESKTOP + MOBILE ECOSYSTEM / MULTI-TENANT SAAS'}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
