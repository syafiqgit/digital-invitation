"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import CoverPage from "./CoverPage";
import { BLOOM_ORIGIN } from "./BloomEffect";
import { FloatingMusic } from "./FloatingMusic";

// ✅ LAZY LOADING: Code-splitting chunk MainContent agar tidak membebani initial bundle
const MainContent = dynamic(() => import("./MainContent"), {
  ssr: false,
  loading: () => null,
});

const MUSIC_SRC =
  "/assets/Michael Bublé - L.O.V.E. [Official Audio]_1786599652652.mp3";

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

function HomeInner() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Syafiq";

  const [phase, setPhase] = useState<Phase>("cover");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ✅ PRELOAD SILENT: Memuat chunk MainContent di latar belakang setelah render pertama stabil
  useEffect(() => {
    const preloadTimeout = setTimeout(() => {
      import("./MainContent");
    }, 1000);
    return () => clearTimeout(preloadTimeout);
  }, []);

  const handleOpen = useCallback(() => {
    setPhase("opening");

    // ✅ NON-BLOCKING AUDIO: Menunda eksekusi audio 1 frame (rAF) agar animasi iris 60fps berjalan tanpa stutter
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => setIsMusicPlaying(false));
      }
    });

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
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <AnimatePresence>
        {isOpened && (
          <FloatingMusic isPlaying={isMusicPlaying} onToggle={toggleMusic} />
        )}
      </AnimatePresence>

      {/* ✅ GPU ACCELERATION & PAINT CONTAINMENT: 
          Mengisolasi area render iris transition menggunakan paint containment dan Biz/Hardware layer acceleration */}
      <m.div
        initial={{ clipPath: clipPathHidden }}
        animate={{ clipPath: isBlooming ? clipPathVisible : clipPathHidden }}
        transition={{
          duration: TIMELINE.irisDuration / 1000,
          ease: [0.16, 1.35, 0.3, 1],
        }}
        style={{
          contain: "paint",
          transform: "translateZ(0)",
          willChange: isBlooming ? "clip-path" : "auto",
        }}
        className="relative z-0"
      >
        {isOpened && (
          <m.div
            // ✅ FADE-IN MURNI: Menghindari layout shift vertikal (y-axis) pada seluruh halaman
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
