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
  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';

  return (
    <section className="section-padding bg-slate-50 overflow-hidden">
      <div className="container-main relative z-10">
        <div className="text-center flex flex-col items-center mb-16 md:mb-20">
          <ScrollReveal>
            <span className="eyebrow-pill">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: accentColor }} />
              WORKFLOW
            </span>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <h2 className="text-h2 text-text-primary max-w-[600px] mb-4">
              How {product.name} Works
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="text-body-lg text-text-secondary max-w-[500px]">
              A complete operational flow from administration to field execution.
            </p>
          </ScrollReveal>
        </div>

        {/* Responsive vertical flow diagram */}
        <div className="max-w-[800px] mx-auto relative">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-200 -translate-x-1/2" />

          <div className="flex flex-col gap-6 md:gap-12 relative z-10">
            {workflow.map((node, i) => {
              const isEven = i % 2 === 0;
              return (
                <ScrollReveal key={node.label} delay={0.1 * i} className="w-full">
                  <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    
                    {/* Content Box */}
                    <div className="w-full md:w-1/2">
                      <div className="p-6 rounded-[var(--radius-xl)] bg-white border border-border shadow-sm relative group transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className={`absolute top-4 ${isEven ? 'right-4' : 'left-4 md:right-auto md:left-4'} text-3xl font-heading font-bold text-slate-100 group-hover:text-slate-200 transition-colors`}>
                          0{i + 1}
                        </div>
                        <h4 className="text-h4 text-text-primary mb-2" style={{ color: accentColor }}>
                          {node.label}
                        </h4>
                        <p className="text-body text-text-secondary">
                          {node.sublabel}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Node (Desktop only) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(15,23,42,0.1)]" style={{ background: accentColor, border: '4px solid white' }} />
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
