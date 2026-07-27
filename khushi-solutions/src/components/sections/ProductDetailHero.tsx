'use client';

import { motion, type Variants } from 'framer-motion';
import { ProductData } from '@/data/products';
import ScreenshotFrame from '@/components/ui/ScreenshotFrame';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function ProductDetailHero({ product }: { product: ProductData }) {
  const accentBgClass = product.accent === 'blue' ? 'bg-primary-light' : 'bg-secondary-light';
  
  return (
    <section className={`pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden relative ${accentBgClass}`}>
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true" />
      
      <div className="container-main relative z-10 flex flex-col items-center">
        {/* Header Text */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-[800px] mb-12 md:mb-16"
        >
          <span className={`text-technical ${product.accent === 'blue' ? 'text-primary' : 'text-secondary'} mb-4 inline-block`}>
            PRODUCT {product.number} — {product.category.toUpperCase()}
          </span>
          <h1 className="text-display text-text-primary mb-6">
            {product.headline}
          </h1>
          <p className="text-body-lg text-text-secondary max-readable mx-auto">
            {product.shortIntro}
          </p>
        </motion.div>

        {/* Video Frame */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[1000px] mx-auto mb-12 relative"
        >
          <ScreenshotFrame
            src={product.heroScreenshot.desktop} // Fallback image if video fails or before it loads
            alt={product.heroVideo.alt}
            width={1200}
            height={700}
            priority
            accentColor={product.accent}
            label={`${product.name.toUpperCase()} / PREVIEW`}
          />
          {/* We're using ScreenshotFrame which renders an image. 
              To support video, we should ideally modify ScreenshotFrame or overlay a video.
              Since we need a video, let's overlay a video element that covers the image.
          */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-x-[1px] bottom-[1px] top-[41px] w-[calc(100%-2px)] h-[calc(100%-42px)] object-cover rounded-b-[7px] z-10"
            poster={product.heroScreenshot.desktop}
          >
            <source src={product.heroVideo.desktop} type="video/mp4" />
          </video>
        </motion.div>

        {/* Tech Stack Pills */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[800px]"
        >
          <span className="text-small text-text-muted font-medium mr-2">Powered by:</span>
          {product.techStack.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1.5 bg-white border border-border rounded-full text-xs font-medium text-text-secondary shadow-sm"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
