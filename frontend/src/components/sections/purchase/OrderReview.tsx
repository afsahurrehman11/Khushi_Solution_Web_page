import { Plan } from './usePurchaseFlow';
import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

interface OrderReviewProps {
  plan: Plan;
  formData: any;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
  accentClass: string;
}

export default function OrderReview({ plan, formData, onConfirm, onBack, isLoading, accentClass }: OrderReviewProps) {
  const isDelivery = !!formData.product_data.business_name;
  
  return (
    <div className="max-w-2xl mx-auto glass-card p-6 md:p-8 rounded-[var(--radius-xl)] border border-border">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h3 className="text-xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          Review Your Order
        </h3>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
          <div>
            <h4 className="font-bold text-text-primary">{plan.label}</h4>
            <p className="text-sm text-text-secondary">Registration Fee</p>
          </div>
          <div className="text-right">
            <div className="font-extrabold text-lg text-text-primary">
              {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="text-text-muted">Account Name:</div>
          <div className="text-right font-medium text-text-primary">{formData.customer.name}</div>
          
          <div className="text-text-muted">Email:</div>
          <div className="text-right font-medium text-text-primary">{formData.customer.email}</div>
          
          <div className="text-text-muted">{isDelivery ? 'Business' : 'Institution'}:</div>
          <div className="text-right font-medium text-text-primary">
            {isDelivery ? formData.product_data.business_name : formData.product_data.institution_name}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Your payment will be securely processed by <strong>AssanPay</strong>. You will be redirected to their secure checkout page. Khushi Solutions does not store your payment information.
        </p>
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        } ${accentClass === 'text-primary' ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            {plan.amount_pkr === 0 ? 'Complete Registration' : 'Proceed to Payment'}
          </>
        )}
      </button>
    </div>
  );
}
