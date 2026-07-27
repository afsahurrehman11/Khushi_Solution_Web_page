import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CapabilityGrid from '@/components/sections/CapabilityGrid';
import ProductFeatures from '@/components/sections/ProductFeatures';
import ProductDetailHero from '@/components/sections/ProductDetailHero';
import HowItWorks from '@/components/sections/HowItWorks';
import Navbar from '@/components/layout/Navbar';
import ContactSection from '@/components/sections/ContactSection';
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

        {/* 2-Column Hero Section */}
        <ProductDetailHero product={product} />

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

          {/* Contact Section */}
          <ContactSection />
        </main>

        <Footer />
      </div>
    </LocomotiveScrollProvider>
  );
}
