"use client";

import { memo, useCallback, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { container, CoverBackground, CoverOrnaments } from "./CoverDecorations";
import { CoverContent } from "./CoverContent";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

function CoverPageInner({ guestName = "Dear Guest", onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);

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
        transform: "translateZ(0)", // Memaksa akselerasi hardware
      }}
    >
      <CoverBackground />
      <CoverOrnaments />

      {/* Catatan: CoverParticles dihapus total untuk menjaga kestabilan 60fps mutlak di mobile */}

      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ containerType: "inline-size" }}
        className="relative z-20 flex w-full max-w-xs flex-col items-center px-5 text-center xs:max-w-sm sm:max-w-md sm:px-8 lg:max-w-160"
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
