import { memo } from "react";

type Props = { className?: string };

function BackgroundPattern({ className = "" }: Props) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern
          id="floral-bg-pattern"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(12)"
        >
          <ellipse
            cx="16"
            cy="14"
            rx="4"
            ry="8"
            fill="var(--sage-light)"
            opacity="0.65"
            transform="rotate(-20 16 14)"
          />
          <g transform="translate(38, 40)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-4"
                rx="2.6"
                ry="5.4"
                fill="var(--blush-dark)"
                opacity="0.55"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="1.7" fill="var(--mustard)" opacity="0.55" />
          </g>
          <ellipse
            cx="56"
            cy="16"
            rx="3.5"
            ry="7"
            fill="var(--sage-light)"
            opacity="0.6"
            transform="rotate(25 56 16)"
          />
          <circle cx="10" cy="56" r="2" fill="var(--coral)" opacity="0.45" />
          <circle
            cx="62"
            cy="58"
            r="1.8"
            fill="var(--burgundy)"
            opacity="0.4"
          />
          <ellipse
            cx="30"
            cy="62"
            rx="2.6"
            ry="5.2"
            fill="var(--sage-light)"
            opacity="0.5"
            transform="rotate(-15 30 62)"
          />
          <circle cx="50" cy="48" r="1.4" fill="var(--mustard)" opacity="0.4" />
        </pattern>

        {/*
          Pattern kedua: tile size beda (110 vs 72) + rotasi berlawanan (-9 vs 12).
          Dua periode berbeda yang saling silang jauh lebih sulit ditangkap mata
          sebagai "grid" dibanding satu pattern diulang — tanpa perlu bikin motif
          baru, cukup reuse elemen yang sama dengan parameter berbeda.
        */}
        <pattern
          id="floral-bg-pattern-2"
          width="110"
          height="110"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-9)"
        >
          <ellipse
            cx="24"
            cy="20"
            rx="3.5"
            ry="7"
            fill="var(--sage-light)"
            opacity="0.5"
            transform="rotate(15 24 20)"
          />
          <g transform="translate(70, 60)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-3.5"
                rx="2.2"
                ry="4.6"
                fill="var(--coral)"
                opacity="0.4"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="1.4" fill="var(--mustard)" opacity="0.4" />
          </g>
          <circle
            cx="18"
            cy="86"
            r="1.6"
            fill="var(--burgundy)"
            opacity="0.35"
          />
          <ellipse
            cx="90"
            cy="24"
            rx="2.8"
            ry="5.6"
            fill="var(--sage-light)"
            opacity="0.45"
            transform="rotate(-25 90 24)"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#floral-bg-pattern)" />
      <rect
        width="100%"
        height="100%"
        fill="url(#floral-bg-pattern-2)"
        opacity="0.55"
      />
    </svg>
  );
}

export default memo(BackgroundPattern);
