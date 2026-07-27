'use client';

import Link from 'next/link';
import { ArrowRight, Smartphone, Monitor, Globe, Bot, Building2, ShoppingBag, Truck, GraduationCap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import DynamicCarousel from '@/components/ui/DynamicCarousel';
import { products } from '@/data/products';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/* SVG icon for each platform tag (no emojis) */
const platformTagDefs = {
  bites: [
    { icon: Smartphone, label: 'Mobile' },
    { icon: Globe, label: 'Web' },
    { icon: ShoppingBag, label: '13 store types' },
  ],
  'khushi-erp': [
    { icon: Monitor, label: 'Desktop' },
    { icon: Bot, label: 'Android App' },
    { icon: Building2, label: 'Multi-school' },
  ],
};

/* Large decorative product icon */
function ProductIcon({ productId, accent }: { productId: string; accent: string }) {
  if (productId === 'bites') {
    return (
      <Truck
        className="w-9 h-9 mb-3"
        style={{ color: accent }}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    );
  }
  return (
    <GraduationCap
      className="w-9 h-9 mb-3"
      style={{ color: accent }}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  const accentColor = product.accent === 'blue' ? '#2C64B4' : '#10b981';
  const accentColorLight = product.accent === 'blue' ? 'rgba(44,100,180,0.7)' : 'rgba(16,185,129,0.7)';
  const tags = platformTagDefs[product.id as keyof typeof platformTagDefs] || [];

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.15 }}
      className="neon-card flex flex-col h-full"
      style={{
        /* Override neon-card border with the product's accent neon */
        '--neon-accent': accentColor,
      } as React.CSSProperties}
    >
      {/* Card inner content sits above the ::after pseudo */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Carousel — compact height */}
        <div className="relative overflow-hidden rounded-t-[var(--radius-lg)] border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <DynamicCarousel
            folderPath={`/images/products/${product.id === 'bites' ? 'product-1' : 'product-2'}/carousel`}
            aspectRatio="aspect-[16/9]"
            className="rounded-t-[calc(var(--radius-lg)-1px)]"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,12,26,0.7), transparent)' }}
          />
        </div>

        {/* Text content — compact */}
        <div className="flex flex-col flex-1 p-4 md:p-5">
          {/* Product icon + number */}
          <div className="flex items-start justify-between mb-1.5">
            <ProductIcon productId={product.id} accent={accentColor} />
            <span
              className="text-[10px] font-bold tracking-widest"
              style={{ color: accentColorLight, fontFamily: 'var(--font-mono)' }}
            >
              PRODUCT {product.number}
            </span>
          </div>

          <h3
            className="text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', lineHeight: 1.25 }}
          >
            {product.name}
          </h3>

          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.55 }}>
            {product.shortIntro.split('.')[0]}.
          </p>

          {/* Platform tag pills */}
          <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
            {tags.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2.5 py-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                <Icon className="w-3 h-3 shrink-0" strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/products/${product.id}`}
            className="cta-underline text-sm font-semibold w-fit"
            style={{ color: accentColor }}
          >
            View {product.name}
            <ArrowRight className="w-3.5 h-3.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="products"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="container-main">
        <div className="mb-8 md:mb-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <span
              className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#34d399',
                letterSpacing: '0.12em',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              PRODUCTS
            </span>
            <h2 className="text-h2 text-white max-w-[420px]">
              Two Products. Complete Solutions.
            </h2>
          </motion.div>
        </div>

        {/* Strict 2-column grid — both cards always visible side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
