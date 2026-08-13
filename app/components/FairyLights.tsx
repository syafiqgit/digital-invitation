"use client";

import { memo } from "react";
import { fairyLights } from "../lib/decor-data";

export const FairyLights = memo(function FairyLights() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] hidden h-full w-full opacity-70 sm:block"
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
    >
      {fairyLights.map((f, i) => (
        <g key={`fl-${i}`}>
          <circle
            cx={f.cx}
            cy={f.cy}
            r="5.5"
            fill="var(--mustard)"
            opacity="0.18"
          />
          <circle
            cx={f.cx}
            cy={f.cy}
            r="2.6"
            fill="var(--mustard)"
            className="couple-anim-fairy"
            style={{
              animation: `couple-fairy-blink ${2.4 + (i % 3) * 0.4}s ease-in-out ${f.delay}s infinite`,
            }}
          />
        </g>
      ))}
    </svg>
  );
});

/* Static, non-animated ambient glow — replaces the original's continuously
   rotating 600-800px conic-gradient, which was the single biggest
   performance cost in the whole section (a large blurred gradient being
   rotated every frame, forever). A soft radial glow reads the same at a
   glance without any per-frame cost at all. */
export const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10)_0%,transparent_70%)] blur-2xl lg:h-[620px] lg:w-[620px]"
    />
  );
});
