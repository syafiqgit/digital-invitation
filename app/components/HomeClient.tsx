"use client";

import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import CoverPage from "./CoverPage";
import { BloomParticles, BLOOM_ORIGIN } from "./BloomEffect";
import { FloatingMusic } from "./FloatingMusic";
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });

const MUSIC_SRC =
  "/assets/Michael Bublé - L.O.V.E. [Official Audio]_1786599652652.mp3";

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

type Phase = "cover" | "opening" | "content";

function HomeInner() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Syafiq";

  const [phase, setPhase] = useState<Phase>("cover");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = useCallback(() => {
    setPhase("opening");

    // Play music immediately on user interaction
    if (audioRef.current) {
      audioRef.current
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
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />

      <AnimatePresence>
        {isOpened && (
          <FloatingMusic isPlaying={isMusicPlaying} onToggle={toggleMusic} />
        )}
      </AnimatePresence>

      <m.div
        initial={{ clipPath: clipPathHidden }}
        animate={{ clipPath: isBlooming ? clipPathVisible : clipPathHidden }}
        transition={{
          duration: TIMELINE.irisDuration / 1000,
          ease: [0.16, 1.35, 0.3, 1],
        }}
        style={{ contain: "paint", transform: "translateZ(0)" }}
        className="relative z-0"
      >
        {isOpened && (
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={isBlooming ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
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

      <AnimatePresence>
        {phase === "opening" && (
          <m.div
            key="bloom-fx"
            className="pointer-events-none fixed inset-0 z-68"
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
