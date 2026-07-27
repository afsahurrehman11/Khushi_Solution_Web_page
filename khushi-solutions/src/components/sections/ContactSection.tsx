'use client';

import { Mail, MapPin, Phone, MessageSquare, Users } from 'lucide-react';
import ContactForm from './ContactForm';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getContactInfo } from '@/data/company';

export default function ContactSection() {
  const contact = getContactInfo();

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
              <p className="text-body-lg text-text-secondary max-w-[500px] mb-8">
                Ready to upgrade your operations? Send us a message or reach out on WhatsApp directly. Our technical team responds within hours.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.16}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Us */}
                <a 
                  href={`mailto:${contact.email}`} 
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-blue-500/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-600 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-0.5 uppercase tracking-wider">Email Us</h4>
                    <p className="text-xs text-text-secondary font-medium group-hover:text-blue-600 transition-colors truncate">{contact.email}</p>
                  </div>
                </a>

                {/* WhatsApp Direct */}
                <a 
                  href={contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-emerald-500/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-0.5 uppercase tracking-wider">WhatsApp Chat</h4>
                    <p className="text-xs text-text-secondary font-medium group-hover:text-emerald-600 transition-colors">{contact.phone}</p>
                  </div>
                </a>

                {/* WhatsApp Community */}
                <a 
                  href={contact.whatsappCommunity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white hover:bg-slate-50 hover:border-emerald-500/40 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-0.5 uppercase tracking-wider">Join Community</h4>
                    <p className="text-xs text-text-secondary font-medium group-hover:text-emerald-600 transition-colors">WhatsApp Group & Updates</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-text-primary border border-slate-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary mb-0.5 uppercase tracking-wider">Location</h4>
                    <p className="text-xs text-text-secondary font-medium">{contact.address}</p>
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
