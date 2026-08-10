"use client";

import Image from "next/image";
import { memo } from "react";

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
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: WREATH_ASPECT_RATIO }}
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
    </div>
  );
}

export default memo(WreathFrame);
