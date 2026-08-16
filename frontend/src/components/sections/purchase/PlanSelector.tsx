import { CheckCircle2, ChevronRight, Zap, Sparkles } from 'lucide-react';
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
      <div className="py-12 text-center text-text-secondary animate-pulse">
        Loading pricing options...
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const isBlue = accentClass.includes('primary');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto px-4"
    >
      {plans.map((plan, index) => (
        <motion.div 
          key={plan.plan_key}
          variants={item}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-6 md:p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-xl overflow-hidden flex flex-col h-full shadow-lg
            ${plan.plan_key === 'commission' ? 'border-border hover:border-slate-300 hover:shadow-xl' : ''}
            ${plan.plan_key === 'non_commission' ? `border-2 border-${isBlue ? 'primary' : 'secondary'}/40 shadow-2xl ${isBlue ? 'shadow-blue-500/20' : 'shadow-emerald-500/20'}` : ''}
          `}
          onClick={() => onSelect(plan)}
        >
          {/* Continuous subtle animated background glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ 
              duration: 4 + index, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -inset-20 blur-[80px] rounded-full -z-10 ${
              isBlue ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
            }`} 
          />

          {/* Popular Tag */}
          {plan.plan_key === 'non_commission' && (
            <div className={`absolute top-0 right-0 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded-bl-2xl shadow-md flex items-center gap-1 ${
              isBlue ? 'bg-gradient-to-r from-blue-500 to-primary' : 'bg-gradient-to-r from-emerald-500 to-secondary'
            }`}>
              <Sparkles className="w-3 h-3" /> Most Popular
            </div>
          )}

          <div className="flex items-center justify-between mb-2 mt-2">
            <h3 className={`text-xl md:text-2xl font-black tracking-tight ${plan.plan_key === 'non_commission' ? accentClass : 'text-text-primary'}`} style={{ fontFamily: 'var(--font-heading)' }}>
              {plan.label}
            </h3>
            {plan.plan_key === 'non_commission' ? (
              <div className={`p-2 rounded-full ${isBlue ? 'bg-blue-50 text-primary' : 'bg-emerald-50 text-secondary'}`}>
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tighter">
              {plan.amount_pkr === 0 ? 'Free' : `Rs. ${plan.amount_pkr.toLocaleString()}`}
            </span>
            {plan.amount_pkr > 0 && <span className="text-text-muted text-sm font-bold tracking-wide">/ one-time</span>}
          </div>
          
          <p className="text-sm text-text-secondary mb-6 leading-relaxed flex-1 font-medium">
            {plan.description}
          </p>
          
          {plan.categories && (
            <div className="mb-8 space-y-3 bg-white/60 p-5 rounded-2xl border border-white shadow-sm backdrop-blur-md">
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${accentClass}`}>Included Categories</p>
              {plan.categories.map(cat => (
                <div key={cat.key} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1 rounded-full ${isBlue ? 'bg-blue-100 text-primary' : 'bg-emerald-100 text-secondary'}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                  </div>
                  <span className="text-sm text-text-secondary font-semibold">{cat.display}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-auto">
            <div className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md group-hover:shadow-lg ${
              plan.plan_key === 'non_commission' 
                ? (isBlue ? 'bg-gradient-to-r from-blue-600 to-primary text-white hover:opacity-90' : 'bg-gradient-to-r from-emerald-600 to-secondary text-white hover:opacity-90') 
                : 'bg-white border-2 border-border text-text-primary hover:bg-slate-50'
            }`}>
              Select Plan <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
