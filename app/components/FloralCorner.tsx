"use client";

import { memo } from "react";
import Image from "next/image";

interface FloralCornerProps {
  className?: string;
  flip?: string;
}

function FloralCorner({ className = "", flip = "" }: FloralCornerProps) {
  return (
    <div aria-hidden="true" className={`relative ${className} ${flip}`}>
      <Image
        src="/assets/floral-corner.webp"
        alt=""
        fill
        className="pointer-events-none select-none object-contain"
        sizes="200px"
        draggable={false}
        priority
      />
    </div>
  );
}

export default memo(FloralCorner);
