'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingActionButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <Link
        href="#contact"
        aria-label="Go to Contact"
        className="group w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: '0 4px 24px rgba(16,185,129,0.5), 0 0 0 4px rgba(16,185,129,0.15)',
        }}
      >
        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
        {/* Tooltip */}
        <span
          className="absolute right-16 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          Contact Us
        </span>
      </Link>
    </motion.div>
  );
}
