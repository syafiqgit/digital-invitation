"use client";

import { memo, useMemo } from "react";

const PARTICLES_PER_WAVE = 18;
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

const GlobalStyles = memo(function GlobalStyles() {
  return (
    <style>{`
      @keyframes bloomFly {
        0% { opacity: 0; transform: translate3d(0,0,0) rotate(0deg) scale(0.25); }
        35% { opacity: 1; transform: translate3d(calc(var(--tx) * 0.55), calc(var(--ty) * 0.55), 0) rotate(calc(var(--rot) * 0.45)) scale(1); }
        75% { opacity: 0.9; transform: translate3d(var(--tx), var(--ty), 0) rotate(calc(var(--rot) * 0.8)) scale(0.95); }
        100% { opacity: 0; transform: translate3d(calc(var(--tx) * 1.05), calc(var(--ty) * 1.05), 0) rotate(var(--rot)) scale(0.65); }
      }
      .bloom-particle {
        position: absolute; left: 0; top: 0; transform: translate3d(0,0,0);
        animation-name: bloomFly; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both;
      }
      @keyframes gardenGlowPulse {
        0% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(0.35); }
        50% { opacity: 0.55; transform: translate3d(-50%,-50%,0) scale(2.1); }
        100% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(2.8); }
      }
    `}</style>
  );
});

export const BloomParticles = memo(function BloomParticles() {
  const particles = useMemo(
    () => Array.from({ length: WAVE_COUNT }, (_, w) => buildWave(w)).flat(),
    [],
  );
  return (
    <>
      <GlobalStyles />
      <div
        className="pointer-events-none absolute z-70"
        style={{ left: `${BLOOM_ORIGIN.xPct}%`, top: `${BLOOM_ORIGIN.yPct}%` }}
      >
        {particles.map((p) => (
          <svg
            key={p.id}
            viewBox="0 0 20 20"
            width={p.size}
            height={p.size}
            className="bloom-particle -translate-x-1/2 -translate-y-1/2"
            style={
              {
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                "--rot": `${p.rot}deg`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              } as React.CSSProperties
            }
          >
            {p.kind === "leaf" ? (
              <path
                d="M10 0 C 16 4, 18 12, 10 20 C 2 12, 4 4, 10 0 Z"
                fill={p.color}
                opacity="0.85"
              />
            ) : (
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="9"
                fill={p.color}
                opacity="0.9"
              />
            )}
          </svg>
        ))}
      </div>
    </>
  );
});
