import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductOverview from '@/components/sections/ProductOverview';
import ProofSection from '@/components/sections/ProofSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export const metadata = {
  title: 'Khushi Solutions — Software That Runs Real Businesses',
  description: 'Delivery platforms and school management systems — built and proven in production.',
};

export default function Home() {
  return (
    <div className="premium-bg">
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <ProductOverview />
        <ProofSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}
