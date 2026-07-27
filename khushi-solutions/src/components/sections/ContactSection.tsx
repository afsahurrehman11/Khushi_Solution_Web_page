'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ContactForm from './ContactForm';

export default function ContactSection() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@khushisolutions.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 XXX XXXXXXX';
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Lahore, Pakistan';

  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <span
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34d399',
                  letterSpacing: '0.12em',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                CONTACT
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-white mb-4">Get in Touch</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="text-body-lg max-w-[440px] mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Have a project in mind or want to learn more about our platforms? We&apos;d love to hear from you.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0" strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <a href={`mailto:${email}`} className="text-body hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0" strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-body hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 shrink-0" strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span className="text-body" style={{ color: 'rgba(255,255,255,0.8)' }}>{address}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.2}>
              <div
                className="glass-card rounded-[var(--radius-lg)] overflow-hidden"
              >
                <ContactForm dark />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
