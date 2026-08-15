"use client";

import { memo } from "react";
import {
  ANGLES_6,
  ANGLES_5,
  grassBlades,
  wreathLeaves,
  wreathBlooms,
} from "../lib/decor-data";

export const Monogram = memo(function Monogram({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blush via-blush-dark/70 to-burgundy/55">
      <span className="font-script text-3xl text-white drop-shadow-md sm:text-4xl lg:text-6xl">
        {initial}
      </span>
    </div>
  );
});

export const SprigDivider = memo(function SprigDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 220 28" className={className} fill="none">
      <line
        x1="0"
        y1="14"
        x2="86"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="134"
        y1="14"
        x2="220"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(110, 14)">
        {ANGLES_6.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.6"
            ry="7"
            fill="var(--coral)"
            opacity="0.92"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.4" fill="var(--mustard)" />
      </g>
      <ellipse
        cx="94"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(-25 94 14)"
      />
      <ellipse
        cx="126"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(25 126 14)"
      />
    </svg>
  );
});

export const CornerFlourish = memo(function CornerFlourish({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <path
        d="M4 4 C 4 24, 18 36, 40 38 C 48 39, 54 44, 56 52"
        stroke="var(--sage)"
        strokeWidth="1.1"
        fill="none"
        opacity="0.6"
      />
      <g transform="translate(10, 10)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.6"
            ry="7"
            fill="var(--blush-dark)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.2" fill="var(--mustard)" />
      </g>
      <ellipse
        cx="28"
        cy="30"
        rx="3"
        ry="6"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(30 28 30)"
      />
    </svg>
  );
});

export const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.8"
            ry="7.2"
            fill={color}
            opacity="0.94"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.3" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

export const MiniLeaf = memo(function MiniLeaf({
  className = "",
  rot = 0,
}: {
  className?: string;
  rot?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="5.2"
        ry="9.5"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform={`rotate(${rot} 12 12)`}
      />
    </svg>
  );
});

export const Sparkle = memo(function Sparkle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
});

export const Butterfly = memo(function Butterfly({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 32 24" className={className} fill="none">
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="21"
        stroke="var(--ink)"
        strokeWidth="1.1"
        opacity="0.55"
      />
      <ellipse cx="8" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse cx="8.5" cy="16" rx="5.5" ry="4.5" fill={color} opacity="0.65" />
      <ellipse cx="24" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse
        cx="23.5"
        cy="16"
        rx="5.5"
        ry="4.5"
        fill={color}
        opacity="0.65"
      />
      <circle cx="8" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
      <circle cx="24" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
    </svg>
  );
});

export const GrassSilhouette = memo(function GrassSilhouette({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      {grassBlades.map((b, i) => (
        <path
          key={i}
          d={`M${b.x} 40 Q${b.x + 2} ${40 - b.h * 0.6} ${b.x + 4} ${40 - b.h}`}
          stroke="var(--sage)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          transform={`rotate(${b.rot} ${b.x} 40)`}
        />
      ))}
    </svg>
  );
});

/**
 * `animated` (opsional, default false — behavior lama tetap sama persis):
 * membungkus svg dengan div yang punya animasi sway ringan (rotate ±0.6deg).
 * Sengaja pakai wrapper terpisah, BUKAN gabung ke style svg langsung, supaya
 * tidak bentrok dengan `flip` yang sudah pakai transform scaleY(-1) di svg
 * itu sendiri — dua transform di elemen yang sama akan saling override.
 */
export const StaticWreathBand = memo(function StaticWreathBand({
  className = "",
  flip = false,
  animated = false,
}: {
  className?: string;
  flip?: boolean;
  animated?: boolean;
}) {
  const svg = (
    <svg
      viewBox="0 0 300 28"
      className={animated ? "h-full w-full" : className}
      fill="none"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <line
        x1="0"
        y1="20"
        x2="300"
        y2="20"
        stroke="var(--sage)"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="1 5"
      />
      {wreathLeaves.map((l, i) => (
        <ellipse
          key={`wl-${i}`}
          cx={l.x}
          cy={l.y}
          rx="3.4"
          ry="6.4"
          fill="var(--sage-light)"
          stroke="var(--sage)"
          strokeWidth="0.5"
          opacity="0.75"
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
        />
      ))}
      {wreathBlooms.map((b, i) => (
        <g
          key={`wb-${i}`}
          transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}
        >
          {ANGLES_5.map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-5"
              rx="3.2"
              ry="6.2"
              fill={b.color}
              opacity="0.9"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2" fill="var(--mustard)" />
        </g>
      ))}
    </svg>
  );

  if (!animated) return svg;

  return (
    <div
      className={className}
      style={{
        animation: "couple-band-sway 5s ease-in-out infinite",
        transformOrigin: "center",
      }}
    >
      {svg}
    </div>
  );
});
