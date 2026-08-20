import { useState } from 'react';
import { Plan } from './usePurchaseFlow';
import { ArrowLeft, ShieldCheck, ShoppingBag, Lock, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderReviewProps {
  plan: Plan;
  formData: any;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
  accentClass: string;
}

export default function OrderReview({ plan, formData, onConfirm, onBack, isLoading, accentClass }: OrderReviewProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isDelivery = !!formData.product_data?.business_name;
  const isBlue = accentClass.includes('primary');

  const handleCheckoutClick = () => {
    if (plan.amount_pkr === 0) {
      onConfirm();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    onConfirm();
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-50/90 rounded-2xl border border-slate-300 p-5 sm:p-7 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200">
        <button 
          onClick={onBack}
          type="button"
          disabled={isLoading}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 bg-white text-slate-700 shadow-2xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">Review Order & Final Checkout</h3>
          <p className="text-xs text-slate-500 font-medium">Verify your details before completing your checkout & registration</p>
        </div>
      </div>

      {/* Order Summary Box */}
      <div className="bg-white rounded-xl p-4 sm:p-5 mb-6 border border-slate-300 shadow-2xs">
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">{plan.label}</h4>
            <p className="text-xs text-slate-500 font-medium">Checkout Plan Package</p>
          </div>
          <div className="text-right">
            <div className="font-black text-xl text-slate-900">
              {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
            </div>
            {plan.amount_pkr > 0 && <span className="text-[11px] text-slate-400 font-semibold">One-time payment</span>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
          <div className="flex justify-between sm:block">
            <span className="text-slate-500 font-semibold">Contact Name:</span>
            <span className="font-bold text-slate-900 block sm:inline sm:ml-2">{formData.customer.name}</span>
          </div>
          
          <div className="flex justify-between sm:block">
            <span className="text-slate-500 font-semibold">Email Address:</span>
            <span className="font-bold text-slate-900 block sm:inline sm:ml-2 truncate">{formData.customer.email}</span>
          </div>
          
          <div className="flex justify-between sm:block">
            <span className="text-slate-500 font-semibold">Phone Number:</span>
            <span className="font-bold text-slate-900 block sm:inline sm:ml-2">{formData.customer.phone}</span>
          </div>

          <div className="flex justify-between sm:block">
            <span className="text-slate-500 font-semibold">{isDelivery ? 'Business Name' : 'Institution'}:</span>
            <span className="font-bold text-slate-900 block sm:inline sm:ml-2">
              {isDelivery ? formData.product_data.business_name : formData.product_data.institution_name}
            </span>
          </div>

          {formData.product_data?.bank_name && (
            <>
              <div className="flex justify-between sm:block">
                <span className="text-slate-500 font-semibold">Payout Bank:</span>
                <span className="font-bold text-slate-900 block sm:inline sm:ml-2">{formData.product_data.bank_name}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-slate-500 font-semibold">Account Title:</span>
                <span className="font-bold text-slate-900 block sm:inline sm:ml-2">{formData.product_data.account_title}</span>
              </div>
              <div className="flex justify-between sm:block sm:col-span-2">
                <span className="text-slate-500 font-semibold">Account # / IBAN:</span>
                <span className="font-bold text-slate-900 block sm:inline sm:ml-2">{formData.product_data.account_number_iban}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AssanPay Payment Partner Notice */}
      <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50/80 rounded-xl border border-blue-200">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-0.5">Official Payment Gateway Partner</span>
          Your payment is encrypted & processed safely via <strong>AssanPay</strong>. Supports EasyPaisa, JazzCash, and all major Debit/Credit cards.
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={handleCheckoutClick}
        disabled={isLoading}
        className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        } ${isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag className="w-4.5 h-4.5" />
            {plan.amount_pkr === 0 ? 'Complete Free Checkout & Registration' : `Proceed to Checkout & Pay (Rs. ${plan.amount_pkr.toLocaleString()})`}
          </>
        )}
      </button>

      {/* AssanPay Redirection Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-md w-full p-5 sm:p-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-primary flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 text-center mb-1">
                Final Checkout & Payment Redirection
              </h4>
              <p className="text-xs text-center text-slate-500 font-medium mb-4">
                AssanPay Gateway Partnership Notice
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2 mb-6">
                <p>
                  You are now being redirected to <strong>AssanPay</strong>, our official payment partner, to safely complete your checkout payment of <strong>Rs. {plan.amount_pkr.toLocaleString()}</strong>.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Supports EasyPaisa, JazzCash & Bank Cards
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancel & Review
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl border text-xs font-extrabold text-white transition-all shadow-sm ${
                    isBlue ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-emerald-700'
                  }`}
                >
                  Proceed to Checkout Gateway →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
