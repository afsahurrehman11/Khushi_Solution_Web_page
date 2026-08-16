'use client';

import { useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { usePurchaseFlow } from './usePurchaseFlow';
import PlanSelector from './PlanSelector';
import OrderReview from './OrderReview';
import DeliveryPurchaseForm from './DeliveryPurchaseForm';
import ErpPurchaseForm from './ErpPurchaseForm';
import { AlertCircle } from 'lucide-react';

interface PurchaseSectionProps {
  product: any; // Using any for simplicity as it matches the existing product data type
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
  
  // Decide which form to show
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
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
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
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {state === 'creating_purchase' ? 'Creating your account...' : 'Redirecting to AssanPay...'}
              </h3>
              <p className="text-text-secondary">Please wait, do not close this page.</p>
            </div>
          )}
          
          {(state === 'api_error' || state === 'network_error') && (
            <div className="py-24 text-center max-w-lg mx-auto animate-in slide-in-from-bottom-4 fade-in duration-500">
               <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-text-primary mb-4">Registration Failed</h3>
               <button onClick={reset} className="btn-primary-gradient px-8 py-3 rounded-full text-white font-bold">
                 Try Again
               </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
