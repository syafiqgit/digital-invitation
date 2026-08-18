"use client";

import { memo, useCallback, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { container, CoverBackground, CoverOrnaments } from "./CoverDecorations";
import { CoverContent } from "./CoverContent";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

function CoverPageInner({ guestName = "Dear Guest", onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  // Mulai fade lebih awal (0.4s sebelum video benar-benar habis) biar overlap-nya kerasa nyatu, bukan nunggu video habis baru mulai fade
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration && v.duration - v.currentTime <= 0.4) {
      setShowVideo(false);
    }
  }, []);

  return (
    <m.div
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        willChange: "opacity",
      }}
    >
      {/* Cover selalu di-mount & mulai animasi dari awal, jadi saat video fade out, cover udah "hidup" duluan di baliknya -> crossfade beneran, bukan cut-then-fade */}
      <CoverBackground />
      <CoverOrnaments />

      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ containerType: "inline-size" }}
        className="relative z-20 flex w-full max-w-xs flex-col items-center px-5 text-center xs:max-w-sm sm:max-w-md sm:px-8 md:max-w-lg md:px-10 lg:max-w-160"
      >
        <CoverContent
          guestName={guestName}
          isOpening={isOpening}
          onOpen={handleOpen}
        />
      </m.div>

      <AnimatePresence>
        {showVideo && (
          <m.div
            key="cinematic-splash"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[100] bg-ivory"
          >
            <video
              ref={videoRef}
              src="/assets/Burgundy_roses_blooming_intro.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setShowVideo(false)}
              onTimeUpdate={handleTimeUpdate}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className="absolute right-5 top-5 z-[110] rounded-full bg-ink/20 px-4 py-1.5 text-[0.65rem] font-bold tracking-widest text-white backdrop-blur-md transition-colors hover:bg-ink/40 sm:text-xs"
            >
              SKIP
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

function CoverPage(props: CoverPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoverPageInner {...props} />
    </LazyMotion>
  );
}

export default memo(CoverPage);
