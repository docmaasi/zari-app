/**
 * Zari brand mark — a vivid magenta-to-cyan gradient orb with a clean
 * stylized "Z" cut through it. Sharp, scalable, brand-coherent, no PNG
 * dependency. Works in server components.
 *
 * Variants:
 *   <ZariMark size={32} />              → just the orb mark
 *   <ZariWordmark size={32} />          → mark + "Zari" wordmark
 */

interface MarkProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function ZariMark({ size = 32, className = "", glow = true }: MarkProps) {
  const id = `zari-mark-${size}`;
  const filter = glow ? `url(#${id}-glow)` : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Vivid magenta → violet → cyan core */}
        <radialGradient id={`${id}-core`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffd2e3" />
          <stop offset="20%" stopColor="#ff7eb1" />
          <stop offset="45%" stopColor="#ff3d8a" />
          <stop offset="75%" stopColor="#b14aff" />
          <stop offset="100%" stopColor="#5cf1ff" />
        </radialGradient>

        {/* Outer ring */}
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#ff3d8a" />
          <stop offset="50%" stopColor="#b14aff" />
          <stop offset="100%" stopColor="#5cf1ff" />
        </linearGradient>

        {/* Soft outer glow, when enabled */}
        {glow && (
          <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feFlood floodColor="#ff3d8a" floodOpacity="0.45" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={filter}>
        {/* Outer ring */}
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke={`url(#${id}-ring)`}
          strokeWidth="2"
          opacity="0.9"
        />
        {/* Orb body */}
        <circle cx="32" cy="32" r="24" fill={`url(#${id}-core)`} />
        {/* Soft inner shine */}
        <ellipse cx="25" cy="22" rx="9" ry="6" fill="white" opacity="0.35" />
        {/* The Z mark — two parallel bars + diagonal stroke */}
        <path
          d="M 21 22 L 41 22 L 23 41 L 43 41"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

interface WordmarkProps extends MarkProps {
  hideMark?: boolean;
  hideWord?: boolean;
}

export function ZariWordmark({
  size = 28,
  className = "",
  glow = false,
  hideMark = false,
  hideWord = false,
}: WordmarkProps) {
  // Wordmark sized to match the mark visually (size * ~1.6 in width)
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!hideMark && <ZariMark size={size} glow={glow} />}
      {!hideWord && (
        <span
          className="font-extrabold tracking-tight text-zari-text leading-none"
          style={{
            fontSize: size * 0.78,
            letterSpacing: "-0.02em",
          }}
        >
          zari
        </span>
      )}
    </div>
  );
}
