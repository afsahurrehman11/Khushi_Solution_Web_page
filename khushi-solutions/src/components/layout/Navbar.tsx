'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/data/company';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on anchor click */
  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  /* Close mobile menu on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    if (isMobileOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-[var(--shadow-xs)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container-main flex items-center justify-between h-[64px] lg:h-[72px]"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="#" className="relative flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/company/logo.png"
            alt="Khushi Solutions"
            width={36}
            height={36}
            className="w-8 h-8 lg:w-9 lg:h-9"
            priority
          />
          <span
            className={`font-semibold text-[15px] lg:text-base tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-text-primary' : 'text-text-inverse'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Khushi Solutions
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-text-secondary' : 'text-text-inverse/80'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-[var(--radius-sm)] hover:bg-primary-hover transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-text-primary' : 'text-text-inverse'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-text-primary' : 'text-text-inverse'}`} />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-[var(--shadow-md)]"
          >
            <div className="container-main py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="text-text-secondary font-medium py-3 px-4 rounded-[var(--radius-sm)] hover:bg-surface transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={handleNavClick}
                className="mt-2 inline-flex items-center justify-center px-5 py-3 bg-primary text-white text-sm font-medium rounded-[var(--radius-sm)] hover:bg-primary-hover transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
