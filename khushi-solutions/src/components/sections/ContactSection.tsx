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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left — Info (55% on lg = col-span-7) */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <span className="text-technical text-white/70 inline-block mb-3">
                CONTACT
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-white mb-4">
                Get in Touch
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <p className="text-body-lg text-white/80 max-w-[440px] mb-10">
                Have a project in mind or want to learn more about our platforms? We&apos;d love to hear from you.
              </p>
            </ScrollReveal>

            {/* Contact details */}
            <ScrollReveal delay={0.16}>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white/50 shrink-0" strokeWidth={1.5} />
                  <a
                    href={`mailto:${email}`}
                    className="text-body text-white/85 hover:text-white transition-colors"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white/50 shrink-0" strokeWidth={1.5} />
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-body text-white/85 hover:text-white transition-colors"
                  >
                    {phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/50 shrink-0" strokeWidth={1.5} />
                  <span className="text-body text-white/85">
                    {address}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Form (45% on lg = col-span-5) */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.2}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
