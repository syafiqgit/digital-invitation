"use client";

import { memo } from "react";
import { scatterItems, sparkles } from "../lib/decor-data";
import { MiniBloom, MiniLeaf } from "./DecorPieces";
import { Sparkle } from "./cover page/CoverDecorations";

const GPU_HINT = { willChange: "transform, opacity" } as const;

export const AmbientDecor = memo(function AmbientDecor() {
  return (
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
    </div>
  );
});
