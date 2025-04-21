import { SVGProps } from 'react';

function TimeClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
      {/* Clock base */}
      <circle cx="32" cy="32" r="28" fill="#f0f0f0" stroke="#2563eb" strokeWidth="3" />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="24" fill="#ffffff" stroke="#4b83ee" strokeWidth="1" />
      {/* Clock markers */}
      <line x1="32" y1="8" x2="32" y2="12" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="52" x2="32" y2="56" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="32" x2="12" y2="32" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="32" x2="56" y2="32" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      {/* Additional markers */}
      <line x1="16" y1="16" x2="19" y2="19" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="48" x2="19" y2="45" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="16" x2="45" y2="19" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="48" x2="45" y2="45" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hour hand */}
      <line x1="32" y1="32" x2="32" y2="20" stroke="#333" strokeWidth="3" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 32 32"
          to="360 32 32"
          dur="80s"
          repeatCount="indefinite"
        />
      </line>
      {/* Minute hand */}
      <line x1="32" y1="32" x2="32" y2="16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 32 32"
          to="360 32 32"
          dur="10s"
          repeatCount="indefinite"
        />
      </line>
      {/* Center point */}
      <circle cx="32" cy="32" r="3" fill="#333" />
    </svg>
  );
}

export default TimeClockIcon;
