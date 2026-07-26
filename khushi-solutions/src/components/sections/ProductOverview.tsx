'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import { products } from '@/data/products';

export default function ProductOverview() {
  return (
    <section id="products" className="bg-white section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-text-muted inline-block mb-5">
            KHUSHI SOLUTIONS / PRODUCTS
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-h2 text-text-primary max-w-[600px] mb-4">
            Two Products. Complete Solutions.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-body-lg text-text-secondary max-readable mb-12 md:mb-16">
            Each product is a full-stack platform engineered for its specific industry — from delivery logistics to educational administration.
          </p>
        </ScrollReveal>

        {/* Product cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const accentBg =
              product.accent === 'blue' ? 'bg-primary-light' : 'bg-secondary-light';
            const accentText =
              product.accent === 'blue' ? 'text-primary' : 'text-secondary';
            const accentBorder =
              product.accent === 'blue'
                ? 'border-primary/10 hover:border-primary/25'
                : 'border-secondary/10 hover:border-secondary/25';

            return (
              <ScrollReveal key={product.id} delay={0.1 * index}>
                <div
                  className={`rounded-[var(--radius-lg)] border ${accentBorder} overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5`}
                >
                  {/* Product header */}
                  <div className={`${accentBg} px-6 py-5 md:px-8 md:py-6`}>
                    <span className={`text-technical ${accentText} block mb-2`}>
                      PRODUCT {product.number}
                    </span>
                    <h3 className="text-h3 text-text-primary mb-2">
                      {product.name}
                    </h3>
                    <p className="text-small text-text-secondary">
                      {product.category}
                    </p>
                  </div>

                  {/* Product body */}
                  <div className="px-6 py-5 md:px-8 md:py-6 bg-white">
                    <p className="text-body text-text-secondary mb-5 line-clamp-3">
                      {product.shortIntro.substring(0, 200)}...
                    </p>

                    <Link
                      href={`#${product.id}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentText} hover:gap-2.5 transition-all duration-200`}
                    >
                      Explore {product.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Mini screenshot preview */}
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <ScreenshotFrame
                      src={product.heroScreenshot.desktop}
                      alt={product.heroScreenshot.alt}
                      width={1200}
                      height={700}
                      accentColor={product.accent}
                      label={`${product.name.toUpperCase()} / PREVIEW`}
                    />
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
