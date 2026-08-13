"use client";

import { memo } from "react";
import { m } from "framer-motion";

const NoteIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
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
));

const MutedNoteIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
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
));

interface FloatingMusicProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const FloatingMusic = memo(function FloatingMusic({
  isPlaying,
  onToggle,
}: FloatingMusicProps) {
  return (
    <m.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.35 }}
      aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
      className="fixed bottom-3 right-3 z-70 flex h-11 w-11 items-center justify-center rounded-full border border-mustard/60 bg-linear-to-b from-ivory to-ivory/90 shadow-[0_4px_14px_rgba(58,54,48,0.12)] backdrop-blur-sm sm:bottom-4 sm:right-4 sm:h-12 sm:w-12"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <m.span
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={{
          duration: 6,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear",
        }}
        className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
      >
        {isPlaying ? <NoteIcon /> : <MutedNoteIcon />}
      </m.span>
    </m.button>
  );
});
