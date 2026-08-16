'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePlaceholder from './ImagePlaceholder';

export interface CarouselImage {
  src: string;
  alt: string;
  type?: 'desktop' | 'mobile';
}

interface DynamicCarouselProps {
  /**
   * The path to the folder, e.g., '/images/hero'
   * The component will attempt to fetch `${folderPath}/images.json`
   */
  folderPath: string;
  autoplayInterval?: number;
  className?: string;
  /**
   * For styling the container ratio/shape. 
   * If frameType is 'desktop', might have a different aspect ratio than 'mobile' or 'none'.
   */
  aspectRatio?: string;
}

export default function DynamicCarousel({
  folderPath,
  autoplayInterval = 3500,
  className = '',
  aspectRatio = 'aspect-video',
}: DynamicCarouselProps) {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch manifest
  useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      try {
        const res = await fetch(`${folderPath}/images.json`);
        if (!res.ok) throw new Error('Failed to fetch manifest');
        const data = await res.json();
        if (mounted && data.images) {
          setImages(data.images);
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchImages();
    return () => {
      mounted = false;
    };
  }, [folderPath]);

  // Autoplay
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [images.length, isHovered, autoplayInterval]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (images.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  if (loading) {
    return (
      <div className={`w-full bg-surface rounded-lg animate-pulse ${aspectRatio} ${className}`} />
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <ImagePlaceholder label="No images found" className={aspectRatio} />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image gallery"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image
            src={`${folderPath}/${images[currentIndex].src}`}
            alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-primary w-4'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
