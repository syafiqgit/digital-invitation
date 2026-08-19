"use client";

import { memo } from "react";
import { m } from "framer-motion";
import WreathFrame, { WREATH_HOLE } from "../WreathFrame";
import {
  fadeUp,
  wreathVariant,
  loop,
  Sparkle,
  MiniFlower,
  FlourishDivider,
} from "./CoverDecorations";

interface CoverContentProps {
  guestName: string;
  isOpening: boolean;
  onOpen: () => void;
}

const textLift = {
  textShadow:
    "0 1px 3px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.7)",
} as const;

const nameTextStyle = {
  overflowWrap: "normal",
  wordBreak: "keep-all",
  whiteSpace: "normal",
} as const;

// Titik sparkle di sekitar lingkar wreath, dihitung sebagai offset dari
// WREATH_HOLE center supaya ikut proporsional di semua breakpoint (wreath
// pakai clamp width, jadi posisi absolute biasa akan salah di ukuran lain).
// Radius dalam % dari lebar wreath container, sudut dalam derajat (0 = atas).
const wreathSparkles = [
  {
    angleDeg: -35,
    radiusPct: 46,
    size: "h-2.5 w-2.5",
    duration: 2.4,
    delay: 0,
  },
  { angleDeg: 100, radiusPct: 44, size: "h-2 w-2", duration: 2.8, delay: 0.9 },
  {
    angleDeg: 205,
    radiusPct: 47,
    size: "h-2.5 w-2.5",
    duration: 2.6,
    delay: 1.7,
  },
];

export const CoverContent = memo(function CoverContent({
  guestName,
  isOpening,
  onOpen,
}: CoverContentProps) {
  return (
    <>
      <m.span
        variants={fadeUp}
        className="relative inline-block overflow-hidden rounded-full border border-mustard/60 bg-ivory/95 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.22em] text-burgundy shadow-sm sm:px-5 sm:text-xs sm:tracking-[0.3em] md:px-6 md:text-[0.8rem]"
      >
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.8)]" />
        <m.div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: "500%" }}
          transition={{ duration: 1.1, delay: 0.6, ease: "easeInOut" }}
        />
        <span className="relative z-20">WEDDING INVITATION</span>
      </m.span>

      <m.div
        variants={wreathVariant}
        className="relative mt-4 w-[clamp(250px,92cqw,610px)] sm:mt-5 md:mt-6"
      >
        <WreathFrame className="w-full drop-shadow-sm" />

        {/* Sparkle mengitari lingkar wreath — posisi dihitung dari titik
            tengah wreath (WREATH_HOLE) dengan trigonometri sederhana, supaya
            tetap proporsional di semua ukuran layar (wreath pakai clamp()
            width, absolute px akan salah). */}
        {wreathSparkles.map((s, i) => {
          const rad = (s.angleDeg * Math.PI) / 180;
          const left = 50 + s.radiusPct * Math.sin(rad);
          const top = 50 - s.radiusPct * Math.cos(rad);
          return (
            <m.div
              key={i}
              className={`pointer-events-none absolute z-15 -translate-x-1/2 -translate-y-1/2 ${s.size}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.6, 1.2, 0.6],
              }}
              transition={loop(s.duration, s.delay + 1.2)}
            >
              <Sparkle className="h-full w-full opacity-90" />
            </m.div>
          );
        })}

        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
          style={{
            left: `${WREATH_HOLE.centerLeftPct}%`,
            top: `${WREATH_HOLE.centerTopPct}%`,
            width: `${WREATH_HOLE.widthPct - 34}%`,
          }}
        >
          <p
            className="w-full font-script font-semibold leading-[0.9] text-ink"
            style={{
              ...textLift,
              ...nameTextStyle,
              fontSize: "clamp(1.4rem, 5.9cqw, 2.6rem)",
            }}
          >
            Amelia
          </p>
          <m.div
            className="relative my-1"
            animate={{ scale: [1, 1.12, 1] }}
            transition={loop(2.8, 1.5)}
          >
            <p
              className="font-script font-semibold leading-none text-burgundy"
              style={{
                ...textLift,
                fontSize: "clamp(0.75rem, 2.7cqw, 1.25rem)",
              }}
            >
              &amp;
            </p>
            <div className="absolute -right-3 -top-1">
              <Sparkle className="h-2 w-2 opacity-70" />
            </div>
          </m.div>
          <p
            className="w-full font-script font-semibold leading-[0.9] text-ink"
            style={{
              ...textLift,
              ...nameTextStyle,
              fontSize: "clamp(1.3rem, 5.5cqw, 2.5rem)",
            }}
          >
            Alexander
          </p>
        </div>
      </m.div>

      <m.div
        variants={fadeUp}
        className="relative mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)] sm:mt-4 sm:gap-x-3 sm:px-5 md:mt-5 md:px-6 md:py-3.5"
      >
        <m.div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-mustard/60"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={loop(3.2, 1.8)}
        />
        <div className="shrink-0">
          <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <span className="text-[0.65rem] font-bold tracking-widest text-ink sm:text-xs sm:tracking-[0.15em] md:text-sm">
          SATURDAY
        </span>
        <span className="font-script text-2xl font-bold text-burgundy sm:text-3xl md:text-4xl">
          12
        </span>
        <span className="text-[0.65rem] font-bold tracking-widest text-ink sm:text-xs sm:tracking-[0.15em] md:text-sm">
          DECEMBER 2026
        </span>
        <div className="shrink-0">
          <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </m.div>

      <m.div
        variants={fadeUp}
        className="mt-5 w-28 xs:w-32 sm:mt-6 sm:w-40 md:w-44"
      >
        <FlourishDivider className="h-4 w-full" />
      </m.div>

      <m.div
        variants={fadeUp}
        className="relative mt-5 w-full overflow-hidden rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.05)] sm:mt-6 sm:px-5 md:px-6 md:py-5"
      >
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.7)]" />
        <m.div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
        />
        <div className="relative z-10">
          <p className="text-[0.7rem] font-semibold tracking-wider text-ink/80 sm:text-xs sm:tracking-[0.08em] md:text-sm">
            To Our Respected Guest,
          </p>
          <p className="mt-1.5 wrap-break-word text-base font-bold leading-snug text-ink xs:text-lg sm:text-xl md:text-2xl">
            {guestName}
          </p>
        </div>
      </m.div>

      {!isOpening && (
        <m.div
          variants={fadeUp}
          className="relative mt-8 inline-block sm:mt-10 md:mt-12"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-burgundy/50 blur-lg" />
          <m.button
            type="button"
            onClick={onOpen}
            className="relative min-h-12 rounded-full border border-mustard/60 bg-linear-to-r from-blush-dark via-burgundy to-blush-dark bg-size-[200%_100%] px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white shadow-lg xs:px-10 sm:px-12 sm:text-xs sm:tracking-[0.25em] md:px-14 md:py-4.5 md:text-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            OPEN INVITATION
          </m.button>
        </m.div>
      )}
    </>
  );
});
