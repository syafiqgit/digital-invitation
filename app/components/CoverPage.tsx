"use client";

import { memo, useCallback, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { container, CoverBackground, CoverOrnaments } from "./CoverDecorations";
import { CoverContent } from "./CoverContent";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

function CoverPageInner({ guestName = "Dear Guest", onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  // Tambahkan state untuk mengontrol kemunculan video
  const [showVideo, setShowVideo] = useState(true);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  return (
    <m.div
      // Exit animation dikoordinasikan secara ringan lewat opacity murni
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
      {/* --- VIDEO SPLASH SCREEN --- */}
      <AnimatePresence>
        {showVideo && (
          <m.div
            key="cinematic-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }} // Fade out halus selama 1.2 detik
            className="absolute inset-0 z-[100] bg-ivory"
          >
            <video
              src="/assets/A_smooth_elegant_watercolor_a.webm" // Sesuaikan dengan path/nama file video Anda
              autoPlay
              muted
              playsInline
              onEnded={() => setShowVideo(false)}
              className="h-full w-full object-cover"
            />
            {/* Tombol Skip dengan efek Glassmorphism */}
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

      <CoverBackground />
      <CoverOrnaments />

      <m.div
        variants={container}
        initial="hidden"
        // Tahan animasi cover sampai video selesai/di-skip agar timing masuknya elemen pas
        animate={showVideo ? "hidden" : "show"}
        style={{ containerType: "inline-size" }}
        className="relative z-20 flex w-full max-w-xs flex-col items-center px-5 text-center xs:max-w-sm sm:max-w-md sm:px-8 md:max-w-lg md:px-10 lg:max-w-160"
      >
        <CoverContent
          guestName={guestName}
          isOpening={isOpening}
          onOpen={handleOpen}
        />
      </m.div>
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
