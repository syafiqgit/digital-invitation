"use client";

import { memo, useCallback, useState, useEffect } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import {
  container,
  CoverBackground,
  CoverOrnaments,
  CoverParticles,
} from "./CoverDecorations";
import { CoverContent } from "./CoverContent";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

function CoverPageInner({ guestName = "Dear Guest", onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Lazy load partikel animasi agar tidak berebut CPU thread dengan animasi elemen utama
  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  return (
    <AnimatePresence>
      <m.div
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <CoverBackground />
        <CoverOrnaments />

        {/* Render partikel hanya jika loading tahap awal telah selesai */}
        {showParticles && <CoverParticles />}

        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ containerType: "inline-size" }}
          className="relative z-20 flex w-full max-w-xs flex-col items-center px-5 text-center xs:max-w-sm sm:max-w-md sm:px-8 lg:max-w-160"
        >
          {/* Komponen konten utama (Teks, Frame, Tombol) diisolasi di sini */}
          <CoverContent
            guestName={guestName}
            isOpening={isOpening}
            onOpen={handleOpen}
          />
        </m.div>
      </m.div>
    </AnimatePresence>
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
