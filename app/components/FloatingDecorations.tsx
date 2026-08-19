"use client";

import { memo } from "react";
import { m, type Transition } from "framer-motion";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                                UTILS & SVGS                                */
/* -------------------------------------------------------------------------- */
const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease,
});

const Sparkle = memo(({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="var(--mustard)"
  >
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
  </svg>
));
Sparkle.displayName = "Sparkle";

/* -------------------------------------------------------------------------- */
/*                           PRE-CALCULATED DATA                              */
/* -------------------------------------------------------------------------- */
const sparkles = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "12%" },
  { top: "88%", left: "82%" },
];

const butterflies = [
  {
    key: "bf-1",
    src: "/assets/butterfly-1.webp",
    top: "22%",
    left: "16%",
    size: 26,
    duration: 9,
    delay: 0,
    xRange: [0, 14, -6, 0],
    yRange: [0, -10, -4, 0],
    rotateRange: [0, 6, -4, 0],
  },
  {
    key: "bf-2",
    src: "/assets/butterfly-2.webp",
    top: "70%",
    left: "82%",
    size: 22,
    duration: 11,
    delay: 1.5,
    xRange: [0, -12, 8, 0],
    yRange: [0, -8, 6, 0],
    rotateRange: [0, -5, 5, 0],
  },
];

const petals = [
  {
    left: "8%",
    size: 16,
    duration: 9,
    delay: 0,
    drift: 18,
    blur: "blur-[1px]",
    opacity: "opacity-80",
  },
  {
    left: "30%",
    size: 13,
    duration: 11,
    delay: 2.5,
    drift: -14,
    blur: "blur-0",
    opacity: "opacity-100",
  }, // Fokus paling tajam
  {
    left: "68%",
    size: 17,
    duration: 10,
    delay: 1,
    drift: 12,
    blur: "blur-[2px]",
    opacity: "opacity-60",
  }, // Paling blur (seolah dekat kamera)
  {
    left: "90%",
    size: 14,
    duration: 12,
    delay: 4,
    drift: -20,
    blur: "blur-[0.5px]",
    opacity: "opacity-90",
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
function FloatingDecorations() {
  return (
    <>
      {/* 1. BUTTERFLIES (Framer Motion) */}
      {butterflies.map((b) => (
        <m.div
          key={b.key}
          className="pointer-events-none absolute z-4"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            x: b.xRange,
            y: b.yRange,
            rotate: b.rotateRange,
          }}
          transition={loop(b.duration, b.delay)}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: "center" }}
            animate={{ scaleY: [1, 0.55, 1] }}
            transition={loop(0.5, b.delay * 0.3)}
          >
            <Image
              src={b.src}
              alt="Butterfly"
              fill
              sizes={`${b.size}px`}
              className="pointer-events-none select-none object-contain"
              draggable={false}
              aria-hidden="true"
            />
          </m.div>
        </m.div>
      ))}

      {/* 2. FALLING PETALS (Pure CSS) */}
      {petals.map((p, i) => (
        <div
          key={`petal-${i}`}
          // Tambahkan p.blur dan p.opacity di sini
          className={`pointer-events-none absolute top-0 z-4 ${p.blur} ${p.opacity}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `floating-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
            ["--petal-drift" as string]: `${p.drift}px`,
          }}
        >
          <Image
            src="/assets/flower-petal.webp"
            alt="Petal"
            fill
            sizes={`${p.size}px`}
            className="pointer-events-none select-none object-contain"
            draggable={false}
            aria-hidden="true"
          />
        </div>
      ))}

      {/* 3. STATIC SPARKLES (Pure CSS) */}
      {sparkles.map((s, i) => (
        <div
          key={`sp-${i}`}
          className="pointer-events-none absolute z-10"
          style={{
            top: s.top,
            left: s.left,
            animation: `floating-twinkle ${2.6 + (i % 3) * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          <Sparkle className="h-3 w-3 opacity-90 sm:h-4 sm:w-4" />
        </div>
      ))}
    </>
  );
}

export default memo(FloatingDecorations);
