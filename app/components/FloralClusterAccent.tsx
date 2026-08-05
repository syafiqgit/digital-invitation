// components/FloralClusterAccent.tsx
import { memo } from "react";

function FloralClusterAccent({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M50 90 C45 70 55 55 48 40"
        stroke="#5d6b53"
        strokeWidth="1.4"
        fill="none"
      />
      <ellipse
        cx="42"
        cy="55"
        rx="7"
        ry="11"
        fill="#e8ede2"
        stroke="#5d6b53"
        strokeWidth="1"
        transform="rotate(-25 42 55)"
      />
      <ellipse
        cx="55"
        cy="65"
        rx="7"
        ry="11"
        fill="#e8ede2"
        stroke="#5d6b53"
        strokeWidth="1"
        transform="rotate(25 55 65)"
      />

      <g transform="translate(48, 30)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-9"
            rx="5.5"
            ry="10"
            fill="#a13d3d"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="4" fill="#d9a441" />
      </g>
      <g transform="translate(28, 42)" opacity="0.9">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.5"
            ry="6.5"
            fill="#e08a6b"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.5" fill="#a13d3d" />
      </g>
      <g transform="translate(68, 45)" opacity="0.9">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5"
            rx="3"
            ry="5.5"
            fill="#f0d9d4"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2" fill="#d9a441" />
      </g>
    </svg>
  );
}

export default memo(FloralClusterAccent);
