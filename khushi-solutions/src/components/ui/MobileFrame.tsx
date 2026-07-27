import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

interface MobileFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
  accentColor?: 'blue' | 'green';
  className?: string;
}

export default function MobileFrame({
  src,
  alt,
  priority = false,
  accentColor = 'blue',
  className = '',
}: MobileFrameProps) {
  const borderColor =
    accentColor === 'blue'
      ? 'border-primary/15'
      : 'border-secondary/15';
  const notchBg =
    accentColor === 'blue' ? 'bg-primary/10' : 'bg-secondary/10';

  const isPlaceholder = !src || src.includes('.webp');

  return (
    <div
      className={`inline-block rounded-[var(--radius-2xl)] overflow-hidden border-2 ${borderColor} shadow-[var(--shadow-md)] bg-white max-w-[220px] sm:max-w-[240px] w-full ${className}`}
    >
      {/* Phone notch area */}
      <div className="flex justify-center py-2 bg-surface">
        <div
          className={`w-16 h-1.5 rounded-full ${notchBg}`}
        />
      </div>

      {/* Screen content — Standard Android 9:16 Aspect Ratio */}
      <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
        {isPlaceholder ? (
          <ImagePlaceholder
            label={alt}
            aspectRatio="9/16"
            accentColor={accentColor}
            type="mobile"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 220px, 240px"
            className="object-cover object-top"
            priority={priority}
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex justify-center py-2 bg-surface">
        <div
          className={`w-10 h-1 rounded-full ${notchBg}`}
        />
      </div>
    </div>
  );
}
