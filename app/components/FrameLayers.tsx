"use client";

import { memo } from "react";
import { m, type Variants } from "framer-motion";
import { vines, corners, cornerOrnaments } from "../lib/decor-data";
import { CornerFlourish } from "./DecorPieces";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

const GPU_HINT = { willChange: "transform, opacity" } as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
          <div
            className="couple-anim-sway h-full w-full"
            style={
              {
                transformOrigin: v.swayOrigin,
                animation: `couple-sway ${v.swayDuration}s ease-in-out ${v.delay + 0.5}s infinite${v.swayReverse ? " reverse" : ""}`,
                "--sway-mag": `${v.swayMagnitude}deg`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
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
          <div
            className="couple-anim-sway h-full w-full"
            style={
              {
                transformOrigin: c.swayOrigin,
                animation: `couple-sway ${c.swayDuration}s ease-in-out ${c.fadeDelay + 0.5}s infinite${c.swayReverse ? " reverse" : ""}`,
                "--sway-mag": `${c.swayMagnitude}deg`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`couple-anim-ornament pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
          style={
            {
              animation: `couple-ornament-pulse ${c.duration}s ease-in-out ${c.delay}s infinite`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-6 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block sm:inset-8 lg:inset-12" />
    </>
  );
});
