"use client";

import { memo, useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "./CoverPage";
import MainContent from "./MainContent";

const MUSIC_SRC = "/assets/alex-morgan-wedding-garden-ceremony-glow-578500.mp3";

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

export default function Home() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false));
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

      {!isOpened && <CoverPage guestName={guestName} onOpen={handleOpen} />}
      {isOpened && <MainContent guestName={guestName} />}
    </>
  );
}
