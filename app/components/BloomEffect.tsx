"use client";

import { memo, useMemo } from "react";

const PARTICLES_PER_WAVE = 12;
const WAVE_COUNT = 2;
const PARTICLE_COLORS = [
  "var(--blush-dark)",
  "var(--coral)",
  "var(--sage-light)",
  "var(--burgundy)",
] as const;

export const BLOOM_ORIGIN = { xPct: 50, yPct: 40 };

type Particle = {
  id: string;
  kind: "petal" | "leaf";
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
};

function buildWave(waveIndex: number): Particle[] {
  return Array.from({ length: PARTICLES_PER_WAVE }, (_, i) => {
    const angle =
      (i / PARTICLES_PER_WAVE) * Math.PI * 2 +
      (i % 2 ? 0.12 : -0.08) +
      waveIndex * 0.18;
    const distance = 90 + (i % 5) * 45 + waveIndex * 30;
    const isLeaf = i % 3 !== 1;
    return {
      id: `${waveIndex}-${i}`,
      kind: isLeaf ? "leaf" : "petal",
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rot: (isLeaf ? 420 : 200) + ((i * 41 + waveIndex * 30) % 100),
      delay: waveIndex * 0.14 + (i % 7) * 0.016,
      duration: 0.85 + (i % 3) * 0.07,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      size: isLeaf ? 9 + (i % 3) * 3 : 7 + (i % 4) * 3,
    };
  });
}

export const BloomParticles = memo(function BloomParticles() {
  const particles = useMemo(
    () => Array.from({ length: WAVE_COUNT }, (_, w) => buildWave(w)).flat(),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute z-70"
      style={{ left: `${BLOOM_ORIGIN.xPct}%`, top: `${BLOOM_ORIGIN.yPct}%` }}
    >
      <style>{`
        @keyframes bloom-glow {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          35% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.6); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.1); }
        }
        @keyframes bloom-particle {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.25);
          }
          22% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(var(--tx-mid), var(--ty-mid)) rotate(var(--rot-mid)) scale(1);
          }
          70% {
            opacity: 0.9;
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--rot-end)) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx-final), var(--ty-final)) rotate(var(--rot)) scale(0.65);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bloom-glow, .bloom-particle {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Glow: kept as a plain opacity+scale fade with a fixed, modest blur
          radius rather than scaling an already-blurred element ~8x — that
          combination (filter cost + rapid resize) is the single most
          expensive thing you can animate. */}
      <div
        className="bloom-glow absolute left-0 top-0 h-32 w-32 rounded-full bg-mustard/60 blur-xl sm:h-40 sm:w-40"
        style={{ animation: "bloom-glow 0.9s ease-out forwards" }}
      />

      {particles.map((p) => (
        <div
          key={p.id}
          className="bloom-particle absolute left-0 top-0"
          style={
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.kind === "leaf" ? "0 50% 0 50%" : "50%",
              "--tx-mid": `${p.tx * 0.55}px`,
              "--ty-mid": `${p.ty * 0.55}px`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--tx-final": `${p.tx * 1.05}px`,
              "--ty-final": `${p.ty * 1.05}px`,
              "--rot-mid": `${p.rot * 0.45}deg`,
              "--rot-end": `${p.rot * 0.8}deg`,
              "--rot": `${p.rot}deg`,
              animation: `bloom-particle ${p.duration}s cubic-bezier(0.22,1,0.36,1) ${p.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
});
