'use client';

import { useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { usePurchaseFlow } from './usePurchaseFlow';
import PlanSelector from './PlanSelector';
import OrderReview from './OrderReview';
import DeliveryPurchaseForm from './DeliveryPurchaseForm';
import ErpPurchaseForm from './ErpPurchaseForm';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface PurchaseSectionProps {
  product: any;
}

export default function PurchaseSection({ product }: PurchaseSectionProps) {
  const {
    state,
    plans,
    selectedPlan,
    formData,
    error,
    fetchPricing,
    selectPlan,
    submitForm,
    confirmPurchase,
    reset
  } = usePurchaseFlow(product.id);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const isBlue = product.accent === 'blue';
  const accentClass = isBlue ? 'text-primary' : 'text-secondary';
  
  const isDelivery = product.id === 'khushi-delivery';

  return (
    <section id="purchase" className="bg-surface section-padding relative overflow-hidden">
      <div className="container-main relative z-10">
        
        {/* Header */}
        {(state === 'idle' || state === 'filling_form' || state === 'reviewing') && (
          <div className="text-center mb-12">
            <ScrollReveal delay={0.05}>
              <span className={`text-technical ${accentClass} inline-block mb-2 font-bold tracking-widest`}>
                PURCHASE / REGISTRATION
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="text-h2 text-text-primary mb-3 font-extrabold tracking-tight">
                {state === 'idle' ? 'Select a Plan to Get Started' : 'Complete Your Registration'}
              </h2>
            </ScrollReveal>
          </div>
        )}

        {/* Global Error Banner */}
        {error && state !== 'api_error' && state !== 'network_error' && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-800 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Flow States */}
        <div className="relative min-h-[400px]">
          {state === 'idle' && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <PlanSelector plans={plans} onSelect={selectPlan} accentClass={accentClass} />
            </div>
          )}

          {state === 'filling_form' && selectedPlan && isDelivery && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <DeliveryPurchaseForm plan={selectedPlan} onSubmit={submitForm} onBack={reset} accentClass={accentClass} />
            </div>
          )}
          
          {state === 'filling_form' && selectedPlan && !isDelivery && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <ErpPurchaseForm plan={selectedPlan} onSubmit={submitForm} onBack={reset} accentClass={accentClass} />
            </div>
          )}

          {state === 'reviewing' && selectedPlan && formData && (
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
              <OrderReview 
                plan={selectedPlan} 
                formData={formData} 
                onConfirm={confirmPurchase} 
                onBack={() => reset()} 
                isLoading={false}
                accentClass={accentClass} 
              />
            </div>
          )}

          {(state === 'creating_purchase' || state === 'redirecting_to_payment') && (
            <div className="py-24 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className={`w-12 h-12 border-4 border-slate-100 rounded-full mx-auto mb-6 animate-spin ${
                accentClass === 'text-primary' ? 'border-t-primary' : 'border-t-secondary'
              }`} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {state === 'creating_purchase' ? 'Creating your account...' : 'Redirecting to AssanPay...'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Please wait while we connect to our secure checkout gateway.</p>
            </div>
          )}
          
          {(state === 'api_error' || state === 'network_error') && (
            <div className="py-12 text-center max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500 bg-white p-8 rounded-2xl border border-slate-300 shadow-md">
               <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-primary" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">Checkout Gateway Notice</h3>
               <p className="text-xs text-slate-600 mb-6 leading-relaxed font-medium">
                 {error || "We couldn't connect to the payment gateway at this moment. Don't worry! Your registration information is safe. You can try again or return to plans."}
               </p>
               <div className="flex items-center justify-center gap-3">
                 <button 
                   onClick={reset} 
                   className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                 >
                   <ArrowLeft className="w-3.5 h-3.5" /> Return to Plans
                 </button>
                 <button 
                   onClick={() => confirmPurchase()} 
                   className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ${
                     isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'
                   }`}
                 >
                   <RefreshCw className="w-3.5 h-3.5" /> Retry Checkout
                 </button>
               </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
