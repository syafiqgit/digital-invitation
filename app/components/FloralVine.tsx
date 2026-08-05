// components/FloralVine.tsx
import { memo } from "react";

type Props = {
  className?: string;
  animate?: boolean;
};

function FloralVine({ className = "", animate = false }: Props) {
  return (
    <svg
      viewBox="0 0 80 400"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* batang utama */}
      <path
        d="M40 0 C36 40 46 80 34 120 C24 160 46 200 36 240 C28 280 44 320 32 360"
        stroke="#8fa28a"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* daun */}
      {[
        { x: 30, y: 40, rot: -40 },
        { x: 48, y: 70, rot: 20 },
        { x: 26, y: 110, rot: -30 },
        { x: 50, y: 150, rot: 18 },
        { x: 28, y: 190, rot: -22 },
        { x: 52, y: 230, rot: 26 },
        { x: 30, y: 270, rot: -30 },
        { x: 50, y: 310, rot: 20 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="7"
          ry="14"
          fill="#e8ede2"
          stroke="#8fa28a"
          strokeWidth="0.8"
          transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
        />
      ))}

      {/* bunga kecil di sepanjang akar */}
      {[
        { x: 24, y: 90, color: "#a13d3d" },
        { x: 54, y: 160, color: "#e08a6b" },
        { x: 26, y: 220, color: "#d9a5a0" },
        { x: 52, y: 300, color: "#a13d3d" },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.x}, ${f.y})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-5"
              rx="3.2"
              ry="6.2"
              fill={f.color}
              opacity="0.96"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2.4" fill="#f0d9d4" />
        </g>
      ))}
    </svg>
  );
}

export default memo(FloralVine);
