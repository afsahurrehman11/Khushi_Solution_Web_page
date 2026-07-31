'use client';

import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { Mail, MapPin, MessageSquare, Users, Building, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ContactForm from './ContactForm';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getContactInfo } from '@/data/company';

function ContactSectionContent() {
  const contact = getContactInfo();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [activeModal, setActiveModal] = useState<'purchase' | 'affiliate' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const formParam = searchParams.get('form');
    if (formParam === 'affiliate') {
      setActiveModal('affiliate');
    } else if (formParam === 'purchase') {
      setActiveModal('purchase');
    }
  }, [searchParams]);

  // Handle closing modal and removing URL params
  const closeModal = () => {
    setActiveModal(null);
    // Remove ?form param from URL without refreshing
    if (searchParams.has('form')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('form');
      router.replace(`${pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}#contact`, { scroll: false });
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  return (
    <section id="contact" className="section-padding relative">
      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ScrollReveal>
              <span className="eyebrow-pill">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                GET IN TOUCH
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-text-primary mb-4">Contact Khushi Solutions</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="text-body-lg text-text-secondary mb-8">
                Ready to upgrade your operations? Send us a message or reach out on WhatsApp directly. Our technical team responds within hours.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <a href={`mailto:${contact.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white/50 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Email Us</h4>
                    <p className="text-sm text-text-secondary font-medium truncate">{contact.email}</p>
                  </div>
                </a>

                <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white/50 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">WhatsApp Chat</h4>
                    <p className="text-sm text-text-secondary font-medium">{contact.phone}</p>
                  </div>
                </a>

                <a href={contact.whatsappCommunity} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white/50 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Join Community</h4>
                    <p className="text-sm text-text-secondary font-medium">WhatsApp Group & Updates</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white/50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Location</h4>
                    <p className="text-sm text-text-secondary font-medium">{contact.address}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interaction Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Purchase Card */}
                <div className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 shadow-md border border-slate-200/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-text-primary mb-3">Sales & Inquiries</h3>
                  <p className="text-sm text-text-secondary mb-8 flex-1 leading-relaxed">
                    Get a customized quote for Khushi Delivery or Khushi SMS tailored to your specific business operations.
                  </p>
                  <button
                    onClick={() => setActiveModal('purchase')}
                    className="btn-primary-gradient w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all text-white flex justify-center items-center gap-2"
                  >
                    Start Inquiry
                  </button>
                </div>

                {/* Affiliate Card */}
                <div className="glass-card rounded-[var(--radius-xl)] p-6 md:p-8 shadow-md border border-slate-200/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-text-primary mb-3">Partner Program</h3>
                  <p className="text-sm text-text-secondary mb-8 flex-1 leading-relaxed">
                    Join our network. Become an Affiliate Broker, resell our platforms, and earn recurring revenue.
                  </p>
                  <button
                    onClick={() => setActiveModal('affiliate')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30 w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
                  >
                    Apply Now
                  </button>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      {/* Form Modal Overlay — Rendered via Portal directly into document.body to ensure top z-index above Footer */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[999998]"
              />
              <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-[999999] pointer-events-auto cursor-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  className="w-full max-w-2xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className={`p-5 sm:p-6 flex items-center justify-between border-b ${
                    activeModal === 'purchase' ? 'bg-white border-slate-100' : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeModal === 'purchase' ? 'bg-blue-100 text-primary' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {activeModal === 'purchase' ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-text-primary leading-tight">
                          {activeModal === 'purchase' ? 'Purchase Inquiry' : 'Affiliate Application'}
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {activeModal === 'purchase' 
                            ? 'Fill out the details below to request a quote.' 
                            : 'Join the Khushi Solutions partner network.'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={closeModal}
                      className="p-2 rounded-full hover:bg-black/5 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar">
                    <ContactForm 
                      formType={activeModal} 
                      onSuccess={() => setTimeout(closeModal, 1500)} 
                    />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
}

export default function ContactSection() {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ContactSectionContent />
    </Suspense>
  );
}
