'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, Layers, Settings, Users } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const faqs: FAQItem[] = [
  {
    id: 'how-to-use',
    icon: MessageCircle,
    question: 'How can I use the app?',
    answer:
      'You can contact us using the contact form below, and our team will get in touch to set you up. We handle the full onboarding process — from account creation to training your team.',
  },
  {
    id: 'is-free',
    icon: Layers,
    question: 'Is Khushi SMS free?',
    answer:
      'Yes, the core platform is free to use, excluding a few premium features which are available at a very minimalistic cost. We believe good software should be accessible to every school.',
  },
  {
    id: 'customizable',
    icon: Settings,
    question: 'Can the solutions be customized?',
    answer:
      'Absolutely. We build scalable software tailored to the specific operational needs of your business. Our team works closely with clients to understand their workflows and configure the platform accordingly.',
  },
  {
    id: 'multi-school',
    icon: Users,
    question: 'Does Khushi SMS support multiple school branches?',
    answer:
      'Yes. Khushi SMS is built as a multi-tenant platform. Each school branch gets its own isolated data environment while sharing the same application — perfect for chains and educational groups.',
  },
  {
    id: 'data-security',
    icon: MessageCircle,
    question: 'How is our data kept secure?',
    answer:
      'All data is encrypted in transit and at rest. We use isolated tenant databases, role-based access control, and forced session expiry policies to ensure your institution\'s data is never exposed.',
  },
];

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const Icon = item.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
      style={{
        background: isOpen ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)',
        border: isOpen
          ? '1px solid rgba(16,185,129,0.35)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isOpen ? '0 0 24px rgba(16,185,129,0.08)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
        aria-expanded={isOpen}
      >
        {/* Icon bubble */}
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300"
          style={{
            background: isOpen ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
            border: isOpen ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
            color: isOpen ? '#34d399' : 'rgba(255,255,255,0.5)',
          }}
        >
          <Icon className="w-4 h-4 transition-colors duration-300" strokeWidth={1.75} />
        </div>

        {/* Question */}
        <span
          className="flex-1 text-base font-semibold transition-colors duration-200"
          style={{ color: isOpen ? 'white' : 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-heading)' }}
        >
          {item.question}
        </span>

        {/* Toggle icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: isOpen ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)' }}
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2} />
        </motion.div>
      </button>

      {/* Answer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5 md:px-6 md:pb-6 pl-[72px]"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <p className="text-base leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('how-to-use');

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section id="faq" className="section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(44,100,180,0.1)',
              border: '1px solid rgba(44,100,180,0.3)',
              color: '#60a5fa',
              letterSpacing: '0.12em',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            FAQ
          </span>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left header */}
          <div className="lg:col-span-4 xl:col-span-3">
            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-white mb-4">
                Commonly Asked Questions
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Everything you need to know about our products and how to get started.
              </p>
            </ScrollReveal>
          </div>

          {/* FAQ rows */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-3">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.id} delay={0.06 * i}>
                <FAQRow
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
