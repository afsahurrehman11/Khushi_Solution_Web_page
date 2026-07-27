import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductOverview from '@/components/sections/ProductOverview';
import ProofSection from '@/components/sections/ProofSection';
import ContactSection from '@/components/sections/ContactSection';
import SectionSeparator from '@/components/ui/SectionSeparator';

/*
 * Main Single-Page Website
 * Compact homepage structure for v2.1
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        <SectionSeparator variant="darkTransition" direction="down" fromColor="var(--color-surface)" />

        {/* 2. Company Introduction */}
        <AboutSection />

        <SectionSeparator variant="fade" direction="down" fromColor="var(--color-surface)" toColor="var(--color-white)" />

        {/* 3. Product Overview */}
        <ProductOverview />

        <SectionSeparator variant="fade" direction="down" fromColor="var(--color-white)" toColor="var(--color-surface)" />

        {/* 4. Why Khushi Solutions */}
        <ProofSection />

        <SectionSeparator variant="darkTransition" direction="down" fromColor="var(--color-surface)" />

        {/* 5. Contact */}
        <ContactSection />
        
        <SectionSeparator variant="line" theme="dark" />
      </main>

      <Footer />
    </>
  );
}
