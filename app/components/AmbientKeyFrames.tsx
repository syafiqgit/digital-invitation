"use client";

import { memo } from "react";

export const AmbientKeyframes = memo(function AmbientKeyframes() {
  return (
    <style>{`
      @keyframes couple-twinkle {
        0%, 100% { opacity: 0.15; transform: scale(0.6) translateZ(0); }
        50% { opacity: 0.9; transform: scale(1.2) translateZ(0); }
      }
      @keyframes couple-fairy-blink {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 1; }
      }
      @keyframes couple-glow-pulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.6; }
      }
      @media (prefers-reduced-motion: reduce) {
        [class*="couple-anim-"] {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `}</style>
  );
});
