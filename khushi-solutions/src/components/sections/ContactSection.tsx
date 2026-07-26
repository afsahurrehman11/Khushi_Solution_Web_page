'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ContactForm from './ContactForm';

export default function ContactSection() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX';
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan';

  return (
    <section id="contact" className="bg-primary-dark section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — Info */}
          <div>
            <ScrollReveal>
              <span className="text-technical text-primary/60 inline-block mb-5">
                KHUSHI SOLUTIONS / CONTACT
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-text-inverse mb-4">
                Let&apos;s Build Something Together
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="text-body-lg text-text-inverse/60 max-w-[440px] mb-10">
                Have a project in mind or want to learn more about our platforms? We&apos;d love to hear from you.
              </p>
            </ScrollReveal>

            {/* Contact details */}
            <ScrollReveal delay={0.16}>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary/60 shrink-0" strokeWidth={1.5} />
                  <a
                    href={`mailto:${email}`}
                    className="text-body text-text-inverse/70 hover:text-text-inverse transition-colors"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary/60 shrink-0" strokeWidth={1.5} />
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-body text-text-inverse/70 hover:text-text-inverse transition-colors"
                  >
                    {phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary/60 shrink-0" strokeWidth={1.5} />
                  <span className="text-body text-text-inverse/70">
                    {address}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Form */}
          <ScrollReveal delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
