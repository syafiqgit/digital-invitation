"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import CoverPage from "./CoverPage";
import MainContent from "./MainContent";

const MUSIC_SRC = "/assets/alex-morgan-wedding-garden-ceremony-glow-578500.mp3";

const BLOOM_ORIGIN = { xPct: 50, yPct: 40 };

const TIMELINE = {
  irisDuration: 850,
  contentFadeDelay: 520,
  contentFadeDuration: 500,
  particleTail: 950,
  overlayExitDuration: 260,
} as const;

const TOTAL_MS =
  Math.max(
    TIMELINE.irisDuration,
    TIMELINE.contentFadeDelay + TIMELINE.contentFadeDuration,
    TIMELINE.particleTail,
  ) + TIMELINE.overlayExitDuration;

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity, clip-path",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

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
        position: absolute;
        left: 0;
        top: 0;
        transform: translate3d(0,0,0);
        animation-name: bloomFly;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        animation-fill-mode: both;
        will-change: transform, opacity;
      }
      @keyframes gardenGlowPulse {
        0% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(0.35); }
        50% { opacity: 0.55; transform: translate3d(-50%,-50%,0) scale(2.1); }
        100% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(2.8); }
      }
    `}</style>
  );
});

const NoteIcon = memo(function NoteIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 18V5l11-2v13"
        stroke="var(--burgundy)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" fill="var(--burgundy)" />
      <circle cx="17" cy="16" r="3" fill="var(--burgundy)" />
    </svg>
  );
});

const MutedNoteIcon = memo(function MutedNoteIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 18V5l11-2v13"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="6" cy="18" r="3" fill="var(--ink)" opacity="0.5" />
      <circle cx="17" cy="16" r="3" fill="var(--ink)" opacity="0.5" />
      <line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
        stroke="var(--burgundy)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
});

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

const PARTICLES_PER_WAVE = 18;
const WAVE_COUNT = 2;

const PARTICLE_COLORS = [
  "var(--blush-dark)",
  "var(--coral)",
  "var(--sage-light)",
  "var(--burgundy)",
] as const;

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

function buildParticles(): Particle[] {
  return Array.from({ length: WAVE_COUNT }, (_, w) => buildWave(w)).flat();
}

const BloomParticles = memo(function BloomParticles() {
  const particles = useMemo(buildParticles, []);
  return (
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
  );
});

type Phase = "cover" | "opening" | "content";

function HomeInner() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [phase, setPhase] = useState<Phase>("cover");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = useCallback(() => {
    setPhase("opening");

    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    }

    window.setTimeout(() => setPhase("content"), TOTAL_MS);
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const isOpened = phase !== "cover";
  const isBlooming = phase === "opening" || phase === "content";

  const clipPathVisible = `circle(140% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`;
  const clipPathHidden = `circle(0% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`;

  return (
    <>
      <GlobalStyles />

      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <AnimatePresence>
        {isOpened && (
          <m.button
            type="button"
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.35 }}
            aria-label={isMusicPlaying ? "Matikan musik" : "Putar musik"}
            className="fixed bottom-3 right-3 z-70 flex h-11 w-11 items-center justify-center rounded-full border border-mustard/60 bg-linear-to-b from-ivory to-ivory/90 shadow-[0_4px_14px_rgba(58,54,48,0.12)] backdrop-blur-sm sm:bottom-4 sm:right-4 sm:h-12 sm:w-12"
            style={gpuLayer}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            <m.span
              animate={isMusicPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 6,
                repeat: isMusicPlaying ? Infinity : 0,
                ease: "linear",
              }}
              style={{ willChange: "transform" }}
              className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
            >
              {isMusicPlaying ? (
                <NoteIcon className="h-full w-full" />
              ) : (
                <MutedNoteIcon className="h-full w-full" />
              )}
            </m.span>
          </m.button>
        )}
      </AnimatePresence>

      <m.div
        initial={{ clipPath: clipPathHidden }}
        animate={{ clipPath: isBlooming ? clipPathVisible : clipPathHidden }}
        transition={{
          duration: TIMELINE.irisDuration / 1000,
          ease: [0.16, 1.35, 0.3, 1],
        }}
        style={{ contain: "paint", ...gpuLayer }}
        className="relative z-0"
      >
        <m.div
          initial={{ opacity: 0, y: 18 }}
          animate={isBlooming ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{
            duration: TIMELINE.contentFadeDuration / 1000,
            delay: TIMELINE.contentFadeDelay / 1000,
            ease: "easeOut",
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <MainContent guestName={guestName} />
        </m.div>
      </m.div>

      <AnimatePresence>
        {phase === "cover" && (
          <CoverPage key="cover" guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "opening" && (
          <m.div
            key="bloom-fx"
            className="pointer-events-none fixed inset-0 z-68"
            style={gpuLayer}
            exit={{
              opacity: 0,
              transition: { duration: TIMELINE.overlayExitDuration / 1000 },
            }}
          >
            <div
              style={{
                left: `${BLOOM_ORIGIN.xPct}%`,
                top: `${BLOOM_ORIGIN.yPct}%`,
                animation: "gardenGlowPulse 0.9s ease-out forwards",
              }}
              className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/65 blur-2xl sm:h-40 sm:w-40"
            />

            <BloomParticles />
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
      <HomeInner />
    </LazyMotion>
  );
}
