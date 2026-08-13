"use client";

import { memo } from "react";
import {
  scatterItems,
  sparkles,
  floatingPetals,
  goldDusts,
  butterflies,
  fireflies,
} from "../lib/decor-data";
import { Sparkle } from "./CoverDecorations";
import { MiniBloom, MiniLeaf, Butterfly } from "./DecorPieces";

const GPU_HINT = { willChange: "transform, opacity" } as const;

export const AmbientDecor = memo(function AmbientDecor() {
  return (
    <>
      <div className="hidden md:contents">
        {scatterItems.map((item, i) => (
          <div
            key={`scatter-${i}`}
            style={{ top: item.top, left: item.left }}
            className="pointer-events-none absolute z-[1]"
          >
            {item.type === "bloom" ? (
              <MiniBloom className="opacity-85" color={item.color} />
            ) : (
              <MiniLeaf className="opacity-80" rot={item.rot} />
            )}
          </div>
        ))}

        {sparkles.map((s, i) => (
          <div
            key={`sparkle-${i}`}
            className="couple-anim-twinkle pointer-events-none absolute z-[1]"
            style={
              {
                top: s.top,
                left: s.left,
                animation: `couple-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
          </div>
        ))}

        {floatingPetals.map((p, i) => (
          <div
            key={`petal-${i}`}
            className="couple-anim-petal pointer-events-none absolute top-[-10%] z-[4]"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                animation: `couple-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="9"
                fill={p.color}
                opacity="0.8"
              />
            </svg>
          </div>
        ))}

        {goldDusts.map((g, i) => (
          <div
            key={`gd-${i}`}
            className="couple-anim-gold pointer-events-none absolute z-[15]"
            style={
              {
                left: g.left,
                bottom: g.bottom,
                width: g.size,
                height: g.size,
                animation: `couple-gold-rise ${g.duration}s linear ${g.delay}s infinite`,
              } as React.CSSProperties
            }
          >
            <div className="h-full w-full rounded-full bg-gradient-to-tr from-mustard to-yellow-200 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </div>
        ))}

        {butterflies.map((b, i) => (
          <div
            key={`butterfly-${i}`}
            className="couple-anim-butterfly pointer-events-none absolute z-[2] h-4 w-5 lg:h-6 lg:w-8"
            style={
              {
                left: b.left,
                top: b.top,
                animation: `couple-butterfly-flit ${b.duration}s ease-in-out ${b.delay}s infinite`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <Butterfly className="h-full w-full" color={b.color} />
          </div>
        ))}
      </div>

      <div className="contents">
        {fireflies.map((f, i) => (
          <div
            key={`firefly-${i}`}
            className="couple-anim-firefly pointer-events-none absolute z-[1] h-1.5 w-1.5 lg:h-2 lg:w-2"
            style={
              {
                left: f.left,
                bottom: f.bottom,
                animation: `couple-firefly-drift ${f.duration}s ease-in-out ${f.delay}s infinite`,
                ...GPU_HINT,
              } as React.CSSProperties
            }
          >
            <div className="h-full w-full rounded-full bg-mustard blur-[1.5px]" />
          </div>
        ))}
      </div>
    </>
  );
});
