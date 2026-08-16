interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  accentColor?: 'blue' | 'green';
  inverse?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  accentColor = 'blue',
  inverse = false,
}: SectionHeaderProps) {
  const textAlign = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const eyebrowColor =
    accentColor === 'blue' ? 'text-primary' : 'text-secondary';
  const titleColor = inverse ? 'text-text-inverse' : 'text-text-primary';
  const descColor = inverse ? 'text-text-inverse/70' : 'text-text-secondary';

  return (
    <div className={`${textAlign} max-w-[680px] mb-12 md:mb-16`}>
      {eyebrow && (
        <span
          className={`text-technical ${eyebrowColor} inline-block mb-4`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`text-h2 ${titleColor} mb-4`}>{title}</h2>
      {description && (
        <p className={`text-body-lg ${descColor} max-readable`}>
          {description}
        </p>
      )}
    </div>
  );
}
