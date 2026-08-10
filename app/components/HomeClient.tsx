"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "./CoverPage";
import MainContent from "./MainContent";

const MUSIC_SRC = "/assets/alex-morgan-wedding-garden-ceremony-glow-578500.mp3";

const BLOOM_ORIGIN = { xPct: 50, yPct: 40 };

const TIMELINE = {
  irisDuration: 950,
  contentFadeDelay: 620,
  contentFadeDuration: 600,
  particleTail: 1150,
  overlayExitDuration: 300,
} as const;

const TOTAL_MS =
  Math.max(
    TIMELINE.irisDuration,
    TIMELINE.contentFadeDelay + TIMELINE.contentFadeDuration,
    TIMELINE.particleTail,
  ) + TIMELINE.overlayExitDuration;

const gpuLayer: React.CSSProperties = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
};

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

const PARTICLES_PER_WAVE = 26;
const WAVE_COUNT = 2;

function buildWave(waveIndex: number): Particle[] {
  return Array.from({ length: PARTICLES_PER_WAVE }, (_, i) => {
    const angle =
      (i / PARTICLES_PER_WAVE) * Math.PI * 2 +
      (i % 2 ? 0.12 : -0.08) +
      waveIndex * 0.18;
    const distance = 120 + (i % 5) * 60 + waveIndex * 40;
    const isLeaf = i % 3 !== 1;
    return {
      id: `${waveIndex}-${i}`,
      kind: isLeaf ? "leaf" : "petal",
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rot: (isLeaf ? 480 : 220) + ((i * 41 + waveIndex * 30) % 120),
      delay: waveIndex * 0.16 + (i % 7) * 0.018,
      duration: 0.95 + (i % 3) * 0.08,
      color:
        i % 4 === 0
          ? "var(--blush-dark)"
          : i % 4 === 1
            ? "var(--coral)"
            : i % 4 === 2
              ? "var(--sage-light)"
              : "var(--burgundy)",
      size: isLeaf ? 11 + (i % 3) * 4 : 8 + (i % 4) * 4,
    };
  });
}

function buildParticles(): Particle[] {
  return Array.from({ length: WAVE_COUNT }, (_, w) => buildWave(w)).flat();
}

const BloomParticles = memo(function BloomParticles() {
  const particles = useMemo(buildParticles, []);
  return (
    <>
      <style>{`
        @keyframes bloomFly {
          0% { opacity: 0; transform: translate3d(0,0,0) rotate(0deg) scale(0.3); }
          30% { opacity: 1; transform: translate3d(calc(var(--tx) * 0.6), calc(var(--ty) * 0.6), 0) rotate(calc(var(--rot) * 0.5)) scale(1.05); }
          70% { opacity: 1; transform: translate3d(var(--tx), var(--ty), 0) rotate(calc(var(--rot) * 0.85)) scale(1); }
          100% { opacity: 0; transform: translate3d(calc(var(--tx) * 1.08), calc(var(--ty) * 1.08), 0) rotate(var(--rot)) scale(0.7); }
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
      `}</style>

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

type Phase = "cover" | "opening" | "content";

export default function Home() {
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

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <AnimatePresence>
        {isOpened && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4 }}
            aria-label={isMusicPlaying ? "Matikan musik" : "Putar musik"}
            className="fixed bottom-4 right-4 z-70 flex h-11 w-11 items-center justify-center rounded-full border border-mustard/60 bg-ivory shadow-md sm:h-12 sm:w-12"
          >
            <motion.span
              animate={isMusicPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                duration: 6,
                repeat: isMusicPlaying ? Infinity : 0,
                ease: "linear",
              }}
              className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
            >
              {isMusicPlaying ? (
                <NoteIcon className="h-full w-full" />
              ) : (
                <MutedNoteIcon className="h-full w-full" />
              )}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          clipPath: `circle(0% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`,
        }}
        animate={{
          clipPath: isBlooming
            ? `circle(150% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`
            : `circle(0% at ${BLOOM_ORIGIN.xPct}% ${BLOOM_ORIGIN.yPct}%)`,
        }}
        transition={{
          duration: TIMELINE.irisDuration / 1000,
          ease: [0.16, 1.35, 0.3, 1],
        }}
        style={{ contain: "paint", ...gpuLayer }}
        className="relative z-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isBlooming ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{
            duration: TIMELINE.contentFadeDuration / 1000,
            delay: TIMELINE.contentFadeDelay / 1000,
            ease: "easeOut",
          }}
        >
          <MainContent guestName={guestName} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {phase === "cover" && (
          <CoverPage key="cover" guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "opening" && (
          <motion.div
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
                animation: "gardenGlowPulse 1s ease-out forwards",
              }}
              className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mustard/70 blur-3xl"
            />
            <style>{`
              @keyframes gardenGlowPulse {
                0% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(0.4); }
                45% { opacity: 0.6; transform: translate3d(-50%,-50%,0) scale(2.3); }
                100% { opacity: 0; transform: translate3d(-50%,-50%,0) scale(3.1); }
              }
            `}</style>

            <BloomParticles />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
