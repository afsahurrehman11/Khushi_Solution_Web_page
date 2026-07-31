'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Country, City } from 'country-state-city';
import SearchableDropdown, { DropdownOption } from '../ui/SearchableDropdown';
import { useEffect } from 'react';

interface ContactFormProps {
  formType: 'purchase' | 'affiliate';
  onSuccess?: () => void;
}

export default function ContactForm({ formType, onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Dropdown State
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [countries, setCountries] = useState<DropdownOption[]>([]);
  const [cities, setCities] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountryCode) {
      const countryCities = City.getCitiesOfCountry(selectedCountryCode);
      if (countryCities) {
        const uniqueCities = Array.from(new Set(countryCities.map(c => c.name))).map(name => ({
          value: name,
          label: name,
        }));
        setCities(uniqueCities);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
    setSelectedCityName('');
  }, [selectedCountryCode]);

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
    
    if (selectedCountryCode) {
       const cObj = Country.getCountryByCode(selectedCountryCode);
       if (cObj) {
         formData.set('country', cObj.name);
       }
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
        setSelectedCountryCode('');
        setSelectedCityName('');
        setTimeout(() => {
          setStatus('idle');
          if (onSuccess) onSuccess();
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Submission failed. Please check your configuration.');
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
        <input type="hidden" name="access_key" value={accessKey} />
        <input type="hidden" name="from_name" value="Khushi Solutions Website" />
        <input 
          type="hidden" 
          name="form_type" 
          value={formType === 'purchase' ? 'Purchase Now Inquiry' : 'Become Affiliate Broker Inquiry'} 
        />
        <input 
          type="hidden" 
          name="subject" 
          value={formType === 'purchase' ? 'New Purchase Inquiry' : 'New Affiliate Broker Application'} 
        />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input required name="name" type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input required name="business_name" type="text" placeholder="Acme Corp" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input required name="email" type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input required name="phone" type="tel" placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                Country <span className="text-red-500">*</span>
              </label>
              <SearchableDropdown options={countries} value={selectedCountryCode} onChange={setSelectedCountryCode} placeholder="Search Country..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                City <span className="text-red-500">*</span>
              </label>
              <SearchableDropdown name="city" options={cities} value={selectedCityName} onChange={setSelectedCityName} placeholder={selectedCountryCode ? "Search City..." : "Select Country first"} disabled={!selectedCountryCode || cities.length === 0} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              Full Address
            </label>
            <input name="address" type="text" placeholder="123 Business Avenue, Suite 100" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm" />
          </div>

          {formType === 'affiliate' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                  Current Occupation <span className="text-red-500">*</span>
                </label>
                <input required name="occupation" type="text" placeholder="E.g. Software Consultant, Agency Owner" className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                  Relevant Experience
                </label>
                <textarea name="experience" rows={2} placeholder="Briefly describe your experience..." className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-y min-h-[80px] text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
                  Why join as an Affiliate?
                </label>
                <textarea name="why_join" rows={2} placeholder="Let us know your goals..." className="w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-y min-h-[80px] text-sm" />
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">
              {formType === 'purchase' ? 'Message / Requirements' : 'Additional Information'} <span className="text-red-500">*</span>
            </label>
            <textarea required name="message" rows={3} placeholder={formType === 'purchase' ? 'How can we help optimize your operations?' : 'Any other details...'} className={`w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted bg-white border border-border shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-y min-h-[100px] text-sm ${formType === 'purchase' ? 'focus:ring-primary' : 'focus:ring-emerald-500'}`} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all ${
            formType === 'purchase' 
              ? 'btn-primary-gradient' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              SENDING...
            </>
          ) : (
            <>
              {formType === 'purchase' ? 'SUBMIT INQUIRY' : 'SUBMIT APPLICATION'}
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 shadow-sm z-20">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm font-medium">Thank you! Your {formType === 'purchase' ? 'inquiry' : 'application'} has been sent successfully.</p>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 shadow-sm z-20">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
