'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Truck, GraduationCap, MapPin, Smartphone, Receipt, Calendar, Users, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import ScrollReveal from '@/components/ui/ScrollReveal';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function ProductIcon({ productId, accent }: { productId: string; accent: string }) {
  if (productId === 'khushi-delivery') {
    return <Truck className="w-7 h-7 mb-2" style={{ color: accent }} strokeWidth={1.5} aria-hidden="true" />;
  }
  return <GraduationCap className="w-7 h-7 mb-2" style={{ color: accent }} strokeWidth={1.5} aria-hidden="true" />;
}

// Maps platform tags to clean SVG icons with Android App highlight
const platformTagDefs = {
  'khushi-delivery': [
    { label: 'Native Android App', icon: Smartphone, isAndroid: true },
    { label: 'Live GPS Tracking', icon: MapPin },
    { label: 'POS & Kitchen Display', icon: Receipt },
    { label: 'Real-time Orders', icon: Truck },
    { label: 'Customer Portal', icon: Users },
  ],
  'khushi-erp': [
    { label: 'Native Android App', icon: Smartphone, isAndroid: true },
    { label: 'Biometric AI Attendance', icon: Fingerprint },
    { label: 'Automated Fee Portal', icon: Receipt },
    { label: 'Exam & Report Cards', icon: Calendar },
    { label: 'Bus GPS Tracking', icon: MapPin },
  ],
};

function ProductCard({
  product,
  index,
  activeId,
  setActiveId,
}: {
  product: typeof products[0];
  index: number;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const isActive = activeId === product.id;
  const isOtherActive = activeId !== null && !isActive;

  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const tags = platformTagDefs[product.id as keyof typeof platformTagDefs] || [];

  // Use dynamic poster & video source from product data
  const videoPoster = `/images/products/${product.id === 'khushi-delivery' ? 'product-1' : 'product-2'}/desktop/${product.id === 'khushi-delivery' ? 'product-1-hero-desktop' : 'product-2-hero-desktop'}.webp`;
  const videoSrc = product.heroVideo.desktop;

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.15 }}
      onPointerEnter={() => setActiveId(product.id)}
      onPointerLeave={() => setActiveId(null)}
      onClick={() => setActiveId(isActive ? null : product.id)}
      className={`group relative flex flex-col h-full rounded-2xl cursor-pointer transition-all duration-500 ${isActive ? 'z-[60] scale-[1.03] opacity-100 blur-none' : isOtherActive ? 'z-10 opacity-35 blur-[1.5px] scale-[0.97]' : 'z-20 opacity-100 blur-none'
        }`}
    >
      {/* Prominent Neon Gradient Glow Aura */}
      <div
        className={`absolute -inset-3 rounded-3xl transition-all duration-500 pointer-events-none ${isActive
          ? 'opacity-100 animate-pulse scale-105'
          : 'opacity-0 group-hover:opacity-100'
          }`}
        style={{
          background: product.id === 'khushi-delivery'
            ? 'radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(59,130,246,0.3) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(16,185,129,0.3) 50%, transparent 80%)',
          filter: product.id === 'khushi-delivery'
            ? 'drop-shadow(0 0 40px rgba(16,185,129,0.7))'
            : 'drop-shadow(0 0 40px rgba(37,99,235,0.7))',
        }}
      />

      <div className={`glass-card relative z-10 flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-500 bg-white/95 ${isActive
        ? product.id === 'khushi-delivery'
          ? 'border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]'
          : 'border-2 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.4)]'
        : 'border-border/60 hover:border-slate-300 hover:shadow-xl'
        }`}>
        <div className="relative z-10 flex flex-col h-full bg-white/40">

          {/* Video Container   Standard 16:9 Landscape Video (Zero Gaps) */}
          <div className="relative overflow-hidden border-b border-border bg-slate-100 aspect-video w-full flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={videoPoster}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" />
          </div>

          {/* Text content   compact single-view layout */}
          <div className="flex flex-col flex-1 p-4 lg:p-5 bg-white/90">
            {/* Product icon + number */}
            <div className="flex items-start justify-between mb-0.5">
              <ProductIcon productId={product.id} accent={accentColor} />
              <span
                className="text-[9px] font-bold tracking-widest text-text-muted font-mono"
              >
                PRODUCT {product.number}
              </span>
            </div>

            <h3
              className="text-text-primary mb-1 text-lg lg:text-xl font-extrabold"
              style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}
            >
              {product.name}
            </h3>

            <p className="text-xs mb-2.5 line-clamp-1 text-text-secondary" style={{ lineHeight: 1.4 }}>
              {product.shortIntro.split('.')[0]}.
            </p>

            {/* Platform tag pills with highlighted Android App badge */}
            <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
              {tags.map(({ icon: Icon, label, isAndroid }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2.5 py-0.5 border transition-colors ${isAndroid
                    ? product.id === 'khushi-delivery'
                      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-bold shadow-xs'
                      : 'bg-blue-500/10 text-blue-700 border-blue-500/30 font-bold shadow-xs'
                    : 'bg-slate-100 text-text-secondary border-slate-200'
                    }`}
                >
                  <Icon className={`w-3 h-3 shrink-0 ${isAndroid ? 'text-current' : ''}`} strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>

            {/* High-Impact Real Action Button   Directly Navigates to Product Page */}
            <Link
              href={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs lg:text-sm text-white flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group/btn"
              style={{
                background: product.id === 'khushi-delivery'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: product.id === 'khushi-delivery'
                  ? '0 4px 12px rgba(16,185,129,0.25)'
                  : '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              <span>Explore {product.name}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductOverviewContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (highlightId) {
      setActiveId(highlightId);
    }
  }, [highlightId]);

  return (
    <section
      id="products"
      ref={ref}
      className="py-4 lg:py-6 min-h-[calc(100vh-80px)] flex flex-col justify-center relative"
    >
      {/* "Turn Off The Lights" Global Spotlight Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-500 pointer-events-none ${activeId !== null ? 'opacity-100' : 'opacity-0'
          }`}
      />

      <div className="container-main relative z-50">
        <div className="mb-3 lg:mb-4 text-center flex flex-col items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col items-center"
          >
            <span className="eyebrow-pill mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              PRODUCTS
            </span>
            <h2 className="text-xl lg:text-2xl text-text-primary font-extrabold tracking-tight">
              Flagship Solutions
            </h2>
          </motion.div>
        </div>

        {/* Responsive layout: grid-cols-1 on mobile, max-w-5xl grid-cols-2 on desktop */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductOverview() {
  return (
    <Suspense fallback={<section id="products" className="py-4 min-h-[500px]" />}>
      <ProductOverviewContent />
    </Suspense>
  );
}
