import { 
  CheckCircle2, ChevronRight, Sparkles, ShieldCheck, 
  Percent, Utensils, ShoppingBag, Pill, Store, Layers, Crown, X 
} from 'lucide-react';
import { Plan } from './usePurchaseFlow';
import { motion } from 'framer-motion';

interface PlanSelectorProps {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
  accentClass: string;
}

export default function PlanSelector({ plans, onSelect, accentClass }: PlanSelectorProps) {
  if (plans.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 font-medium animate-pulse text-sm">
        Loading pricing options...
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const getCategoryIcon = (key: string) => {
    if (key.includes('food')) return Utensils;
    if (key.includes('grocery')) return ShoppingBag;
    if (key.includes('pharmacy')) return Pill;
    if (key.includes('retail')) return Store;
    return Layers;
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto px-4"
    >
      {plans.map((plan, index) => {
        const isHighlight = plan.plan_key === 'non_commission' || plan.plan_key === 'enterprise_paid';
        const isCustomPrice = plan.is_custom_price || (plan.plan_key === 'enterprise_paid' && plan.amount_pkr === 0);

        // Card themes
        const cardBg = isHighlight
          ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border-2 border-blue-300 shadow-md hover:border-blue-400' 
          : 'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-300 shadow-md hover:border-emerald-400';

        const iconBg = isHighlight ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700';
        const titleColor = isHighlight ? 'text-blue-950' : 'text-emerald-950';
        const buttonClass = isHighlight
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm'
          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm';

        const HeaderIcon = isHighlight ? Crown : ShieldCheck;

        return (
          <motion.div 
            key={plan.plan_key}
            variants={item}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative p-5 md:p-6 rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full ${cardBg}`}
            onClick={() => onSelect(plan)}
          >
            {/* Popular / Pro Tag */}
            {isHighlight && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white bg-blue-600 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {plan.plan_key === 'enterprise_paid' ? 'Pro Version' : 'Popular'}
              </div>
            )}

            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                <HeaderIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold leading-tight ${titleColor}`}>
                  {plan.label}
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  {plan.plan_key === 'base_free' ? 'Starter Free Tier' : plan.plan_key === 'enterprise_paid' ? 'Full Enterprise Features' : 'Registration plan'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-3 pb-3 border-b border-slate-200/80 flex items-baseline gap-1.5">
              {isCustomPrice ? (
                <span className={`text-2xl font-extrabold tracking-tight ${titleColor}`}>
                  Custom Quote
                </span>
              ) : (
                <>
                  <span className={`text-3xl font-extrabold tracking-tight ${titleColor}`}>
                    {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
                  </span>
                  {plan.amount_pkr > 0 && <span className="text-slate-500 text-xs font-semibold">/ one-time</span>}
                </>
              )}
            </div>
            
            {/* Description */}
            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium flex-1">
              {plan.description}
            </p>
            
            {/* Features Comparative List */}
            {plan.features && (
              <div className="mb-5 space-y-2 bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Feature Availability</p>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    {feat.included ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                    )}
                    <span className={`text-xs ${feat.included ? 'text-slate-800 font-semibold' : 'line-through text-slate-400 font-medium'}`}>
                      {feat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Categories list if delivery */}
            {plan.categories && (
              <div className="mb-5 space-y-2 bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Included Categories</p>
                {plan.categories.map(cat => {
                  const CatIcon = getCategoryIcon(cat.key);
                  return (
                    <div key={cat.key} className="flex items-center gap-2">
                      <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isHighlight ? 'text-blue-600' : 'text-emerald-600'}`} />
                      <span className="text-xs text-slate-700 font-semibold">{cat.display}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Button */}
            <div className="mt-auto pt-2">
              <div className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${buttonClass}`}>
                {isCustomPrice ? 'Contact for Enterprise' : 'Select Plan'} <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
