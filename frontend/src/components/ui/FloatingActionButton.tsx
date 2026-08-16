'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function FloatingActionButton() {
  const { scrollTo } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.location.href = '/#contact';
    } else {
      scrollTo('#contact');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed z-[99999]"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        left: 'auto',
        top: 'auto',
        zIndex: 99999,
      }}
    >
      <button
        onClick={handleClick}
        aria-label="Go to Contact"
        className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 btn-primary-gradient shadow-xl"
      >
        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
        {/* Tooltip */}
        <span
          className="absolute right-16 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Contact Us
        </span>
      </button>
    </motion.div>
  );
}
