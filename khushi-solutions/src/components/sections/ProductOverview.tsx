'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import DynamicCarousel from '@/components/ui/DynamicCarousel';
import { products } from '@/data/products';

export default function ProductOverview() {
  return (
    <section id="products" className="bg-white section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-primary inline-block mb-3">
            PRODUCTS
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-h2 text-text-primary max-w-[600px] mb-12 md:mb-16">
            Two Products. Complete Solutions.
          </h2>
        </ScrollReveal>

        {/* Product cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {products.map((product, index) => {
            const accentText =
              product.accent === 'blue' ? 'text-primary' : 'text-secondary';
            const accentBorderHover =
              product.accent === 'blue'
                ? 'hover:border-primary/30'
                : 'hover:border-secondary/30';

            // Custom platform tags per product as requested in the plan
            const platformTags = product.id === 'bites' 
              ? ['📱 Mobile', '🖥️ Web', '🛒 13 store types']
              : ['🖥️ Desktop', '📱 Android App', '🏫 Multi-school'];

            return (
              <ScrollReveal key={product.id} delay={0.1 * index} className="h-full">
                <div
                  className={`flex flex-col h-full rounded-[var(--radius-lg)] border border-border bg-white overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 ${accentBorderHover}`}
                >
                  {/* Carousel Area */}
                  <div className="p-[1px] bg-surface border-b border-border">
                    <DynamicCarousel 
                      folderPath={`/images/products/${product.id === 'bites' ? 'product-1' : 'product-2'}/carousel`} 
                      aspectRatio="aspect-[16/10]"
                      className="rounded-t-[calc(var(--radius-lg)-1px)] rounded-b-none"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col flex-1 p-6 md:p-8">
                    <span className={`text-technical ${accentText} block mb-2 font-semibold`}>
                      PRODUCT {product.number}
                    </span>
                    <h3 className="text-h3 font-heading text-text-primary mb-2">
                      {product.name}
                    </h3>
                    <p className="text-body text-text-secondary mb-6 line-clamp-2">
                      {product.shortIntro.split('.')[0]}.
                    </p>

                    {/* Platform Tags */}
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-8 mt-auto">
                      {platformTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-md border border-border-subtle">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentText} hover:gap-2.5 transition-all duration-200 mt-auto`}
                    >
                      View {product.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
