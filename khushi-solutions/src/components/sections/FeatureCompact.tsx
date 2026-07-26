'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';
import MobileFrame from '@/components/ui/MobileFrame';
import type { ProductFeature, ProductAccent } from '@/data/products';

interface FeatureCompactProps {
  features: ProductFeature[];
  accent: ProductAccent;
  productNumber: string;
}

export default function FeatureCompact({
  features,
  accent,
  productNumber,
}: FeatureCompactProps) {
  const accentText = accent === 'blue' ? 'text-primary' : 'text-secondary';
  const accentBg = accent === 'blue' ? 'bg-primary-light' : 'bg-secondary-light';
  const sectionBg = accent === 'blue' ? 'bg-surface' : 'bg-surface';

  return (
    <section className={`${sectionBg} section-padding`}>
      <div className="container-main">
        <ScrollReveal>
          <span className={`text-technical ${accentText} inline-block mb-4`}>
            PRODUCT {productNumber} / MORE CAPABILITIES
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="text-h3 text-text-primary max-w-[480px] mb-10 md:mb-14">
            And There&apos;s More
          </h2>
        </ScrollReveal>

        {/* Compact feature grid — each gets meaningful visual treatment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={0.08 * i}>
              <div
                className={`rounded-[var(--radius-lg)] border border-border overflow-hidden bg-white transition-all duration-300 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5`}
              >
                {/* Screenshot */}
                <div className={`p-4 ${accentBg}`}>
                  {feature.screenshotType === 'mobile' ? (
                    <div className="flex justify-center py-2">
                      <MobileFrame
                        src={feature.screenshotPath}
                        alt={feature.screenshotAlt}
                        accentColor={accent}
                        className="!max-w-[180px]"
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

                {/* Text */}
                <div className="p-5 md:p-6">
                  <span className={`text-technical ${accentText} block mb-2`}>
                    {feature.eyebrow}
                  </span>
                  <h3 className="text-h4 text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-small text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
