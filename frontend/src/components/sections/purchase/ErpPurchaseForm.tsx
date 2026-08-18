import { useState } from 'react';
import { Plan } from './usePurchaseFlow';
import { 
  ArrowLeft, ArrowRight, UserCircle, Building2, Upload, Check, 
  ImageIcon, ChevronRight, User, Mail, Phone, Building, MapPin, 
  Users, GraduationCap, Briefcase 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErpPurchaseFormProps {
  plan: Plan;
  onSubmit: (data: any, files: { [key: string]: File | File[] }) => void;
  onBack: () => void;
  accentClass: string;
}

const STEPS = [
  { id: 'contact', title: 'Contact Person', icon: UserCircle },
  { id: 'institution', title: 'Institution Details', icon: Building2 },
  { id: 'media', title: 'Media Upload', icon: Upload }
];

export default function ErpPurchaseForm({ plan, onSubmit, onBack, accentClass }: ErpPurchaseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '', designation: '',
    institution_name: '', institution_type: 'school', institution_email: '', institution_phone: '',
    complete_address: '', city: '', area_town: '',
    student_count: '', teacher_staff_count: '', campus_count: '1'
  });
  
  const [files, setFiles] = useState<{ institution_images: File[] }>({
    institution_images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFiles({ institution_images: Array.from(e.target.files) });
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      return formData.name.trim().length > 1 && formData.designation.trim().length > 1 && formData.email.includes('@') && formData.phone.trim().length > 2;
    }
    if (step === 1) {
      return formData.institution_name.trim().length > 1 && formData.institution_email.includes('@') && formData.institution_phone.trim().length > 2 && formData.complete_address.trim().length > 1 && formData.city.trim().length > 1;
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
        institution_name: formData.institution_name, institution_type: formData.institution_type,
        institution_email: formData.institution_email, institution_phone: formData.institution_phone,
        complete_address: formData.complete_address, city: formData.city, area_town: formData.area_town || undefined,
        contact_name: formData.name, contact_designation: formData.designation, contact_email: formData.email,
        contact_phone: formData.phone, contact_whatsapp: formData.whatsapp || undefined,
        student_count: formData.student_count ? parseInt(formData.student_count) : undefined,
        teacher_staff_count: formData.teacher_staff_count ? parseInt(formData.teacher_staff_count) : undefined,
        campus_count: formData.campus_count ? parseInt(formData.campus_count) : 1
      }
    };
    
    onSubmit(payload, {
      institution_images: files.institution_images
    });
  };

  const isBlue = accentClass.includes('primary');

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.12 } }
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/80 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none shadow-2xs`;

  return (
    <div className="max-w-xl mx-auto">
      {/* Top Navigation & Stepper Header */}
      <div className="bg-white rounded-xl border border-slate-300 p-4 md:p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <button onClick={onBack} type="button" className="p-1.5 hover:bg-slate-100 rounded-md transition-colors border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">ERP Registration</h3>
              <p className="text-[11px] text-slate-500 font-medium">Fill in institutional details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs ${isBlue ? 'bg-primary' : 'bg-secondary'}`}>
              {plan.label}
            </span>
            <span className="text-[11px] font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 shadow-2xs">
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
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                  active ? (isBlue ? 'bg-blue-50 border-2 border-primary text-primary font-bold shadow-2xs' : 'bg-emerald-50 border-2 border-secondary text-secondary font-bold shadow-2xs') :
                  completed ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200/70 font-semibold' :
                  'bg-slate-50/80 border border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold ${
                  active ? (isBlue ? 'bg-primary text-white' : 'bg-secondary text-white') :
                  completed ? 'bg-slate-300 text-slate-800' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {completed ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                </div>
                <span className="text-[11px] truncate hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Form Container - Compact & Proportional */}
      <div className="bg-slate-50/90 rounded-xl border border-slate-300 p-5 md:p-6 shadow-sm">
        <form id="purchase-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CONTACT INFO */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3.5">
                <div className="mb-3 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCircle className="w-4 h-4 text-secondary" /> Contact Person Details
                  </h4>
                  <p className="text-[11px] text-slate-500">Representative or principal information.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-secondary" /> Full Name *
                    </label>
                    <input required minLength={2} name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-secondary" /> Designation *
                    </label>
                    <input required minLength={2} name="designation" placeholder="e.g. Director" value={formData.designation} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-secondary" /> Email Address *
                    </label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-secondary" /> Mobile Number *
                    </label>
                    <input required type="text" name="phone" placeholder="Enter mobile or phone number" value={formData.phone} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: INSTITUTION INFO */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3.5">
                <div className="mb-3 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-secondary" /> Institution Information
                  </h4>
                  <p className="text-[11px] text-slate-500">Key details about your campus or school.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-secondary" /> Institution Name *
                    </label>
                    <input required minLength={2} name="institution_name" value={formData.institution_name} onChange={handleChange} className={inputClass} placeholder="e.g. Allied Public School" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3 text-secondary" /> Type *
                    </label>
                    <div className="relative">
                      <select required name="institution_type" value={formData.institution_type} onChange={handleChange} className={`${inputClass} appearance-none pr-7 cursor-pointer`}>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="madrasa">Madrasa</option>
                        <option value="university">University</option>
                        <option value="academy">Academy</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronRight className="w-3.5 h-3.5 rotate-90 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-secondary" /> Official Email *
                    </label>
                    <input required type="email" name="institution_email" value={formData.institution_email} onChange={handleChange} className={inputClass} placeholder="info@school.edu" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-secondary" /> Institution Phone *
                    </label>
                    <input required type="text" name="institution_phone" value={formData.institution_phone} onChange={handleChange} className={inputClass} placeholder="042-1234567" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-secondary" /> City *
                    </label>
                    <input required minLength={2} name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Lahore" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-secondary" /> Complete Address *
                    </label>
                    <input required minLength={3} name="complete_address" value={formData.complete_address} onChange={handleChange} className={inputClass} placeholder="Building 1, Main Campus" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:col-span-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-secondary" /> Total Students
                      </label>
                      <input type="number" min="0" name="student_count" value={formData.student_count} onChange={handleChange} className={inputClass} placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-secondary" /> Total Staff
                      </label>
                      <input type="number" min="0" name="teacher_staff_count" value={formData.teacher_staff_count} onChange={handleChange} className={inputClass} placeholder="e.g. 30" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MEDIA & SUBMIT */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3.5">
                <div className="mb-2 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-secondary" /> Institution Images
                  </h4>
                  <p className="text-[11px] text-slate-500">Upload optional photos of your campus or logo.</p>
                </div>

                <div>
                  <div className="p-5 border border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center text-center shadow-2xs">
                    <ImageIcon className="w-7 h-7 text-slate-500 mb-1.5" />
                    <span className="text-[11px] font-bold text-slate-900 mb-0.5">Campus / Building Images</span>
                    <span className="text-[10px] text-slate-500 mb-3">PNG, JPG up to 5MB each</span>
                    <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors shadow-2xs">
                      {files.institution_images.length > 0 ? `${files.institution_images.length} Files Selected` : 'Choose Files'}
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer Actions */}
          <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 0 ? (
              <button type="button" onClick={prevStep} className="px-4 py-2 rounded-lg font-bold text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-2xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-xs text-white transition-all shadow-sm ${isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'}`}
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button 
                type="submit" 
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-xs text-white transition-all shadow-sm ${isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'}`}
              >
                Complete <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
