import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CapabilityGrid from '@/components/sections/CapabilityGrid';
import ProductFeatures from '@/components/sections/ProductFeatures';
import HowItWorks from '@/components/sections/HowItWorks';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.slug);
  if (!product) return { title: 'Product Not Found - Khushi Solutions' };
  return { title: `${product.name} — Khushi Solutions`, description: product.shortIntro };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.slug);
  if (!product) notFound();

  const accentColor = product.accent === 'blue' ? '#2C64B4' : '#10b981';

  return (
    <div className="premium-bg">
      <Navbar />

      {/* Simple Back Button — top-left, no large banner */}
      <div className="container-main pt-24 pb-4 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 hover:scale-105 w-fit"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Page title — replaces the old big ProductDetailHero banner */}
      <section className="container-main pt-6 pb-12 relative z-10">
        <span
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}35`,
            color: accentColor,
            letterSpacing: '0.12em',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: accentColor }} />
          PRODUCT {product.number}
        </span>
        <h1
          className="text-white mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {product.name}
        </h1>
        <p className="text-base max-w-[560px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {product.shortIntro}
        </p>
      </section>

      <main>
        {/* Capabilities */}
        <CapabilityGrid
          capabilities={product.capabilities}
          accent={product.accent}
          productName={product.name}
          productNumber={product.number}
        />

        {/* Features */}
        <ProductFeatures product={product} />

        {/* How It Works */}
        <HowItWorks product={product} />

        {/* Contact CTA */}
        <section className="section-padding">
          <div className="container-main text-center flex flex-col items-center">
            <h2 className="text-h2 text-white mb-6">Have questions about {product.name}?</h2>
            <Link
              href="/#contact"
              className="btn-primary-gradient inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold"
            >
              Get in Touch →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}
