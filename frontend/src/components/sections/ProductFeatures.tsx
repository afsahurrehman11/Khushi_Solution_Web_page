'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import MobileFrame from '@/components/ui/MobileFrame';
import type { ProductData } from '@/data/products';

interface ProductFeaturesProps {
  product: ProductData;
}

export default function ProductFeatures({ product }: ProductFeaturesProps) {
  const accentColor = product.accent === 'blue' ? 'var(--color-primary)' : 'var(--color-secondary)';

  return (
    <section className="section-padding bg-white relative z-10 overflow-hidden">
      <div className="container-main">
        
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-20">
          <ScrollReveal delay={0}>
            <h2 className="text-h2 text-text-primary mb-4 font-extrabold tracking-tight">
              Core Platform Features
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Deep operational tools tailored for your specific industry workflows.
            </p>
          </ScrollReveal>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {product.features.map((feature, index) => {
            return (
              <div key={feature.title} className="flex flex-col gap-6 w-full">
                {/* Text Content */}
                <div className="flex flex-col justify-start items-start">
                  <ScrollReveal delay={0}>
                    <span className="eyebrow-pill mb-3">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: accentColor }} />
                      {feature.eyebrow}
                    </span>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.05}>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.05}>
                    <div className="text-body text-text-secondary space-y-2">
                      {feature.description.split('\n').map((line, i) => (
                        <p key={i} className={line.trim().startsWith('•') ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-text-muted' : ''}>
                          {line.replace(/^•\s*/, '')}
                        </p>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>

                {/* Media Content */}
                <div className="w-full flex justify-center mt-2 overflow-hidden">
                  <ScrollReveal delay={0.1} className="w-full flex justify-center overflow-hidden">
                    {feature.screenshotType === 'mobile' ? (
                      <div className="max-w-[230px] w-full shrink-0 flex justify-center overflow-hidden">
                        <MobileFrame
                          src={feature.screenshotPath}
                          alt={feature.screenshotAlt}
                          accentColor={product.accent}
                        />
                      </div>
                    ) : (
                      <div className="w-full rounded-xl overflow-hidden border border-border shadow-sm bg-white">
                        <ScreenshotFrame
                          src={feature.screenshotPath}
                          alt={feature.screenshotAlt}
                          width={600}
                          height={375}
                          accentColor={product.accent}
                          label={feature.eyebrow}
                        />
                      </div>
                    )}
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
