'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navItems, company } from '@/data/company';
import { ArrowUpRight } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { scrollTo } = useSmoothScroll();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && window.location.pathname === '/') {
      e.preventDefault();
      scrollTo(href);
    }
  };

  return (
    <footer className="relative mt-20 border-t border-border bg-white overflow-hidden">
      {/* Decorative gradient blur in corner */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle, var(--color-canvas-mint) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <div className="container-main relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image src="/images/company/logo.png" alt="Khushi Solutions" width={36} height={36} className="w-9 h-9" />
              <span className="font-bold text-lg text-text-primary tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {company.name}
              </span>
            </Link>
            <p className="text-text-secondary text-sm max-w-[320px] mb-8 leading-relaxed">
              Software engineering for businesses that require high reliability, scale, and operational excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary hover:bg-slate-200 transition-colors border border-border">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-muted hover:text-primary hover:bg-slate-200 transition-colors border border-border">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">Company</h4>
            <ul className="flex flex-col gap-3.5">
              {navItems.map(item => (
                <li key={item.href}>
                  <Link href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">Products</h4>
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link href="/products/bites" className="group flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                  Bites Delivery
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/products/khushi-erp" className="group flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                  Khushi SMS / ERP
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">Contact</h4>
            <ul className="flex flex-col gap-3.5">
              <li className="text-sm text-text-secondary">contact@khushisolutions.com</li>
              <li className="text-sm text-text-secondary">+92 300 1234567</li>
              <li className="text-sm text-text-secondary mt-2">Lahore, Pakistan</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {currentYear} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
