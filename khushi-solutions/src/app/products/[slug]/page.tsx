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
import LocomotiveScrollProvider from '@/components/layout/LocomotiveScrollProvider';

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

  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';

  return (
    <LocomotiveScrollProvider>
      <div className="premium-bg">
        <Navbar />

        {/* Minimalist Top-Left Back Button */}
        <div className="container-main pt-28 pb-3 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold rounded-full px-5 py-2.5 transition-all duration-200 hover:scale-105 w-fit hover:bg-slate-100 bg-white"
            style={{
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Page title — Neumorphic Light */}
        <section className="container-main pt-2 pb-8 relative z-10" data-scroll-container>
          <span className="eyebrow-pill mb-6">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: accentColor }} />
            PRODUCT {product.number}
          </span>
          <h1
            className="text-text-primary mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {product.name}
          </h1>
          <p className="text-body-lg max-w-[560px] leading-relaxed text-text-secondary">
            {product.shortIntro}
          </p>
        </section>

        <main data-scroll-container>
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
              <h2 className="text-h2 text-text-primary mb-8">Have questions about {product.name}?</h2>
              <Link
                href="/#contact"
                className="btn-primary-gradient inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold"
              >
                Get in Touch →
              </Link>
            </div>
          </section>
        </main>

        <Footer />
        <FloatingActionButton />
      </div>
    </LocomotiveScrollProvider>
  );
}
