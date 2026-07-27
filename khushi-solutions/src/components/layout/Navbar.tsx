'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/data/company';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollTo } = useSmoothScroll();

  /* Opens dropdown and keeps it visible for 2 seconds (2000ms) */
  const triggerDropdown = () => {
    setIsDropdownOpen(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
    /* Maintain the 2s window without closing instantly */
    if (!closeTimeoutRef.current) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 2000);
    }
  };

  const handleProductLinkClick = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    window.location.href = href;
  };

  const handleNavClick = () => setIsMobileOpen(false);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      scrollTo('#contact');
    }
    handleNavClick();
  };

  return (
    <>
      {/* Floating Pill Navbar (Light Neumorphic) */}
      <header className="fixed top-5 left-0 right-0 z-[999999] flex justify-center px-4 pointer-events-auto">
        <nav
          className="flex items-center justify-between w-full max-w-5xl px-5 sm:px-8 h-[60px] relative z-[999999]"
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
                className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-full hover:bg-slate-100/50 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Products Dropdown — Stay visible for 2s on hover or click */}
            <div
              className="relative flex items-center h-full py-2 group"
              onPointerEnter={triggerDropdown}
              onPointerLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-text-secondary group-hover:text-text-primary rounded-full group-hover:bg-slate-100/50 transition-all duration-200"
                onClick={() => {
                  if (isDropdownOpen) {
                    setIsDropdownOpen(false);
                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  } else {
                    triggerDropdown();
                  }
                }}
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -2, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -2, scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    onPointerEnter={triggerDropdown}
                    onPointerLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[210px] z-[999999]"
                  >
                    {/* Invisible h-6 connector bridge overlay */}
                    <div className="absolute -top-4 left-0 right-0 h-6 bg-transparent" />

                    <div className="relative z-10 rounded-xl overflow-hidden border border-slate-900/10 shadow-2xl bg-white/95 backdrop-blur-2xl p-1.5"
                      style={{
                        boxShadow: '0 20px 40px rgba(15,23,42,0.2)',
                      }}
                    >
                      <Link 
                        href="/products/bites" 
                        className="group/item flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" 
                        onClick={(e) => handleProductLinkClick(e, '/products/bites')}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-text-primary">Bites</div>
                            <div className="text-[10px] text-text-muted">Delivery & POS</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-secondary opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                      </Link>

                      <Link 
                        href="/products/khushi-erp" 
                        className="group/item flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" 
                        onClick={(e) => handleProductLinkClick(e, '/products/khushi-erp')}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-text-primary">Khushi SMS</div>
                            <div className="text-[10px] text-text-muted">School ERP & Apps</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Us — highlighted CTA */}
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
                <Link key={item.href} href={item.href} onClick={handleNavClick}
                  className="text-text-primary font-bold text-xl py-4 px-4 hover:text-secondary transition-colors border-b border-border">
                  {item.label}
                </Link>
              ))}
              <div className="py-4 px-4 border-b border-border">
                <div className="text-xs text-text-muted mb-4 tracking-widest font-bold">PRODUCTS</div>
                <div className="flex flex-col gap-3">
                  <Link href="/products/bites" onClick={handleNavClick} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-border">
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-secondary" /><span className="font-semibold text-text-primary">Bites</span></div>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </Link>
                  <Link href="/products/khushi-erp" onClick={handleNavClick} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-border">
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
