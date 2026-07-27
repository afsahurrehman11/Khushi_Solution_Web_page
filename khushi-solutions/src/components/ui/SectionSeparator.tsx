import React from 'react';

type SeparatorVariant = 'fade' | 'line' | 'darkTransition';

interface SectionSeparatorProps {
  variant: SeparatorVariant;
  /**
   * For 'fade' and 'darkTransition': direction of the fade.
   * 'down': from top color to bottom color.
   * 'up': from bottom color to top color.
   */
  direction?: 'down' | 'up';
  /**
   * For 'fade': the colors to transition between.
   * e.g., fromColor="var(--color-surface)" toColor="var(--color-white)"
   * For 'darkTransition', it transitions to/from var(--color-primary-dark) #0E2039.
   */
  fromColor?: string;
  toColor?: string;
  /**
   * For 'line': whether it's on a dark background or light background.
   */
  theme?: 'light' | 'dark';
}

export default function SectionSeparator({
  variant,
  direction = 'down',
  fromColor = 'var(--color-surface)',
  toColor = 'var(--color-white)',
  theme = 'light',
}: SectionSeparatorProps) {
  if (variant === 'line') {
    return (
      <div className="w-full flex justify-center py-6">
        <div
          className="h-px w-[40%]"
          style={{
            background:
              theme === 'light'
                ? 'linear-gradient(to right, transparent, rgba(44,100,180,0.2), transparent)'
                : 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />
      </div>
    );
  }

  if (variant === 'fade') {
    return (
      <div
        className="w-full h-[40px] md:h-[60px]"
        style={{
          background:
            direction === 'down'
              ? `linear-gradient(to bottom, ${fromColor}, ${toColor})`
              : `linear-gradient(to top, ${toColor}, ${fromColor})`,
        }}
      />
    );
  }

  if (variant === 'darkTransition') {
    const darkColor = 'var(--color-primary-dark)';
    return (
      <div
        className="w-full h-[60px] md:h-[80px]"
        style={{
          background:
            direction === 'down'
              ? `linear-gradient(to bottom, ${fromColor}, ${darkColor})`
              : `linear-gradient(to top, ${darkColor}, ${fromColor})`,
        }}
      />
    );
  }

  return null;
}
