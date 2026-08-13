"use client";

import { memo } from "react";
import { m, type Variants } from "framer-motion";
import { vines, corners, cornerOrnaments } from "../lib/decor-data";
import { CornerFlourish } from "./DecorPieces";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

const vineFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: v.delay }}
          className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
        >
          <FloralVine orientation={v.orientation} className="h-full w-full" />
        </m.div>
      ))}

      {corners.map((c) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <FloralCorner className="h-full w-full" flip={c.flip} />
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-6 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block sm:inset-8 lg:inset-12" />
    </>
  );
});
