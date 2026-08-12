"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import CoverPage from "./CoverPage";
import MainContent from "./MainContent";

const MUSIC_SRC = "/assets/alex-morgan-wedding-garden-ceremony-glow-578500.mp3";

const BLOOM_ORIGIN = { xPct: 50, yPct: 40 };

const TIMELINE = {
  irisDuration: 1100,
  contentFadeDelay: 680,
  contentFadeDuration: 750,
  particleTail: 1400,
  overlayExitDuration: 400,
} as const;

const TOTAL_MS =
  Math.max(
    TIMELINE.irisDuration,
    TIMELINE.contentFadeDelay + TIMELINE.contentFadeDuration,
    TIMELINE.particleTail,
  ) + TIMELINE.overlayExitDuration;

// Hanya berikan hint pada layer induk utama, jangan sebar ke puluhan child
const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity, clip-path",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

// Blur animation dihapus dari keyframes.
// Filter blur animasi sangat menguras GPU memori pada mobile.
const GlobalStyles = memo(function GlobalStyles() {
  return (
    <style>{`
      @keyframes bloomFly {
        0% { opacity: 0; transform: translate3d(0,0,0) rotate(0deg) scale(0.2); }
        15% { opacity: 1; }
        45% { opacity: 1; transform: translate3d(calc(var(--tx) * 0.7), calc(var(--ty) * 0.7), 0) rotate(calc(var(--rot) * 0.6)) scale(1.15); }
        75% { opacity: 0.8; transform: translate3d(var(--tx), var(--ty), 0) rotate(calc(var(--rot) * 0.9)) scale(1); }
        100% { opacity: 0; transform: translate3d(calc(var(--tx) * 1.2), calc(var(--ty) * 1.2), 0) rotate(var(--rot)) scale(0.6); }
      }
      .bloom-particle {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate3d(0,0,0);
        animation-name: bloomFly;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        animation-fill-mode: both;
      }
      @keyframes gardenGlowPulse {
        0% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(0.2); }
        35% { opacity: 0.8; transform: translate3d(-50%,-50%,0) scale(2.8); }
        70% { opacity: 0.6; transform: translate3d(-50%,-50%,0) scale(4.5); }
        100% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(5.5); }
      }
      @keyframes musicGlowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(212,175,55,0.2), inset 0 0 5px rgba(212,175,55,0.1); transform: scale(1); }
        50% { box-shadow: 0 0 20px rgba(212,175,55,0.6), inset 0 0 10px rgba(212,175,55,0.3); transform: scale(1.05); }
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
  kind: "petal" | "leaf" | "sparkle";
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
};

// Optimal particle count: 3 waves x 20 particles = 60 elemen.
// Cukup ramai secara visual tapi tidak menghancurkan framerate.
const PARTICLES_PER_WAVE = 20;
const WAVE_COUNT = 3;

const PARTICLE_COLORS = [
  "var(--blush-dark)",
  "var(--coral)",
  "var(--sage-light)",
  "var(--burgundy)",
  "var(--mustard)",
] as const;

function buildWave(waveIndex: number): Particle[] {
  return Array.from({ length: PARTICLES_PER_WAVE }, (_, i) => {
    const angle =
      (i / PARTICLES_PER_WAVE) * Math.PI * 2 +
      (i % 2 ? 0.15 : -0.15) +
      waveIndex * 0.25;
    const distance = 140 + (i % 5) * 75 + waveIndex * 60;

    let kind: "petal" | "leaf" | "sparkle" = "petal";
    if (i % 4 === 1) kind = "leaf";
    else if (i % 4 === 2) kind = "sparkle";

    const rotMultiplier = i % 2 === 0 ? 1 : -1;

    return {
      id: `${waveIndex}-${i}`,
      kind,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rot:
        ((kind === "leaf" ? 540 : 280) + ((i * 53 + waveIndex * 40) % 180)) *
        rotMultiplier,
      delay: waveIndex * 0.18 + (i % 9) * 0.02,
      duration: 1.1 + (i % 4) * 0.15,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      size:
        kind === "leaf"
          ? 12 + (i % 4) * 4
          : kind === "sparkle"
            ? 6 + (i % 3) * 2
            : 9 + (i % 5) * 4,
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
          viewBox={p.kind === "sparkle" ? "0 0 24 24" : "0 0 20 20"}
          width={p.size}
          height={p.size}
          className="bloom-particle -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
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
          ) : p.kind === "sparkle" ? (
            <path
              d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
              fill="var(--mustard)"
              opacity="0.9"
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

  const clipPathVisible = `circle(160% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`;
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
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.6, ease: "backOut", delay: 1 }}
            aria-label={isMusicPlaying ? "Matikan musik" : "Putar musik"}
            className="fixed bottom-5 right-5 z-70 flex h-12 w-12 items-center justify-center rounded-full border border-mustard/60 bg-ivory/95 shadow-[0_8px_20px_rgba(58,54,48,0.15)] backdrop-blur-sm sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
            style={{
              willChange: "transform, opacity",
              animation: isMusicPlaying
                ? "musicGlowPulse 3s infinite ease-in-out"
                : "none",
            }}
          >
            <m.span
              animate={isMusicPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 5,
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
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ contain: "paint", ...gpuLayer }}
        className="relative z-0"
      >
        <m.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={
            isBlooming
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.96 }
          }
          transition={{
            duration: TIMELINE.contentFadeDuration / 1000,
            delay: TIMELINE.contentFadeDelay / 1000,
            ease: [0.22, 1, 0.36, 1],
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
            {/* Glow dibiarkan statis blur-nya, scale-nya saja yang dianimasikan */}
            <div
              style={{
                left: `${BLOOM_ORIGIN.xPct}%`,
                top: `${BLOOM_ORIGIN.yPct}%`,
                animation: "gardenGlowPulse 1.4s ease-out forwards",
              }}
              className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/60 blur-[40px]"
            />
            <div
              style={{
                left: `${BLOOM_ORIGIN.xPct}%`,
                top: `${BLOOM_ORIGIN.yPct}%`,
                animation: "gardenGlowPulse 1.2s ease-out forwards",
                animationDelay: "0.1s",
              }}
              className="absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush-dark/50 blur-[50px]"
            />
            <div
              style={{
                left: `${BLOOM_ORIGIN.xPct}%`,
                top: `${BLOOM_ORIGIN.yPct}%`,
                animation: "gardenGlowPulse 1s ease-out forwards",
                animationDelay: "0.2s",
              }}
              className="absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/40 blur-[60px]"
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
