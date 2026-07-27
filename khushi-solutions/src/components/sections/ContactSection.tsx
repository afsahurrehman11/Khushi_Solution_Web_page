'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from './ContactForm';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <span className="eyebrow-pill">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                CONTACT
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-text-primary mb-4">Get in Touch</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="text-body-lg text-text-secondary max-w-[500px] mb-10">
                Ready to upgrade your operations? Send us a message and our technical team will get back to you within 24 hours.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.16}>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 border border-border text-text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-1 uppercase tracking-wider">Email Us</h4>
                    <p className="text-text-secondary">contact@khushisolutions.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 border border-border text-text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-1 uppercase tracking-wider">Call Us</h4>
                    <p className="text-text-secondary">+92 300 1234567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 border border-border text-text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary mb-1 uppercase tracking-wider">Location</h4>
                    <p className="text-text-secondary">Lahore, Pakistan<br />Available for remote deployment globally.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Form Container */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.2} className="h-full">
              <div className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 h-full shadow-sm">
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
