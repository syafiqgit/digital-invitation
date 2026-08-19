"use client";

import { useCallback, useEffect, useRef, useState, memo, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import CoverPage from "./cover page/CoverPage";
import { FloatingMusic } from "./FloatingMusic";

// ✅ LAZY LOADING: Code-splitting chunk MainContent
const MainContent = dynamic(() => import("./MainContent"), {
  ssr: false,
  loading: () => null,
});

const MUSIC_SRC =
  "/assets/Christina Perri - A Thousand Years [Official Music Video]_1786688765919.mp3";

const TIMELINE = {
  irisDuration: 850,
  contentFadeDelay: 300,
  contentFadeDuration: 600,
} as const;

const TOTAL_MS = Math.max(
  TIMELINE.irisDuration,
  TIMELINE.contentFadeDelay + TIMELINE.contentFadeDuration,
);

type Phase = "cover" | "opening" | "content";

/* ---------- DATA & KOMPONEN BLOOM PARTICLES ---------- */
export const BLOOM_ORIGIN = { xPct: 50, yPct: 40 };

const PARTICLES_PER_WAVE = 12;
const WAVE_COUNT = 2;
const PARTICLE_COLORS = [
  "var(--blush-dark)",
  "var(--coral)",
  "var(--sage-light)",
  "var(--burgundy)",
] as const;

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

// ✅ HOISTING STYLES: Dikeluarkan dari siklus render agar parsing CSS engine lebih efisien
const BLOOM_STYLES = `
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
`;

export const BloomParticles = memo(function BloomParticles() {
  const particles = useMemo(
    () => Array.from({ length: WAVE_COUNT }, (_, w) => buildWave(w)).flat(),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{ left: `${BLOOM_ORIGIN.xPct}%`, top: `${BLOOM_ORIGIN.yPct}%` }}
    >
      <style dangerouslySetInnerHTML={{ __html: BLOOM_STYLES }} />

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

/* ---------- MAIN HOME INNER ---------- */
function HomeInner() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Guest"; // Fallback default yang lebih universal

  const [phase, setPhase] = useState<Phase>("cover");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isIrisAnimating, setIsIrisAnimating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const phaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // PRELOAD SILENT: Memuat chunk MainContent di latar belakang setelah render pertama stabil
    const preloadTimeout = window.setTimeout(() => {
      import("./MainContent");
    }, 1000);

    return () => {
      // ✅ SAFETY: Cleanup semua timeout saat komponen unmount untuk mencegah memory leak
      window.clearTimeout(preloadTimeout);
      if (phaseTimerRef.current) window.clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const handleOpen = useCallback(() => {
    setPhase("opening");
    setIsIrisAnimating(true);

    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => setIsMusicPlaying(false));
      }
    });

    phaseTimerRef.current = window.setTimeout(
      () => setPhase("content"),
      TOTAL_MS,
    );
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
      {/* ✅ OPTIMASI SEO & KUOTA: preload="metadata" mencegah unduhan file MP3 penuh di awal */}
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="metadata" />

      <AnimatePresence>
        {isOpened && (
          <FloatingMusic isPlaying={isMusicPlaying} onToggle={toggleMusic} />
        )}
      </AnimatePresence>

      {isOpened && <BloomParticles />}

      <m.div
        initial={{ clipPath: clipPathHidden }}
        animate={{ clipPath: isBlooming ? clipPathVisible : clipPathHidden }}
        transition={{
          duration: TIMELINE.irisDuration / 1000,
          ease: [0.16, 1.35, 0.3, 1],
        }}
        onAnimationComplete={() => setIsIrisAnimating(false)}
        style={
          isIrisAnimating
            ? {
                contain: "paint",
                transform: "translateZ(0)", // Force GPU acceleration
                willChange: "clip-path",
              }
            : undefined
        }
        className="relative z-0"
      >
        {isOpened && (
          <m.div
            initial={{ opacity: 0 }}
            animate={isBlooming ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: TIMELINE.contentFadeDuration / 1000,
              delay: TIMELINE.contentFadeDelay / 1000,
              ease: "easeOut",
            }}
          >
            <MainContent guestName={guestName} />
          </m.div>
        )}
      </m.div>

      <AnimatePresence>
        {phase === "cover" && (
          <CoverPage key="cover" guestName={guestName} onOpen={handleOpen} />
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
