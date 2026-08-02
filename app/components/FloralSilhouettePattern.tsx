// components/FloralSilhouettePattern.tsx
import { memo } from "react";

function FloralSilhouettePattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%">
      <defs>
        <pattern
          id="floral-tile"
          x="0"
          y="0"
          width="140"
          height="140"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 130 C25 100 15 80 30 55 C40 38 30 20 45 5"
            stroke="#5d6b53"
            strokeWidth="1.6"
            fill="none"
          />
          <ellipse
            cx="18"
            cy="95"
            rx="7"
            ry="12"
            fill="#6b7a5f"
            transform="rotate(30 18 95)"
          />
          <ellipse
            cx="35"
            cy="65"
            rx="7"
            ry="12"
            fill="#6b7a5f"
            transform="rotate(-25 35 65)"
          />
          <ellipse
            cx="28"
            cy="35"
            rx="6"
            ry="10"
            fill="#6b7a5f"
            transform="rotate(20 28 35)"
          />
          <g transform="translate(45, 10)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-7"
                rx="4"
                ry="8"
                fill="#c17a5e"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="2.5" fill="#a85a45" />
          </g>
          <g transform="translate(100, 90)" opacity="0.9">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-6"
                rx="3.5"
                ry="7"
                fill="#c17a5e"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="2" fill="#a85a45" />
          </g>
          <path
            d="M100 140 C105 120 95 105 105 88"
            stroke="#5d6b53"
            strokeWidth="1.3"
            fill="none"
          />
          <ellipse
            cx="98"
            cy="115"
            rx="5"
            ry="9"
            fill="#6b7a5f"
            transform="rotate(-20 98 115)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#floral-tile)" />
    </svg>
  );
}

export default memo(FloralSilhouettePattern);
