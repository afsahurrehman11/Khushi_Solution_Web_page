'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProductData } from '@/data/products';
import { ShoppingBag, Map, CheckCircle2, RefreshCw, Truck, Camera, Bell, Calendar, CreditCard, Laptop } from 'lucide-react';

interface HowItWorksProps {
  product: ProductData;
}

const bitesWorkflow = [
  { icon: ShoppingBag, label: 'Customer Browsing', sublabel: 'Opens app, sees 13 store types, adds items to cart.' },
  { icon: Map, label: 'Smart Pricing', sublabel: 'System calculates delivery fee based on exact road distance.' },
  { icon: CheckCircle2, label: 'Vendor Acceptance', sublabel: 'Store owner accepts order on dedicated tablet dashboard.' },
  { icon: RefreshCw, label: 'Auto-Assignment', sublabel: 'System pings the nearest available rider with route details.' },
  { icon: Truck, label: 'Live Delivery', sublabel: 'Customer watches rider move on live map until doorstep arrival.' },
];

const erpWorkflow = [
  { icon: Camera, label: 'Student Arrival', sublabel: 'Walks past AI camera, face recognized in milliseconds.' },
  { icon: Bell, label: 'Parent Notification', sublabel: 'Instant push notification sent to parent\'s phone.' },
  { icon: Calendar, label: 'Fee Generation', sublabel: 'System auto-generates monthly fee voucher with any fines.' },
  { icon: CreditCard, label: 'Online Payment', sublabel: 'Parent taps "Pay" in app, funds route to school bank.' },
  { icon: Laptop, label: 'Result Day', sublabel: 'Teacher uploads marks, interactive graph updates on parent app.' },
];

export default function HowItWorks({ product }: HowItWorksProps) {
  const workflow = product.id === 'bites' ? bitesWorkflow : erpWorkflow;
  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const gradientLine = product.accent === 'blue' 
    ? 'from-blue-100 via-blue-500 to-blue-100' 
    : 'from-emerald-100 via-emerald-500 to-emerald-100';

  return (
    <section className="section-padding bg-slate-50 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-main relative z-10">
        <div className="text-center flex flex-col items-center mb-16 md:mb-24">
          <ScrollReveal>
            <span className="eyebrow-pill shadow-sm">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: accentColor }} />
              WORKFLOW
            </span>
          </ScrollReveal>
          
          <ScrollReveal delay={0.05}>
            <h2 className="text-h2 text-text-primary max-w-[600px] mb-4 font-extrabold tracking-tight">
              How {product.name} Works
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <p className="text-body-lg text-text-secondary max-w-[500px]">
              A complete operational flow from administration to field execution.
            </p>
          </ScrollReveal>
        </div>

        {/* Visual Neumorphic Flowchart Stepper */}
        <div className="max-w-[1100px] mx-auto relative px-4">
          
          {/* Horizontal Connecting Gradient Line (Desktop) */}
          <div className={`hidden lg:block absolute left-[10%] right-[10%] top-8 h-1 bg-gradient-to-r ${gradientLine} opacity-40 rounded-full`} />

          {/* Vertical Connecting Gradient Line (Mobile) */}
          <div className={`block lg:hidden absolute left-11 top-8 bottom-8 w-1 bg-gradient-to-b ${gradientLine} opacity-40 rounded-full`} />

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 relative z-10 justify-between items-start">
            {workflow.map((node, i) => {
              const Icon = node.icon;
              return (
                <ScrollReveal key={node.label} delay={0.1 * i} className="w-full lg:w-1/5 flex flex-row lg:flex-col items-start lg:items-center gap-5 lg:gap-6 group">
                  
                  {/* Neumorphic Node */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] flex items-center justify-center border border-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 drop-shadow-sm transition-colors duration-300" style={{ color: accentColor }} />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-md z-20 group-hover:scale-110 transition-transform duration-300" style={{ background: accentColor }}>
                      {i + 1}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="text-left lg:text-center mt-1 lg:mt-0">
                    <h4 className="text-sm font-bold text-text-primary mb-1.5 transition-colors duration-300 group-hover:text-black">{node.label}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {node.sublabel}
                    </p>
                  </div>

                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
