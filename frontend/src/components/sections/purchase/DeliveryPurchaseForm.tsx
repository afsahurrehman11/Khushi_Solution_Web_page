import { useState } from 'react';
import { Plan } from './usePurchaseFlow';
import { ArrowLeft, ArrowRight, UserCircle, Building2, Upload, Check, ImageIcon, FileImage, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeliveryPurchaseFormProps {
  plan: Plan;
  onSubmit: (data: any, files: { [key: string]: File | File[] }) => void;
  onBack: () => void;
  accentClass: string;
}

const STEPS = [
  { id: 'owner', title: 'Owner Info', icon: UserCircle },
  { id: 'business', title: 'Business Details', icon: Building2 },
  { id: 'media', title: 'Media Upload', icon: Upload }
];

export default function DeliveryPurchaseForm({ plan, onSubmit, onBack, accentClass }: DeliveryPurchaseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '',
    business_name: '', business_category: 'food_restaurant', sub_category: '',
    business_address: '', city: '', area_town: '', maps_location: ''
  });
  
  const [files, setFiles] = useState<{ business_logo: File | null, business_photos: File[] }>({
    business_logo: null, business_photos: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files?.length) return;
    if (field === 'business_logo') {
      setFiles(prev => ({ ...prev, business_logo: e.target.files![0] }));
    } else {
      setFiles(prev => ({ ...prev, business_photos: Array.from(e.target.files!) }));
    }
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      return formData.name.length > 1 && formData.email.includes('@') && formData.phone.length > 5;
    }
    if (step === 1) {
      return formData.business_name.length > 1 && formData.business_address.length > 1 && formData.city.length > 1;
    }
    if (step === 2) {
      return files.business_logo !== null;
    }
    return true;
  };

  const nextStep = () => {
    const form = document.getElementById('purchase-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;
    
    const payload = {
      customer: {
        name: formData.name, email: formData.email, phone: formData.phone, whatsapp: formData.whatsapp || undefined
      },
      product_data: {
        business_name: formData.business_name, business_category: formData.business_category, sub_category: formData.sub_category || undefined,
        business_address: formData.business_address, city: formData.city, area_town: formData.area_town, maps_location: formData.maps_location || undefined
      }
    };
    
    onSubmit(payload, {
      business_logo: files.business_logo as File,
      business_photos: files.business_photos
    });
  };

  const isBlue = accentClass.includes('primary');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Navigation & Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={onBack} type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60 text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Registration</h3>
              <p className="text-xs text-slate-500 font-medium">Fill in the details to proceed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white ${isBlue ? 'bg-primary' : 'bg-secondary'}`}>
              {plan.label}
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Minimal Progress Stepper */}
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((step, idx) => {
            const active = idx === currentStep;
            const completed = idx < currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => { if (completed) setCurrentStep(idx); }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                  active ? (isBlue ? 'bg-blue-50/80 border border-blue-200 text-blue-700' : 'bg-emerald-50/80 border border-emerald-200 text-emerald-700') :
                  completed ? 'bg-slate-50 text-slate-700 hover:bg-slate-100' :
                  'text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  active ? (isBlue ? 'bg-primary text-white' : 'bg-secondary text-white') :
                  completed ? 'bg-slate-200 text-slate-700' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {completed ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-bold truncate hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
        <form id="purchase-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: OWNER INFO */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-slate-900">Owner Contact Information</h4>
                  <p className="text-xs text-slate-500">Enter your primary contact details.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input required minLength={2} name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                    <input required minLength={6} name="phone" placeholder="+1234567890 or 03001234567" value={formData.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">WhatsApp (optional)</label>
                    <input name="whatsapp" placeholder="+1234567890" value={formData.whatsapp} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BUSINESS INFO */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-slate-900">Business Details</h4>
                  <p className="text-xs text-slate-500">Enter information about your store or restaurant.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Name *</label>
                    <input required minLength={2} name="business_name" value={formData.business_name} onChange={handleChange} className={inputClass} placeholder="e.g. Khushi Foods" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
                    <div className="relative">
                      <select required name="business_category" value={formData.business_category} onChange={handleChange} className={`${inputClass} appearance-none pr-8 cursor-pointer`}>
                        <option value="food_restaurant">Food & Restaurant</option>
                        <option value="grocery">Grocery</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="general_retail">General Retail</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronRight className="w-4 h-4 rotate-90 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sub-Category (optional)</label>
                    <input name="sub_category" placeholder="e.g. Fast Food" value={formData.sub_category} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Complete Address *</label>
                    <input required minLength={3} name="business_address" value={formData.business_address} onChange={handleChange} className={inputClass} placeholder="Shop 1, Main Street" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City *</label>
                    <input required minLength={2} name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Lahore" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Area / Town *</label>
                    <input required minLength={2} name="area_town" value={formData.area_town} onChange={handleChange} className={inputClass} placeholder="Gulberg" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MEDIA & SUBMIT */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-slate-900">Upload Media</h4>
                  <p className="text-xs text-slate-500">Attach logo and storefront images.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Box 1 */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-800 mb-1">Business Logo *</span>
                    <span className="text-[11px] text-slate-400 mb-3">PNG, JPG up to 2MB</span>
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                      {files.business_logo ? files.business_logo.name : 'Choose File'}
                      <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'business_logo')} className="hidden" />
                    </label>
                  </div>
                  
                  {/* File Box 2 */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <FileImage className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-800 mb-1">Store Photos</span>
                    <span className="text-[11px] text-slate-400 mb-3">Optional multiple files</span>
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                      {files.business_photos.length > 0 ? `${files.business_photos.length} Selected` : 'Choose Files'}
                      <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'business_photos')} className="hidden" />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer Actions */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 0 ? (
              <button type="button" onClick={prevStep} className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${isBlue ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="submit" 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${isBlue ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}
              >
                Complete <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
