'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Truck, GraduationCap, MapPin, Smartphone, Receipt, Calendar, Users, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/data/products';
import ScrollReveal from '@/components/ui/ScrollReveal';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function ProductIcon({ productId, accent }: { productId: string; accent: string }) {
  if (productId === 'bites') {
    return <Truck className="w-9 h-9 mb-3" style={{ color: accent }} strokeWidth={1.5} aria-hidden="true" />;
  }
  return <GraduationCap className="w-9 h-9 mb-3" style={{ color: accent }} strokeWidth={1.5} aria-hidden="true" />;
}

// Maps platform tags to clean SVG icons, no emojis.
const platformTagDefs = {
  'bites': [
    { label: 'Mobile App', icon: Smartphone },
    { label: 'Live Tracking', icon: MapPin },
    { label: 'POS Billing', icon: Receipt },
  ],
  'khushi-erp': [
    { label: 'Biometric AI', icon: Fingerprint },
    { label: 'Parent App', icon: Smartphone },
    { label: 'Fee Management', icon: Receipt },
  ],
};

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const tags = platformTagDefs[product.id as keyof typeof platformTagDefs] || [];
  
  // Use a fallback poster if the video is missing
  const videoPoster = `/images/products/${product.id === 'bites' ? 'product-1' : 'product-2'}/desktop/${product.id === 'bites' ? 'product-1-hero-desktop' : 'product-2-hero-desktop'}.webp`;
  const videoSrc = `/videos/${product.id}-demo.mp4`; // Path to where videos will be placed

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.15 }}
      className="glass-card flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative z-10 flex flex-col h-full bg-white/40">
        
        {/* Video Container — compact strict aspect-video */}
        <div className="relative overflow-hidden border-b border-border bg-slate-100 aspect-video">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={videoPoster}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" />
        </div>

        {/* Text content — compact */}
        <div className="flex flex-col flex-1 p-5 md:p-6 bg-white/80">
          {/* Product icon + number */}
          <div className="flex items-start justify-between mb-1.5">
            <ProductIcon productId={product.id} accent={accentColor} />
            <span
              className="text-[10px] font-bold tracking-widest text-text-muted font-mono"
            >
              PRODUCT {product.number}
            </span>
          </div>

          <h3
            className="text-text-primary mb-2 text-2xl"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, lineHeight: 1.2 }}
          >
            {product.name}
          </h3>

          <p className="text-sm mb-5 line-clamp-2 text-text-secondary" style={{ lineHeight: 1.55 }}>
            {product.shortIntro.split('.')[0]}.
          </p>

          {/* Platform tag pills */}
          <div className="flex flex-wrap gap-2 mb-5 mt-auto">
            {tags.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-3 py-1.5 bg-slate-100 text-text-secondary border border-slate-200"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/products/${product.id}`}
            className="cta-underline text-sm font-bold w-fit"
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="products"
      ref={ref}
      className="section-padding relative"
    >
      <div className="container-main">
        <div className="mb-8 md:mb-10 text-center flex flex-col items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col items-center"
          >
            <span className="eyebrow-pill">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              PRODUCTS
            </span>
            <h2 className="text-h2 text-text-primary max-w-[420px]">
              Two Products. Complete Solutions.
            </h2>
          </motion.div>
        </div>

        {/* Strict layout: stacking grid-cols-1 on mobile, strictly grid-cols-2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
