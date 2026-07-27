import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductOverview from '@/components/sections/ProductOverview';
import ProofSection from '@/components/sections/ProofSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import LocomotiveScrollProvider from '@/components/layout/LocomotiveScrollProvider';
import GlowingBubblesBackground from '@/components/ui/GlowingBubblesBackground';

export const metadata = {
  title: 'Khushi Solutions — Software That Runs Real Businesses',
  description: 'Delivery platforms and school management systems — built and proven in production.',
};

export default function Home() {
  return (
    <LocomotiveScrollProvider>
      <div className="premium-bg">
        <Navbar />

        <main data-scroll-container>
          {/* Unified Hero + About wrapper with continuous interactive glowing bubbles & bottom fade mask */}
          <div className="relative overflow-hidden">
            <GlowingBubblesBackground />
            <HeroSection />
            <AboutSection />
          </div>

          <ProductOverview />
          <ProofSection />
          <FAQSection />
          <ContactSection />
        </main>

        <Footer />
        <FloatingActionButton />
      </div>
    </LocomotiveScrollProvider>
  );
}
