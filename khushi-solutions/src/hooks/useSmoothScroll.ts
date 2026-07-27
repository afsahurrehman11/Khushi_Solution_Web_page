'use client';

import { useEffect, useRef } from 'react';

/**
 * SmoothScroll — A lightweight CSS-scroll-based smooth scroll manager.
 * Locomotive Scroll v4 requires a wrapping element with `data-scroll-container`
 * and a specific DOM structure. For Next.js App Router compatibility we use
 * a CSS-native approach for the global canvas, while still exporting a
 * locomotive-style scroll-to utility for programmatic scrolling.
 */
export function useSmoothScroll() {
  return {
    scrollTo: (target: string | HTMLElement, offset = 0) => {
      if (typeof window === 'undefined') return;
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    },
  };
}
