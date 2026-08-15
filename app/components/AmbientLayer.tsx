"use client";

import { memo } from "react";
import Image from "next/image";

interface Petal {
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

interface Butterfly {
  key: string;
  src: string;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  /** Titik singgah [x1, y1, r1] dan [x2, y2, r2] — jarak kecil supaya tetap terasa background */
  path: [number, number, number, number, number, number];
}

interface Sparkle {
  top: string;
  left: string;
}

interface AmbientLayerProps {
  petals?: Petal[];
  butterflies?: Butterfly[];
  sparkles?: Sparkle[];
  /** Tinggi jatuh kelopak. Default 115vh (cocok untuk section setinggi viewport). */
  fallDistance?: string;
}

const DEFAULT_PETALS: Petal[] = [
  { left: "8%", size: 16, duration: 9, delay: 0, drift: 18 },
  { left: "30%", size: 13, duration: 11, delay: 2.5, drift: -14 },
  { left: "68%", size: 17, duration: 10, delay: 1, drift: 12 },
  { left: "90%", size: 14, duration: 12, delay: 4, drift: -20 },
];

const DEFAULT_BUTTERFLIES: Butterfly[] = [
  {
    key: "bf-1",
    src: "/assets/butterfly-1.png",
    top: "22%",
    left: "16%",
    size: 26,
    duration: 9,
    delay: 0,
    path: [14, -10, 6, -6, -4, -4],
  },
  {
    key: "bf-2",
    src: "/assets/butterfly-2.png",
    top: "70%",
    left: "82%",
    size: 22,
    duration: 11,
    delay: 1.5,
    path: [-12, -8, -5, 8, 6, 5],
  },
];

const DEFAULT_SPARKLES: Sparkle[] = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "12%" },
  { top: "88%", left: "82%" },
];

const SparkleIcon = memo(function SparkleIcon({
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

const AmbientLayer = memo(function AmbientLayer({
  petals = DEFAULT_PETALS,
  butterflies = DEFAULT_BUTTERFLIES,
  sparkles = DEFAULT_SPARKLES,
  fallDistance = "115vh",
}: AmbientLayerProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
    >
      {/* Kupu-kupu: wrapper luar mengurus jalur terbang (translate + rotate),
          wrapper dalam mengurus kepakan sayap (scaleY). Dipisah supaya dua
          transform tidak saling menimpa. */}
      {butterflies.map((b) => (
        <div
          key={b.key}
          className="pointer-events-none absolute"
          style={
            {
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              animation: `ambient-bf-fly ${b.duration}s ease-in-out ${b.delay}s infinite`,
              willChange: "transform, opacity",
              "--bf-x1": `${b.path[0]}px`,
              "--bf-y1": `${b.path[1]}px`,
              "--bf-r1": `${b.path[2]}deg`,
              "--bf-x2": `${b.path[3]}px`,
              "--bf-y2": `${b.path[4]}px`,
              "--bf-r2": `${b.path[5]}deg`,
            } as React.CSSProperties
          }
        >
          <div
            className="relative h-full w-full"
            style={{
              transformOrigin: "center",
              animation: `ambient-bf-flap 0.5s ease-in-out ${b.delay * 0.3}s infinite`,
              willChange: "transform",
            }}
          >
            <Image
              src={b.src}
              alt=""
              fill
              sizes={`${b.size}px`}
              className="pointer-events-none select-none object-contain"
              draggable={false}
            />
          </div>
        </div>
      ))}

      {/* Kelopak jatuh */}
      {petals.map((p, i) => (
        <div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-0"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `ambient-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
              "--petal-drift": `${p.drift}px`,
              "--petal-fall": fallDistance,
            } as React.CSSProperties
          }
        >
          <Image
            src="/assets/flower-petal.png"
            alt=""
            fill
            sizes={`${p.size}px`}
            className="pointer-events-none select-none object-contain"
            draggable={false}
          />
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={`sp-${i}`}
          className="pointer-events-none absolute"
          style={{
            top: s.top,
            left: s.left,
            animation: `ambient-twinkle ${2.6 + (i % 3) * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          <SparkleIcon className="h-3 w-3 opacity-90 sm:h-4 sm:w-4" />
        </div>
      ))}

      <style>{`
        @keyframes ambient-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50%      { opacity: 1;   transform: scale(1.25); }
        }
        @keyframes ambient-petal-fall {
          0%   { opacity: 0;   transform: translate(0, -10%) rotate(0deg); }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.6; }
          100% { opacity: 0;   transform: translate(var(--petal-drift, 0px), var(--petal-fall, 115vh)) rotate(340deg); }
        }
        @keyframes ambient-bf-fly {
          0%   { opacity: 0;   transform: translate(0, 0) rotate(0deg); }
          15%  { opacity: 0.9; }
          40%  { transform: translate(var(--bf-x1, 0px), var(--bf-y1, 0px)) rotate(var(--bf-r1, 0deg)); }
          70%  { opacity: 0.9; transform: translate(var(--bf-x2, 0px), var(--bf-y2, 0px)) rotate(var(--bf-r2, 0deg)); }
          100% { opacity: 0;   transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes ambient-bf-flap {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.55); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="ambient"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
});

export default AmbientLayer;
