'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import MobileFrame from '@/components/ui/MobileFrame';
import type { ProductData } from '@/data/products';

interface ProductFeaturesProps {
  product: ProductData;
}

export default function ProductFeatures({ product }: ProductFeaturesProps) {
  const accentText = product.accent === 'blue' ? 'text-primary' : 'text-secondary';
  const bgColors = ['bg-white', 'bg-surface'];

  return (
    <div className="flex flex-col">
      {product.features.map((feature, index) => {
        const isEven = index % 2 === 0;
        const bgColor = bgColors[index % 2];

        return (
          <section key={feature.title} className={`${bgColor} section-padding overflow-hidden`}>
            <div className="container-main">
              <div className={`flex flex-col gap-10 md:gap-16 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                
                {/* Text Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <ScrollReveal>
                    <span className={`text-technical ${accentText} inline-block mb-3`}>
                      {feature.eyebrow}
                    </span>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.1}>
                    <h2 className="text-h2 text-text-primary mb-6">
                      {feature.title}
                    </h2>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.2}>
                    <div className="text-body-lg text-text-secondary space-y-3">
                      {feature.description.split('\n').map((line, i) => (
                        <p key={i} className={line.trim().startsWith('•') ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-text-muted' : ''}>
                          {line.replace(/^•\s*/, '')}
                        </p>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>

                {/* Media Content */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <ScrollReveal delay={0.3} className="w-full flex justify-center">
                    {feature.screenshotType === 'mobile' ? (
                      <div className="max-w-[320px] w-full">
                        <MobileFrame
                          src={feature.screenshotPath}
                          alt={feature.screenshotAlt}
                          accentColor={product.accent}
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <ScreenshotFrame
                          src={feature.screenshotPath}
                          alt={feature.screenshotAlt}
                          width={800}
                          height={500}
                          accentColor={product.accent}
                          label={feature.eyebrow}
                        />
                      </div>
                    )}
                  </ScrollReveal>
                </div>

              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
