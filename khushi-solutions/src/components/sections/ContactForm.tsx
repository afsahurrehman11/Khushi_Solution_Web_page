'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    if (!formData.get('access_key') && accessKey) {
      formData.set('access_key', accessKey);
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        formElement.reset();
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Submission failed. Please check your Web3Forms configuration.');
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
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 relative z-10"
      >
        {/* Hidden Web3Forms Access Key Input */}
        <input
          type="hidden"
          name="access_key"
          value={accessKey}
        />

        {/* Optional Web3Forms Customization */}
        <input type="hidden" name="from_name" value="Khushi Solutions Website" />

        {/* Grid Row 1: Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="phone"
              name="phone"
              type="tel"
              placeholder="0321 0666500"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Grid Row 2: Email & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="subject"
              name="subject"
              type="text"
              placeholder="Inquiry about Bites Delivery / Khushi SMS"
              className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Grid Row 3: Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            placeholder="How can we help optimize your operations?"
            className="w-full px-4 py-3.5 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y min-h-[120px] text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-gradient mt-2 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
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
            className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 shadow-sm z-20"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm font-medium">Thank you! Your message has been sent successfully via Web3Forms.</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 shadow-sm z-20"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
