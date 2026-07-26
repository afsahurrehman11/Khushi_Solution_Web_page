'use client';

import { useState, type FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm(initialForm);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  /* Success state */
  if (status === 'success') {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <CheckCircle className="w-12 h-12 text-success mb-4" strokeWidth={1.5} />
        <h3 className="text-h3 text-text-primary mb-2">Thank You</h3>
        <p className="text-body text-text-secondary max-w-[360px]">
          Thank you for contacting Khushi Solutions. We&apos;ll get back to you within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputBase =
    'w-full h-[46px] px-4 bg-white border border-border rounded-[var(--radius-sm)] text-text-primary text-sm placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors duration-200';
  const errorInput = 'border-error focus:border-error focus:ring-error/20';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[var(--radius-lg)] p-6 md:p-8 shadow-[var(--shadow-md)]"
      noValidate
    >
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="text-small text-text-secondary font-medium block mb-1.5">
            Name <span className="text-error">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`${inputBase} ${errors.name ? errorInput : ''}`}
            placeholder="Your full name"
            required
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
        </div>

        {/* Phone + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-phone" className="text-small text-text-secondary font-medium block mb-1.5">
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputBase}
              placeholder="+92 XXX XXXXXXX"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-small text-text-secondary font-medium block mb-1.5">
              Email <span className="text-error">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`${inputBase} ${errors.email ? errorInput : ''}`}
              placeholder="you@company.com"
              required
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="contact-subject" className="text-small text-text-secondary font-medium block mb-1.5">
            Subject <span className="text-error">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            value={form.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={`${inputBase} ${errors.subject ? errorInput : ''}`}
            placeholder="What is this about?"
            required
          />
          {errors.subject && <p className="text-xs text-error mt-1">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="text-small text-text-secondary font-medium block mb-1.5">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={5}
            className={`${inputBase} h-auto py-3 resize-none ${errors.message ? errorInput : ''}`}
            placeholder="Tell us about your project or question..."
            required
          />
          {errors.message && <p className="text-xs text-error mt-1">{errors.message}</p>}
        </div>

        {/* Error banner */}
        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/20 rounded-[var(--radius-sm)]">
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
            <p className="text-small text-error">
              Something went wrong. Please try again or contact us directly via email.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 h-[46px] px-6 bg-primary text-white font-medium text-sm rounded-[var(--radius-sm)] hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 mt-2"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
