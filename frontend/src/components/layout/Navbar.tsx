'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/data/company';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

function NavbarContent() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleProductLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (pathname !== '/') {
      router.push(`/?highlight=${id}#products`);
      return;
    }

    // If on homepage
    scrollTo('#products');
    
    // Update URL to trigger highlight in ProductOverview without hard reload
    setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('highlight', id);
      router.replace(`${pathname}?${newParams.toString()}#products`, { scroll: false });
    }, 500); // Wait a bit for scroll to start before highlighting
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileOpen(false);
    
    // Check if it's the affiliate link
    if (href.includes('form=affiliate')) {
      e.preventDefault();
      
      // If we are not on the homepage, navigate to the homepage with a special hash
      if (pathname !== '/') {
        router.push(href);
        return;
      }
      
      // If we ARE on the homepage, smoothly scroll to #contact first
      scrollTo('#contact');
      
      // Then wait 1.2s and append the query param to open the modal
      setTimeout(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('form', 'affiliate');
        router.replace(`${pathname}?${newParams.toString()}#contact`, { scroll: false });
      }, 1200);
    } else if (href.startsWith('/#')) {
      // Standard hash links (About, Why Us, etc)
      if (pathname === '/') {
        e.preventDefault();
        scrollTo(href.substring(1));
      }
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      scrollTo('#contact');
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Floating Pill Navbar (Light Neumorphic) */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-[1056px] px-4 z-[999999]">
        <nav
          className="flex items-center justify-between w-full h-[60px] px-5 sm:px-8 relative"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(255,255,255,0.5) inset',
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/images/company/logo.png" alt="Khushi Solutions" width={32} height={32} className="w-8 h-8" priority />
            <span className="font-bold text-[15px] text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Khushi Solutions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-full hover:bg-slate-100/50 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Products Dropdown - Pure CSS Hover */}
            <div className="relative flex items-center h-full py-2 group cursor-pointer">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-text-secondary group-hover:text-text-primary rounded-full group-hover:bg-slate-100/50 transition-all duration-200"
              >
                Products
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[210px] z-[999999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {/* Invisible h-8 connector bridge overlay to prevent gap closing */}
                <div className="absolute -top-6 left-0 right-0 h-8 bg-transparent" />

                <div className="relative z-10 rounded-xl overflow-hidden border border-slate-900/10 shadow-2xl bg-white/95 backdrop-blur-2xl p-1.5"
                  style={{ boxShadow: '0 20px 40px rgba(15,23,42,0.2)' }}
                >
                  <a
                    href="/?highlight=khushi-delivery#products"
                    className="group/item flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={(e) => handleProductLinkClick(e, 'khushi-delivery')}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-text-primary">Khushi Delivery</div>
                        <div className="text-[10px] text-text-muted">Delivery & POS</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-secondary opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                  </a>

                  <a
                    href="/?highlight=khushi-erp#products"
                    className="group/item flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={(e) => handleProductLinkClick(e, 'khushi-erp')}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-text-primary">Khushi SMS</div>
                        <div className="text-[10px] text-text-muted">School ERP & Apps</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Us - highlighted CTA */}
            <Link
              href="/#contact"
              onClick={handleContactClick}
              className="btn-primary-gradient ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold !text-white rounded-full transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col pt-[100px] px-4"
            style={{ background: 'rgba(248, 250, 252, 0.98)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={(e) => handleNavClick(e, item.href)}
                  className="text-text-primary font-bold text-xl py-4 px-4 hover:text-secondary transition-colors border-b border-border">
                  {item.label}
                </Link>
              ))}
              <div className="py-4 px-4 border-b border-border">
                <div className="text-xs text-text-muted mb-4 tracking-widest font-bold">PRODUCTS</div>
                <div className="flex flex-col gap-3">
                  <Link href="/?highlight=khushi-delivery#products" onClick={(e) => handleProductLinkClick(e, 'khushi-delivery')} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-border">
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-secondary" /><span className="font-semibold text-text-primary">Khushi Delivery</span></div>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </Link>
                  <Link href="/?highlight=khushi-erp#products" onClick={(e) => handleProductLinkClick(e, 'khushi-erp')} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-border">
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-primary" /><span className="font-semibold text-text-primary">Khushi SMS</span></div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </Link>
                </div>
              </div>
              <Link href="/#contact" onClick={handleContactClick}
                className="mt-6 flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold text-lg btn-primary-gradient">
                <MessageCircle className="w-5 h-5" /> Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 backdrop-blur-md border-b border-border" />}>
      <NavbarContent />
    </Suspense>
  );
}
