import Image from 'next/image';
import Link from 'next/link';
import { navItems } from '@/data/company';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      {/* Hairline separator */}
      <div className="w-full h-px bg-white/20" />

      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image
                src="/images/company/logo.png"
                alt="Khushi Solutions"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span
                className="font-semibold text-[15px] text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Khushi Solutions
              </span>
            </Link>
            <p className="text-small text-white/80 max-w-[280px] leading-relaxed">
              Software that helps businesses deliver, manage, and grow.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-technical text-white/60 mb-4">
              NAVIGATION
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-technical text-white/60 mb-4">
              PRODUCTS
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/products/bites"
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                >
                  Bites
                </Link>
              </li>
              <li>
                <Link
                  href="/products/khushi-erp"
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                >
                  Khushi SMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-technical text-white/60 mb-4">
              CONTACT
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <span className="text-sm text-white/80">
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com'}
                </span>
              </li>
              <li>
                <span className="text-sm text-white/80">
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX'}
                </span>
              </li>
              <li>
                <span className="text-sm text-white/80">
                  {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-small text-white/50">
            © {currentYear} Khushi Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
