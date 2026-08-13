"use client";

import { memo, useMemo } from "react";
import { m } from "framer-motion";

const PARTICLES_PER_WAVE = 12; // Dikurangi dari 18 ke 12 (Total 24) agar lebih ringan tanpa mengurangi estetika
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
      {/* Efek Glow diserahkan ke Framer Motion, tidak lagi pakai CSS Keyframes */}
      <m.div
        className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/65 blur-2xl sm:h-40 sm:w-40"
        initial={{ opacity: 0, scale: 0.35 }}
        animate={{ opacity: [0, 0.55, 0], scale: [0.35, 2.1, 2.8] }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* Partikel dirender menggunakan DIV murni (Pure CSS Shapes) yang jauh lebih cepat dari SVG */}
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="absolute left-0 top-0 origin-center"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            // Membuat bentuk kelopak dan daun hanya dengan border-radius!
            borderRadius: p.kind === "leaf" ? "0 50% 0 50%" : "50%",
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ opacity: 0, scale: 0.25, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0.9, 0],
            x: [0, p.tx * 0.55, p.tx, p.tx * 1.05],
            y: [0, p.ty * 0.55, p.ty, p.ty * 1.05],
            rotate: [0, p.rot * 0.45, p.rot * 0.8, p.rot],
            scale: [0.25, 1, 0.95, 0.65],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
});
