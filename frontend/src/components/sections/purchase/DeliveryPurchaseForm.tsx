import { useState } from 'react';
import { Plan } from './usePurchaseFlow';
import { 
  ArrowLeft, ArrowRight, UserCircle, Building2, Upload, Check, 
  ImageIcon, FileImage, ChevronRight, AlertCircle, User, Mail, 
  Phone, MessageSquare, Store, Tag, MapPin, Building, Percent, Lock,
  Navigation, Compass, CheckCircle2, X, Plus, Landmark, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeliveryPurchaseFormProps {
  plan: Plan;
  onSubmit: (data: any, files: { [key: string]: File | File[] }) => void;
  onBack: () => void;
  accentClass: string;
}

const STEPS = [
  { id: 'owner', title: '1. Owner Info', icon: UserCircle },
  { id: 'business', title: '2. Business & Payouts', icon: Building2 },
  { id: 'media', title: '3. Media & Checkout', icon: Upload }
];

export default function DeliveryPurchaseForm({ plan, onSubmit, onBack, accentClass }: DeliveryPurchaseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFileError, setShowFileError] = useState(false);
  
  // GPS Location state
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '',
    business_name: '', business_category: 'food_restaurant', sub_category: '',
    business_address: '', city: '', area_town: '', maps_location: '',
    bank_name: '', account_title: '', account_number_iban: ''
  });
  
  const [files, setFiles] = useState<{ business_logo: File | null, business_photos: File[] }>({
    business_logo: null, business_photos: []
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [stepError, setStepError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (stepError) setStepError(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setFiles(prev => ({ ...prev, business_logo: file }));
    setLogoPreview(URL.createObjectURL(file));
    setShowFileError(false);
    if (stepError) setStepError(null);
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);
    setFiles(prev => ({ ...prev, business_photos: [...prev.business_photos, ...newFiles] }));
    const newUrls = newFiles.map(f => URL.createObjectURL(f));
    setPhotoPreviews(prev => [...prev, ...newUrls]);
    setShowFileError(false);
    if (stepError) setStepError(null);
  };

  const handleRemoveLogo = () => {
    setFiles(prev => ({ ...prev, business_logo: null }));
    setLogoPreview(null);
  };

  const handleRemovePhoto = (index: number) => {
    setFiles(prev => ({
      ...prev,
      business_photos: prev.business_photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Detecting shop GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setCoords({ latitude: lat, longitude: lng });
        setFormData(prev => ({ ...prev, maps_location: `Lat: ${lat}, Lng: ${lng}` }));
        setIsLocating(false);
        setLocationStatus('GPS Coordinates captured successfully!');
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Location permission denied. You can enter Latitude & Longitude manually below.');
        } else {
          setLocationStatus('Could not retrieve location. Please enter coordinates manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validateStep = (step: number) => {
    if (step === 0) {
      return formData.name.trim().length >= 2 && formData.email.includes('@') && formData.phone.trim().length >= 3;
    }
    if (step === 1) {
      return (
        formData.business_name.trim().length >= 2 && 
        formData.city.trim().length >= 2 && 
        formData.business_address.trim().length >= 2 && 
        formData.area_town.trim().length >= 2 &&
        formData.bank_name.trim().length >= 2 &&
        formData.account_title.trim().length >= 2 &&
        formData.account_number_iban.trim().length >= 3
      );
    }
    if (step === 2) {
      return files.business_logo !== null && files.business_photos.length >= 3;
    }
    return true;
  };

  const nextStep = () => {
    setStepError(null);

    if (currentStep === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setStepError('Please enter your Full Name.');
        return;
      }
      if (!formData.email || !formData.email.includes('@')) {
        setStepError('Please enter a valid Email Address.');
        return;
      }
      if (!formData.phone || formData.phone.trim().length < 3) {
        setStepError('Please enter a valid Mobile Number.');
        return;
      }
    }

    if (currentStep === 1) {
      if (!formData.business_name.trim() || formData.business_name.trim().length < 2) {
        setStepError('Please enter your Business Name.');
        return;
      }
      if (!formData.city.trim() || formData.city.trim().length < 2) {
        setStepError('Please enter your City.');
        return;
      }
      if (!formData.business_address.trim() || formData.business_address.trim().length < 2) {
        setStepError('Please enter your Complete Address.');
        return;
      }
      if (!formData.area_town.trim() || formData.area_town.trim().length < 2) {
        setStepError('Please enter your Area / Town.');
        return;
      }
      if (!formData.bank_name.trim() || formData.bank_name.trim().length < 2) {
        setStepError('Please enter your Bank Name / Institution for payouts.');
        return;
      }
      if (!formData.account_title.trim() || formData.account_title.trim().length < 2) {
        setStepError('Please enter your Bank Account Title / Holder Name.');
        return;
      }
      if (!formData.account_number_iban.trim() || formData.account_number_iban.trim().length < 3) {
        setStepError('Please enter your Bank Account Number or IBAN.');
        return;
      }
    }

    setShowFileError(false);
    setStepError(null);
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    setTimeout(() => {
      const el = document.getElementById('purchase-form') || document.getElementById('purchase');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const prevStep = () => {
    setShowFileError(false);
    setStepError(null);
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setTimeout(() => {
      const el = document.getElementById('purchase-form') || document.getElementById('purchase');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.business_logo || files.business_photos.length < 3) {
      setShowFileError(true);
      return;
    }
    
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;
    
    const payload = {
      customer: {
        name: formData.name, email: formData.email, phone: formData.phone, whatsapp: formData.whatsapp || undefined
      },
      product_data: {
        business_name: formData.business_name, business_category: formData.business_category, sub_category: formData.sub_category || undefined,
        business_address: formData.business_address, city: formData.city, area_town: formData.area_town, maps_location: formData.maps_location || undefined,
        bank_name: formData.bank_name, account_title: formData.account_title, account_number_iban: formData.account_number_iban
      }
    };
    
    onSubmit(payload, {
      business_logo: files.business_logo as File,
      business_photos: files.business_photos
    });
  };

  const isBlue = accentClass.includes('primary');

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.12 } }
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none shadow-2xs`;

  return (
    <div className="max-w-xl mx-auto">
      {/* Top Navigation & Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-5 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <button onClick={onBack} type="button" className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 bg-slate-50 text-slate-700 shadow-2xs shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">Registration & Checkout</h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">Fill in details to proceed to checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white whitespace-nowrap shadow-2xs ${isBlue ? 'bg-primary' : 'bg-secondary'}`}>
              {plan.label}
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 whitespace-nowrap shadow-2xs">
              {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Responsive Stepper Tabs with Visible Titles on Mobile */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {STEPS.map((step, idx) => {
            const active = idx === currentStep;
            const completed = idx < currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => { 
                  if (completed) {
                    setShowFileError(false);
                    setCurrentStep(idx); 
                  }
                }}
                className={`flex items-center justify-center sm:justify-start gap-1.5 p-2 sm:p-2.5 rounded-xl text-left transition-all ${
                  active ? (isBlue ? 'bg-blue-50 border-2 border-primary text-primary font-bold shadow-2xs' : 'bg-emerald-50 border-2 border-secondary text-secondary font-bold shadow-2xs') :
                  completed ? 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200/70 font-semibold' :
                  'bg-slate-50/80 border border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] sm:text-[11px] font-bold ${
                  active ? (isBlue ? 'bg-primary text-white' : 'bg-secondary text-white') :
                  completed ? 'bg-slate-300 text-slate-800' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {completed ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold truncate leading-tight">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Main Form Container - Compact & Proportional */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-300 p-5 md:p-6 shadow-sm">
        <form id="purchase-form" onSubmit={handleSubmit}>
          {stepError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 flex items-center gap-2 text-xs font-bold shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{stepError}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: OWNER INFO */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3.5">
                <div className="mb-3 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCircle className="w-4 h-4 text-primary" /> Owner Contact Information
                  </h4>
                  <p className="text-[11px] text-slate-500">Enter your primary contact details.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-primary" /> Full Name *
                    </label>
                    <input required minLength={2} name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-primary" /> Email Address *
                    </label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-primary" /> Mobile Number *
                    </label>
                    <input required type="text" name="phone" placeholder="Enter mobile or phone number" value={formData.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-primary" /> WhatsApp (optional)
                    </label>
                    <input type="text" name="whatsapp" placeholder="WhatsApp number" value={formData.whatsapp} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BUSINESS INFO */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-3.5">
                <div className="mb-3 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary" /> Business Details
                  </h4>
                  <p className="text-[11px] text-slate-500">Enter information about your store or restaurant.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Store className="w-3 h-3 text-primary" /> Business Name *
                    </label>
                    <input required minLength={2} name="business_name" value={formData.business_name} onChange={handleChange} className={inputClass} placeholder="e.g. Khushi Foods" />
                  </div>
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-primary" /> Business Category *
                    </label>
                    <div className="relative">
                      <select required name="business_category" value={formData.business_category} onChange={handleChange} className={`${inputClass} appearance-none pr-7 cursor-pointer`}>
                        <option value="food_restaurant">Food & Restaurant</option>
                        <option value="grocery" disabled>Grocery (Coming Soon)</option>
                        <option value="pharmacy" disabled>Pharmacy (Coming Soon)</option>
                        <option value="general_retail" disabled>General Retail (Coming Soon)</option>
                        <option value="other" disabled>Other (Coming Soon)</option>
                      </select>
                      <ChevronRight className="w-3.5 h-3.5 rotate-90 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                    </div>
                  </div>

                  {/* Separate Commission Rate Field */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Percent className="w-3 h-3 text-primary" /> Applicable Commission Rate
                    </label>
                    <div className="relative">
                      <input 
                        readOnly 
                        disabled 
                        value={formData.business_category === 'food_restaurant' ? '15% per order' : 'N/A'} 
                        className="w-full px-3.5 py-2.5 rounded-lg border border-blue-300 bg-blue-50 text-xs font-bold text-blue-900 cursor-not-allowed outline-none" 
                      />
                      <Lock className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-primary" /> Sub-Category (optional)
                    </label>
                    <input name="sub_category" placeholder="e.g. Fast Food" value={formData.sub_category} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-primary" /> City *
                    </label>
                    <input required minLength={2} name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Lahore" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary" /> Complete Address *
                    </label>
                    <input required minLength={3} name="business_address" value={formData.business_address} onChange={handleChange} className={inputClass} placeholder="Shop 1, Main Street" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary" /> Area / Town *
                    </label>
                    <input required minLength={2} name="area_town" value={formData.area_town} onChange={handleChange} className={inputClass} placeholder="Gulberg" />
                  </div>

                  {/* Shop GPS Location Section */}
                  <div className="sm:col-span-2 p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2.5">
                    <div className="flex items-start justify-between gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-900 flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-primary" /> Shop GPS Location Coordinates
                        </label>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                          Capture GPS coordinates for exact order routing.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="px-2.5 py-1.5 rounded-md bg-primary text-white font-bold text-[11px] hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0 shadow-2xs disabled:opacity-50"
                      >
                        <Compass className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                        {isLocating ? 'Detecting...' : 'Get Location'}
                      </button>
                    </div>

                    {locationStatus && (
                      <div className={`text-[10px] font-bold flex items-center gap-1 ${
                        locationStatus.includes('successfully') ? 'text-emerald-800' : 'text-slate-700'
                      }`}>
                        {locationStatus.includes('successfully') && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                        {locationStatus}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Latitude</label>
                        <input
                          name="latitude"
                          placeholder="e.g. 31.5204"
                          value={coords.latitude}
                          onChange={(e) => {
                            setCoords(prev => ({ ...prev, latitude: e.target.value }));
                            setFormData(prev => ({ ...prev, maps_location: `Lat: ${e.target.value}, Lng: ${coords.longitude}` }));
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Longitude</label>
                        <input
                          name="longitude"
                          placeholder="e.g. 74.3587"
                          value={coords.longitude}
                          onChange={(e) => {
                            setCoords(prev => ({ ...prev, longitude: e.target.value }));
                            setFormData(prev => ({ ...prev, maps_location: `Lat: ${coords.latitude}, Lng: ${e.target.value}` }));
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vendor Payout & Settlement Bank Account Section */}
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-slate-300 space-y-3 shadow-2xs">
                    <div className="border-b border-slate-200 pb-2">
                      <label className="block text-[11px] font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-primary" /> Vendor Payout & Bank Account Details *
                      </label>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Enter bank details for future automated payouts, disbursements, and settlements.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-primary" /> Bank Name / Institution *
                        </label>
                        <input 
                          required 
                          minLength={2}
                          name="bank_name" 
                          value={formData.bank_name} 
                          onChange={handleChange} 
                          className={inputClass} 
                          placeholder="e.g. Meezan Bank, HBL, JazzCash, EasyPaisa" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-primary" /> Account Title / Holder Name *
                        </label>
                        <input 
                          required 
                          minLength={2}
                          name="account_title" 
                          value={formData.account_title} 
                          onChange={handleChange} 
                          className={inputClass} 
                          placeholder="Exact title as on bank statement" 
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-primary" /> Account Number / IBAN *
                        </label>
                        <input 
                          required 
                          minLength={3}
                          name="account_number_iban" 
                          value={formData.account_number_iban} 
                          onChange={handleChange} 
                          className={inputClass} 
                          placeholder="Account # or 24-digit IBAN (e.g. PK36...)" 
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 3: MEDIA & SUBMIT */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="mb-2 pb-2.5 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-primary" /> Business Media & Previews
                  </h4>
                  <p className="text-[11px] text-slate-500">Upload mandatory logo and shop photos to complete registration.</p>
                </div>

                {showFileError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-300 text-red-800 flex items-center gap-2 text-[11px] font-bold animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    {!files.business_logo && files.business_photos.length < 3 ? (
                      'Please upload your Business Logo AND at least 3 Business Photos.'
                    ) : !files.business_logo ? (
                      'Please select a Business Logo before completing registration.'
                    ) : (
                      `Please upload at least 3 Business Photos (current: ${files.business_photos.length}/3).`
                    )}
                  </div>
                )}

                {/* 1. BUSINESS LOGO PREVIEW SECTION */}
                <div className="p-3.5 border border-slate-300 rounded-xl bg-white space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-primary" /> Business Logo *
                      </span>
                      <span className="text-[10px] text-slate-500">Main brand logo (PNG, JPG, WEBP, ICO up to 2MB)</span>
                    </div>
                    {files.business_logo && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>

                  {logoPreview ? (
                    <div className="relative w-28 h-28 rounded-lg border-2 border-slate-300 overflow-hidden group shadow-sm bg-slate-100">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove Logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      showFileError && !files.business_logo ? 'border-red-400 bg-red-50/50 hover:bg-red-50/80' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                    }`}>
                      <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                      <span className="text-[11px] font-bold text-slate-800">Choose Business Logo</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Click to browse files (PNG, JPG, WEBP, ICO)</span>
                      <input type="file" accept="image/*,.ico" onChange={handleLogoChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* 2. BUSINESS STORE PHOTOS (MINIMUM 3 REQUIRED) */}
                <div className="p-3.5 border border-slate-300 rounded-xl bg-white space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                        <FileImage className="w-3 h-3 text-primary" /> Storefront Photos (Min 3) *
                      </span>
                      <span className="text-[10px] text-slate-500">Photos of storefront, interior, or products</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      files.business_photos.length >= 3 
                        ? 'text-emerald-800 bg-emerald-100 border-emerald-300' 
                        : 'text-amber-800 bg-amber-100 border-amber-300'
                    }`}>
                      {files.business_photos.length >= 3 && <CheckCircle2 className="w-3 h-3" />}
                      {files.business_photos.length} / 3 Uploaded
                    </span>
                  </div>

                  {/* Medium Preview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-0.5">
                    {photoPreviews.map((url, idx) => (
                      <div key={idx} className="relative h-24 rounded-lg border-2 border-slate-300 overflow-hidden group shadow-sm bg-slate-100">
                        <img src={url} alt={`Store photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-sm"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add More Photos Button box */}
                    <label className={`h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      showFileError && files.business_photos.length < 3 ? 'border-red-400 bg-red-50/50 hover:bg-red-50/80' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                    }`}>
                      <Plus className="w-5 h-5 text-slate-500 mb-0.5" />
                      <span className="text-[11px] font-bold text-slate-800">Add Photos</span>
                      <span className="text-[9px] text-slate-500">Select images</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotosChange} className="hidden" />
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
                className={`flex items-center gap-1.5 px-5.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white transition-all shadow-sm ${isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'}`}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
