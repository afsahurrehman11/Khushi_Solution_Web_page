'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProductData } from '@/data/products';

interface HowItWorksProps {
  product: ProductData;
}

const bitesWorkflow = [
  { label: 'Customer Browsing', sublabel: 'Opens app, sees 13 store types, adds items to cart.' },
  { label: 'Smart Pricing', sublabel: 'System calculates delivery fee based on exact road distance.' },
  { label: 'Vendor Acceptance', sublabel: 'Store owner accepts order on dedicated tablet dashboard.' },
  { label: 'Auto-Assignment', sublabel: 'System pings the nearest available rider with route details.' },
  { label: 'Live Delivery', sublabel: 'Customer watches rider move on live map until doorstep arrival.' },
];

const erpWorkflow = [
  { label: 'Student Arrival', sublabel: 'Walks past AI camera, face recognized in milliseconds.' },
  { label: 'Parent Notification', sublabel: 'Instant push notification sent to parent\'s phone.' },
  { label: 'Fee Generation', sublabel: 'System auto-generates monthly fee voucher with any fines.' },
  { label: 'Online Payment', sublabel: 'Parent taps "Pay" in app, funds route to school bank.' },
  { label: 'Result Day', sublabel: 'Teacher uploads marks, interactive graph updates on parent app.' },
];

export default function HowItWorks({ product }: HowItWorksProps) {
  const workflow = product.id === 'bites' ? bitesWorkflow : erpWorkflow;
  const accentText = product.accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBg = product.accent === 'blue' ? 'bg-primary' : 'bg-secondary';
  const accentBorderFull = product.accent === 'blue' ? 'border-primary/20' : 'border-secondary/20';

  return (
    <section className="bg-primary-dark section-padding overflow-hidden">
      <div className="container-main">
        <ScrollReveal>
          <span className="text-technical text-white/50 inline-block mb-3">
            HOW IT WORKS
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-white max-w-[520px] mb-12 md:mb-16">
            The {product.name} Workflow
          </h2>
        </ScrollReveal>

        {/* Responsive vertical flow diagram */}
        <div className="max-w-[800px] mx-auto relative">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2" />

          <div className="flex flex-col gap-6 md:gap-12 relative z-10">
            {workflow.map((node, i) => {
              const isEven = i % 2 === 0;
              return (
                <ScrollReveal key={node.label} delay={0.1 * i} className="w-full">
                  <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    
                    {/* Content Box */}
                    <div className="w-full md:w-1/2">
                      <div className={`p-6 rounded-[var(--radius-lg)] border ${accentBorderFull} bg-white/5 backdrop-blur-sm relative group transition-all duration-300 hover:bg-white/10`}>
                        <div className={`absolute top-4 ${isEven ? 'right-4' : 'left-4 md:right-auto md:left-4'} text-3xl font-heading font-bold text-white/10 group-hover:text-white/20 transition-colors`}>
                          0{i + 1}
                        </div>
                        <h4 className={`text-h4 text-white mb-2 ${accentText}`}>
                          {node.label}
                        </h4>
                        <p className="text-body text-white/70">
                          {node.sublabel}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Node (Desktop only) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${accentBg} ring-4 ring-primary-dark shadow-[0_0_15px_rgba(255,255,255,0.2)]`} />
                    </div>

                    {/* Spacer for other half */}
                    <div className="hidden md:block w-1/2" />

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
