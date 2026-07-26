'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import MobileFrame from '@/components/ui/MobileFrame';
import type { ProductFeature, ProductAccent } from '@/data/products';

interface FeatureDeepDiveProps {
  features: ProductFeature[];
  accent: ProductAccent;
  productNumber: string;
}

export default function FeatureDeepDive({
  features,
  accent,
  productNumber,
}: FeatureDeepDiveProps) {
  const accentText = accent === 'blue' ? 'text-primary' : 'text-secondary';

  return (
    <section className="bg-white section-padding">
      <div className="container-main">
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-4`}>
            PRODUCT {productNumber} / FEATURE DEEP DIVE
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h2 text-text-primary max-w-[560px] mb-12 md:mb-16">
            Built for Real Workflows
          </h2>
        </ScrollReveal>

        {/* Top features — large editorial alternating layout */}
        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;

            return (
              <ScrollReveal key={feature.title} delay={0.1}>
                <div
                  className={`flex flex-col ${
                    isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } gap-8 lg:gap-12 items-center`}
                >
                  {/* Screenshot */}
                  <div className="w-full lg:w-1/2 shrink-0">
                    {feature.screenshotType === 'mobile' ? (
                      <div className="flex justify-center">
                        <MobileFrame
                          src={feature.screenshotPath}
                          alt={feature.screenshotAlt}
                          accentColor={accent}
                        />
                      </div>
                    ) : (
                      <ScreenshotFrame
                        src={feature.screenshotPath}
                        alt={feature.screenshotAlt}
                        width={1200}
                        height={750}
                        accentColor={accent}
                        label={feature.eyebrow}
                      />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="w-full lg:w-1/2">
                    <span className={`text-technical ${accentText} block mb-3`}>
                      {feature.eyebrow}
                    </span>
                    <h3 className="text-h3 text-text-primary mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-body text-text-secondary leading-relaxed max-w-[520px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
