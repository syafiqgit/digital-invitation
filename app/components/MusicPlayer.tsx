// components/MusicPlayer.tsx
'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MusicPlayerHandle {
  play: () => void;
  pause: () => void;
}

interface MusicPlayerProps {
  src?: string;
}

const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  ({ src = '/audio/wedding-song.mp3' }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (!audioRef.current) return;
        audioRef.current.muted = false;
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      },
      pause: () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      },
    }));

    // Autoplay muted saat halaman dimuat, lalu unmute otomatis di interaksi pertama user
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = true;
      audio.volume = 0.5;
      audio.play().then(() => setHasStarted(true)).catch(() => {});

      const unmuteOnFirstInteraction = () => {
        if (!audio) return;
        audio.muted = false;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {});
        window.removeEventListener('click', unmuteOnFirstInteraction);
        window.removeEventListener('touchstart', unmuteOnFirstInteraction);
        window.removeEventListener('keydown', unmuteOnFirstInteraction);
      };

      window.addEventListener('click', unmuteOnFirstInteraction);
      window.addEventListener('touchstart', unmuteOnFirstInteraction);
      window.addEventListener('keydown', unmuteOnFirstInteraction);

      return () => {
        window.removeEventListener('click', unmuteOnFirstInteraction);
        window.removeEventListener('touchstart', unmuteOnFirstInteraction);
        window.removeEventListener('keydown', unmuteOnFirstInteraction);
      };
    }, []);

    const toggle = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.muted = false;
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    };

    return (
      <>
        <audio ref={audioRef} src={src} loop preload="auto" />

        <AnimatePresence>
          {hasStarted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              onClick={toggle}
              className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-sage/50 bg-white/80 shadow-md backdrop-blur-sm"
              aria-label={isPlaying ? 'Matikan musik' : 'Nyalakan musik'}
            >
              {isPlaying ? (
                <div className="flex h-4 items-end gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full bg-blush-dark"
                      animate={{ height: ['30%', '100%', '30%'] }}
                      transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-sage">
                  <path
                    d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </>
    );
  }
);

MusicPlayer.displayName = 'MusicPlayer';
export default MusicPlayer;