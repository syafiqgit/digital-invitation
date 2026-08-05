// components/FloralBouquetBand.tsx
import { memo } from "react";

function FloralBouquetBand({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMid slice"
      className={`${flip ? "rotate-180" : ""} ${className}`}
    >
      <defs>
        <filter id="soft-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {[
        { cx: 90, cy: 40, r: 60, fill: "#f3d9d4" },
        { cx: 200, cy: 70, r: 50, fill: "#e8ede2" },
        { cx: 40, cy: 90, r: 45, fill: "#e0b98f" },
        { cx: 1100, cy: 40, r: 60, fill: "#f3d9d4" },
        { cx: 990, cy: 70, r: 50, fill: "#e8ede2" },
        { cx: 1150, cy: 90, r: 45, fill: "#e0b98f" },
        { cx: 600, cy: 15, r: 35, fill: "#f0d9d4" },
      ].map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={b.fill}
          opacity="0.5"
          filter="url(#soft-blur)"
        />
      ))}

      <path
        d="M60 10 C90 40 110 70 100 110"
        stroke="#5d6b53"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M1140 10 C1110 40 1090 70 1100 110"
        stroke="#5d6b53"
        strokeWidth="2"
        fill="none"
      />
      {[
        { x: 40, y: 30, r: 20 },
        { x: 70, y: 55, r: -20 },
        { x: 95, y: 85, r: 35 },
        { x: 1160, y: 30, r: -20 },
        { x: 1130, y: 55, r: 20 },
        { x: 1105, y: 85, r: -35 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="12"
          ry="20"
          fill="#e8ede2"
          stroke="#5d6b53"
          strokeWidth="1.2"
          transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`}
        />
      ))}

      {/* Cluster bunga multi-warna: burgundy, coral, mustard, blush */}
      {[
        { x: 55, y: 45, s: 1.1, c: "#a13d3d", ctr: "#d9a441" },
        { x: 90, y: 25, s: 0.8, c: "#e08a6b", ctr: "#a13d3d" },
        { x: 30, y: 75, s: 0.9, c: "#f0d9d4", ctr: "#d9a441" },
        { x: 1145, y: 45, s: 1.1, c: "#a13d3d", ctr: "#d9a441" },
        { x: 1110, y: 25, s: 0.8, c: "#e08a6b", ctr: "#a13d3d" },
        { x: 1170, y: 75, s: 0.9, c: "#f0d9d4", ctr: "#d9a441" },
        { x: 600, y: 25, s: 0.7, c: "#d9a441", ctr: "#a13d3d" },
        { x: 640, y: 15, s: 0.6, c: "#e08a6b", ctr: "#d9a441" },
        { x: 560, y: 15, s: 0.6, c: "#a13d3d", ctr: "#d9a441" },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.x}, ${f.y}) scale(${f.s})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-8"
              rx="5"
              ry="9"
              fill={f.c}
              opacity="0.95"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="3.5" fill={f.ctr} />
        </g>
      ))}
    </svg>
  );
}

export default memo(FloralBouquetBand);
