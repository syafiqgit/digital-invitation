"use client";

import { memo } from "react";
import Image from "next/image";

type Props = {
  className?: string;
  flip?: string;
};

function FloralCorner({ className = "", flip = "" }: Props) {
  return (
    <div className={`relative ${className} ${flip}`}>
      <Image
        src="/assets/floral-corner-transparent.png"
        alt=""
        fill
        className="object-contain"
        sizes="200px"
        priority
      />
    </div>
  );
}

export default memo(FloralCorner);
