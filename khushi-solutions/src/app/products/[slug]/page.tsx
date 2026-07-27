import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductDetailHero from '@/components/sections/ProductDetailHero';
import CapabilityGrid from '@/components/sections/CapabilityGrid';
import ProductFeatures from '@/components/sections/ProductFeatures';
import HowItWorks from '@/components/sections/HowItWorks';
import SectionSeparator from '@/components/ui/SectionSeparator';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.slug);
  
  if (!product) {
    return { title: 'Product Not Found - Khushi Solutions' };
  }

  return {
    title: `${product.name} - Khushi Solutions`,
    description: product.shortIntro,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-[64px] lg:pt-[72px]">
      {/* Back Navigation */}
      <div className="bg-white border-b border-border sticky top-[64px] lg:top-[72px] z-40">
        <div className="container-main py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-sm font-semibold font-heading text-text-primary hidden sm:block">
            {product.name}
          </div>
        </div>
      </div>

      {/* 1. Hero */}
      <ProductDetailHero product={product} />

      {/* 2. Capabilities */}
      <CapabilityGrid 
        capabilities={product.capabilities} 
        accent={product.accent} 
        productName={product.name}
        productNumber={product.number}
      />

      <SectionSeparator variant="fade" direction="down" fromColor="var(--color-surface)" toColor="var(--color-white)" />

      {/* 3. Deep Dive Features */}
      <ProductFeatures product={product} />

      <SectionSeparator variant="darkTransition" direction="down" fromColor={product.features.length % 2 === 0 ? "var(--color-surface)" : "var(--color-white)"} />

      {/* 4. How It Works */}
      <HowItWorks product={product} />
      
      <SectionSeparator variant="darkTransition" direction="up" fromColor="var(--color-primary-dark)" />

      {/* Contact CTA */}
      <section className="bg-primary-dark py-16 md:py-24">
        <div className="container-main text-center flex flex-col items-center">
          <h2 className="text-h2 text-white mb-6">Have questions about {product.name}?</h2>
          <Link 
            href="/#contact"
            className="inline-flex items-center justify-center h-[46px] px-8 bg-secondary text-white font-medium rounded-[var(--radius-sm)] hover:bg-secondary-hover transition-colors text-sm"
          >
            Get in Touch <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
