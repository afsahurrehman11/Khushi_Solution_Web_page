'use client';

import { useEffect } from 'react';

export default function LocomotiveScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let locomotiveScroll: any;
    
    (async () => {
      try {
        // @ts-ignore - locomotive-scroll types are missing
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        locomotiveScroll = new LocomotiveScroll({
          lenisOptions: {
            // Configure for smooth scrolling without slow, dragged-out animation speeds
            duration: 0.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth, natural ease-out
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 2.2,
            touchMultiplier: 2.4,
          }
        });
      } catch (error) {
        console.error('Failed to initialize locomotive-scroll:', error);
      }
    })();

    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
