import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

interface ScreenshotFrameProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  accentColor?: 'blue' | 'green';
  label?: string;
  className?: string;
}

export default function ScreenshotFrame({
  src,
  alt,
  width = 1200,
  height = 750,
  priority = false,
  accentColor = 'blue',
  label,
  className = '',
}: ScreenshotFrameProps) {
  const accentBorder =
    accentColor === 'blue'
      ? 'border-primary/20'
      : 'border-secondary/20';
  const dotColors =
    accentColor === 'blue'
      ? ['bg-primary/30', 'bg-primary/20', 'bg-primary/10']
      : ['bg-secondary/30', 'bg-secondary/20', 'bg-secondary/10'];

  const isPlaceholder = !src || src.includes('.webp');

  return (
    <div
      className={`rounded-[var(--radius-lg)] overflow-hidden border border-border shadow-[var(--shadow-md)] bg-white ${className}`}
    >
      {/* Browser top bar */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-surface border-b ${accentBorder}`}
      >
        <div className="flex gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColors[0]}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${dotColors[1]}`} />
          <div className={`w-2.5 h-2.5 rounded-full ${dotColors[2]}`} />
        </div>
        {label && (
          <span className="text-technical text-text-muted ml-2 hidden sm:inline">
            {label}
          </span>
        )}
      </div>

      {/* Screenshot content */}
      <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
        {isPlaceholder ? (
          <ImagePlaceholder
            label={alt}
            aspectRatio={`${width}/${height}`}
            accentColor={accentColor}
            type="desktop"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
            className="object-cover object-top"
            priority={priority}
          />
        )}
      </div>
    </div>
  );
}
