interface CornerMarksProps {
  accentColor?: 'blue' | 'green';
  size?: number;
  className?: string;
}

export default function CornerMarks({
  accentColor = 'blue',
  size = 16,
  className = '',
}: CornerMarksProps) {
  const color = accentColor === 'blue' ? '#2C64B4' : '#7DC242';

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {/* Top-left */}
      <svg
        className="absolute top-0 left-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <path
          d={`M 0 ${size} L 0 0 L ${size} 0`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
        />
      </svg>

      {/* Top-right */}
      <svg
        className="absolute top-0 right-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <path
          d={`M 0 0 L ${size} 0 L ${size} ${size}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
        />
      </svg>

      {/* Bottom-left */}
      <svg
        className="absolute bottom-0 left-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <path
          d={`M 0 0 L 0 ${size} L ${size} ${size}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
        />
      </svg>

      {/* Bottom-right */}
      <svg
        className="absolute bottom-0 right-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <path
          d={`M ${size} 0 L ${size} ${size} L 0 ${size}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}
