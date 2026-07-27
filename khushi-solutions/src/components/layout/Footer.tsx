import Image from 'next/image';
import Link from 'next/link';
import { navItems } from '@/data/company';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Very subtle glass stripe */}
      <div style={{ background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(10px)' }}>
        <div className="container-main py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <Image
                  src="/images/company/logo.png"
                  alt="Khushi Solutions"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="font-semibold text-[15px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Khushi Solutions
                </span>
              </Link>
              <p className="text-small max-w-[280px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Software that helps businesses deliver, manage, and grow.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-technical mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>NAVIGATION</h4>
              <ul className="flex flex-col gap-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-technical mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>PRODUCTS</h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link href="/products/bites" className="text-sm hover:text-white transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Bites
                  </Link>
                </li>
                <li>
                  <Link href="/products/khushi-erp" className="text-sm hover:text-white transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Khushi SMS
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-technical mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>CONTACT</h4>
              <ul className="flex flex-col gap-2.5">
                <li className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com'}
                </li>
                <li className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX'}
                </li>
                <li className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan'}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-small" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © {currentYear} Khushi Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
