'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/data/company';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let closeTimeout: NodeJS.Timeout;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown interactions
  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* Close mobile menu on anchor click */
  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  /* Close menus on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setIsDropdownOpen(false);
      }
    };
    if (isMobileOpen || isDropdownOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isMobileOpen, isDropdownOpen]);

  /* Handle body scroll lock on mobile menu open */
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const textColor = isScrolled ? 'text-text-primary' : 'text-white';
  const linkColor = isScrolled ? 'text-text-secondary' : 'text-white/90';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-border shadow-[var(--shadow-xs)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container-main flex items-center justify-between h-[64px] lg:h-[72px]"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 shrink-0 z-50">
          <Image
            src="/images/company/logo.png"
            alt="Khushi Solutions"
            width={36}
            height={36}
            className="w-8 h-8 lg:w-9 lg:h-9"
            priority
          />
          <span
            className={`font-semibold text-[15px] lg:text-base tracking-tight transition-colors duration-300 ${textColor}`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Khushi Solutions
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            if (item.label === 'Products') return null; // We handle products separately
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${linkColor}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Products Dropdown */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-primary ${linkColor}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              Products
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[320px] bg-white border border-border shadow-[var(--shadow-md)] rounded-[var(--radius-md)] overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-1">
                    <Link
                      href="/products/bites"
                      className="group flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div>
                          <div className="font-semibold text-text-primary text-sm font-heading">
                            Bites
                          </div>
                          <div className="text-text-muted text-xs mt-0.5">
                            Delivery & business management
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <Link
                      href="/products/khushi-erp"
                      className="group flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-surface transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                        <div>
                          <div className="font-semibold text-text-primary text-sm font-heading">
                            Khushi SMS
                          </div>
                          <div className="text-text-muted text-xs mt-0.5">
                            School ERP & mobile ecosystem
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/#contact"
            className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${linkColor}`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 -mr-2 z-50 relative focus-visible"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 text-text-primary" />
          ) : (
            <Menu className={`w-6 h-6 ${textColor}`} />
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
            className="lg:hidden fixed inset-0 z-40 bg-white pt-[72px]"
          >
            <div className="container-main py-4 flex flex-col h-full overflow-y-auto">
              <Link
                href="/#about"
                onClick={handleNavClick}
                className="text-text-primary font-semibold text-lg py-4 px-2 hover:text-primary transition-colors border-b border-border-subtle"
              >
                About
              </Link>
              
              <div className="py-4 px-2 border-b border-border-subtle">
                <div className="text-text-muted text-sm mb-3 px-1 font-medium">PRODUCTS</div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/products/bites"
                    onClick={handleNavClick}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] bg-surface hover:bg-primary-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-semibold text-text-primary">Bites</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </Link>
                  <Link
                    href="/products/khushi-erp"
                    onClick={handleNavClick}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] bg-surface hover:bg-secondary-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="font-semibold text-text-primary">Khushi SMS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </Link>
                </div>
              </div>

              <Link
                href="/#why-us"
                onClick={handleNavClick}
                className="text-text-primary font-semibold text-lg py-4 px-2 hover:text-primary transition-colors border-b border-border-subtle"
              >
                Why Us
              </Link>
              
              <Link
                href="/#contact"
                onClick={handleNavClick}
                className="text-text-primary font-semibold text-lg py-4 px-2 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
