// components/FloralCorner.tsx
import { memo } from "react";

function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Batang utama */}
      <path
        d="M10 10 C40 30 55 55 60 90 C64 118 58 140 45 165"
        stroke="#8a9a7e"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 10 C25 15 35 25 40 40"
        stroke="#8a9a7e"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Daun eucalyptus */}
      {[
        { x: 22, y: 22, r: 30 },
        { x: 38, y: 42, r: -10 },
        { x: 50, y: 62, r: 40 },
        { x: 55, y: 85, r: -25 },
        { x: 50, y: 108, r: 20 },
        { x: 42, y: 130, r: -35 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="9"
          ry="14"
          fill="#e8ede2"
          stroke="#8a9a7e"
          strokeWidth="1.2"
          transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`}
        />
      ))}

      {/* Bunga kecil */}
      <g transform="translate(30, 50)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.5"
            ry="6"
            fill="#f0d9d4"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.5" fill="#d9a5a0" />
      </g>
      <g transform="translate(58, 100)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5"
            rx="3"
            ry="5"
            fill="#f0d9d4"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2" fill="#d9a5a0" />
      </g>

      {/* Ranting kecil */}
      <path
        d="M45 165 C50 172 58 176 68 176"
        stroke="#8a9a7e"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default memo(FloralCorner);
