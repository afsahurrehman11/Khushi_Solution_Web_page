import { Monitor, Smartphone } from 'lucide-react';

interface ImagePlaceholderProps {
  label: string;
  aspectRatio?: string;
  accentColor?: 'blue' | 'green';
  type?: 'desktop' | 'mobile';
  className?: string;
}

export default function ImagePlaceholder({
  label,
  aspectRatio = '16/10',
  accentColor = 'blue',
  type = 'desktop',
  className = '',
}: ImagePlaceholderProps) {
  const bgColor =
    accentColor === 'blue' ? 'bg-primary-light' : 'bg-secondary-light';
  const borderColor =
    accentColor === 'blue' ? 'border-primary/10' : 'border-secondary/10';
  const textColor =
    accentColor === 'blue' ? 'text-primary/40' : 'text-secondary/40';
  const iconColor =
    accentColor === 'blue' ? 'text-primary/20' : 'text-secondary/20';

  const Icon = type === 'mobile' ? Smartphone : Monitor;

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center ${bgColor} border ${borderColor} ${className}`}
      style={{ aspectRatio }}
    >
      <Icon className={`w-10 h-10 md:w-12 md:h-12 ${iconColor} mb-3`} strokeWidth={1.5} />
      <span
        className={`text-technical ${textColor} text-center px-4 max-w-[200px] leading-relaxed`}
      >
        {label}
      </span>
    </div>
  );
}
