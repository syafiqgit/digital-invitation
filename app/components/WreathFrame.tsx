"use client";

import Image from "next/image";
import { memo } from "react";
import { m } from "framer-motion";

export const WREATH_ASPECT_RATIO = 1300 / 1249;

export const WREATH_HOLE = {
  centerLeftPct: 50.03,
  centerTopPct: 48.45,
  widthPct: 72.16,
  heightPct: 60.25,
};

type Props = { className?: string };

function WreathFrame({ className = "" }: Props) {
  return (
    <m.div
      className={`relative ${className}`}
      style={{
        aspectRatio: WREATH_ASPECT_RATIO,
        transformOrigin: "top center",
        willChange: "transform",
      }}
      // Ayunan halus & "napas" tak berhenti, transform-only (rotate+scale)
      // sehingga sepenuhnya ditangani compositor/GPU — mulai setelah
      // animasi entrance (wreathVariant di parent) selesai.
      animate={{
        rotate: [0, 0.8, 0, -0.8, 0],
        scale: [1, 1.012, 1, 1.008, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    >
      <Image
        src="/assets/wreath-full-final.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 610px, (min-width: 640px) 520px, 440px"
        className="pointer-events-none select-none object-contain"
        draggable={false}
        priority
      />
    </m.div>
  );
}

export default memo(WreathFrame);
