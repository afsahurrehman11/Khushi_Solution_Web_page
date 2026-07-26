import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductOverview from '@/components/sections/ProductOverview';
import ProductShowcase from '@/components/sections/ProductShowcase';
import CapabilityGrid from '@/components/sections/CapabilityGrid';
import FeatureDeepDive from '@/components/sections/FeatureDeepDive';
import FeatureCompact from '@/components/sections/FeatureCompact';
import ProductWorkflow from '@/components/sections/ProductWorkflow';
import ProofSection from '@/components/sections/ProofSection';
import ContactSection from '@/components/sections/ContactSection';
import { product1, product2 } from '@/data/products';

/*
 * Main Single-Page Website
 * Content flow follows KHUSHI-SOLUTIONS-DESIGN-SYSTEM.md Section 49.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Company Introduction */}
        <AboutSection />

        {/* 3. Product Overview — introduces both products */}
        <ProductOverview />

        {/* ============================================ */}
        {/* PRODUCT 1: BITES — Blue Accent               */}
        {/* ============================================ */}

        {/* 4. Product 1 Showcase */}
        <ProductShowcase product={product1} />

        {/* 5. Product 1 Key Capabilities */}
        <CapabilityGrid
          capabilities={product1.capabilities}
          accent={product1.accent}
          productName={product1.name}
          productNumber={product1.number}
        />

        {/* 6. Product 1 Feature Deep Dive (Top 3) */}
        <FeatureDeepDive
          features={product1.topFeatures}
          accent={product1.accent}
          productNumber={product1.number}
        />

        {/* 7. Product 1 Remaining Features (5 more) */}
        <FeatureCompact
          features={product1.remainingFeatures}
          accent={product1.accent}
          productNumber={product1.number}
        />

        {/* 8. Product 1 Architecture */}
        <ProductWorkflow product={product1} />

        {/* ============================================ */}
        {/* PRODUCT 2: KHUSHI SMS — Green Accent          */}
        {/* ============================================ */}

        {/* 9. Product 2 Showcase */}
        <ProductShowcase product={product2} />

        {/* 10. Product 2 Key Capabilities */}
        <CapabilityGrid
          capabilities={product2.capabilities}
          accent={product2.accent}
          productName={product2.name}
          productNumber={product2.number}
        />

        {/* 11. Product 2 Feature Deep Dive (Top 3) */}
        <FeatureDeepDive
          features={product2.topFeatures}
          accent={product2.accent}
          productNumber={product2.number}
        />

        {/* 12. Product 2 Remaining Features (3 more) */}
        <FeatureCompact
          features={product2.remainingFeatures}
          accent={product2.accent}
          productNumber={product2.number}
        />

        {/* 13. Product 2 Architecture */}
        <ProductWorkflow product={product2} />

        {/* 14. Why Khushi Solutions — Evidence Section */}
        <ProofSection />

        {/* 15. Contact */}
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
