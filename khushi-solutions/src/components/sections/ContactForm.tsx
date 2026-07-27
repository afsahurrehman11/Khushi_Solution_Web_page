'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        e.currentTarget.reset();
        // Clear success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Name
            </label>
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              required
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
            Company (Optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Your Business Name"
            className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
            Message
          </label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            placeholder="How can we help you?"
            className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-gradient mt-2 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              SENDING...
            </>
          ) : (
            <>
              SEND MESSAGE
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Status Toasts */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -bottom-16 left-0 right-0 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 shadow-sm z-20"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium">Message sent! We&apos;ll be in touch soon.</p>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -bottom-16 left-0 right-0 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 shadow-sm z-20"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
