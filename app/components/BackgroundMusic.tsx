"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface BackgroundMusicHandle {
  play: () => void;
}

interface BackgroundMusicProps {
  src: string;
  className?: string;
}

function NoteIcon({ className = "" }: { className?: string }) {
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
}

function MutedNoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 18V5l11-2v13"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="6" cy="18" r="3" fill="var(--ink)" opacity="0.55" />
      <circle cx="17" cy="16" r="3" fill="var(--ink)" opacity="0.55" />
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
}

const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
  function BackgroundMusic({ src, className = "" }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            setIsPlaying(false);
            setHasStarted(true);
          });
      },
    }));

    const toggle = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

    return (
      <>
        <audio ref={audioRef} src={src} loop preload="auto" />
        <AnimatePresence>
          {hasStarted && (
            <motion.button
              type="button"
              onClick={toggle}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.4 }}
              aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
              className={`fixed bottom-4 right-4 z-60 flex h-11 w-11 items-center justify-center rounded-full border border-mustard/60 bg-ivory shadow-md sm:h-12 sm:w-12 ${className}`}
            >
              <motion.span
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 6,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "linear",
                }}
                className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
              >
                {isPlaying ? (
                  <NoteIcon className="h-full w-full" />
                ) : (
                  <MutedNoteIcon className="h-full w-full" />
                )}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </>
    );
  },
);

export default BackgroundMusic;
