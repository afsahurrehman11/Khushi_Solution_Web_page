'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/data/company';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let closeTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => { clearTimeout(closeTimeout); setIsDropdownOpen(true); };
  const handleMouseLeave = () => { closeTimeout = setTimeout(() => setIsDropdownOpen(false), 150); };
  const handleNavClick = () => setIsMobileOpen(false);

  return (
    <>
      {/* Floating Pill Navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className="flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 h-[52px]"
          style={{
            background: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/images/company/logo.png" alt="Khushi Solutions" width={30} height={30} className="w-7 h-7" priority />
            <span className="font-semibold text-sm text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Khushi Solutions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Products Dropdown */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/75 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[280px] rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(4, 10, 30, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className="p-2">
                      <Link href="/products/bites" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          <div>
                            <div className="text-sm font-semibold text-white">Bites</div>
                            <div className="text-xs text-white/45 mt-0.5">Delivery & business management</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                      <Link href="/products/khushi-erp" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <div className="text-sm font-semibold text-white">Khushi SMS</div>
                            <div className="text-xs text-white/45 mt-0.5">School ERP & mobile ecosystem</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Us — highlighted CTA */}
            <Link
              href="/#contact"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 16px rgba(16,185,129,0.3)',
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Contact Us
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="lg:hidden p-2 text-white"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col pt-24 px-4"
            style={{ background: 'rgba(2, 6, 23, 0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick}
                  className="text-white font-semibold text-xl py-4 px-3 hover:text-secondary transition-colors border-b border-white/8">
                  {item.label}
                </Link>
              ))}
              <div className="py-4 px-3 border-b border-white/8">
                <div className="text-xs text-white/35 mb-3 tracking-widest font-medium">PRODUCTS</div>
                <div className="flex flex-col gap-2">
                  <Link href="/products/bites" onClick={handleNavClick} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-secondary" /><span className="font-semibold text-white">Bites</span></div>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </Link>
                  <Link href="/products/khushi-erp" onClick={handleNavClick} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="font-semibold text-white">Khushi SMS</span></div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </Link>
                </div>
              </div>
              <Link href="/#contact" onClick={handleNavClick}
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold text-lg"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <MessageCircle className="w-5 h-5" /> Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
