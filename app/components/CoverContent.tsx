"use client";

import { memo } from "react";
import { m } from "framer-motion";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";
import {
  fadeUp,
  wreathVariant,
  loop,
  MiniFlower,
  FlourishDivider,
  Sparkle,
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
  wordBreak: "normal",
  whiteSpace: "nowrap",
} as const;

export const CoverContent = memo(function CoverContent({
  guestName,
  isOpening,
  onOpen,
}: CoverContentProps) {
  return (
    <>
      <m.span
        variants={fadeUp}
        className="relative inline-block overflow-hidden rounded-full border border-mustard/60 bg-ivory/95 px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.22em] text-burgundy shadow-sm sm:px-5 sm:text-xs sm:tracking-[0.3em]"
      >
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.8)]" />
        <span className="relative z-10">WEDDING INVITATION</span>
      </m.span>

      <m.div
        variants={wreathVariant}
        className="relative mt-4 w-[clamp(250px,92cqw,610px)] sm:mt-5"
      >
        <WreathFrame className="w-full drop-shadow-sm" />
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
            animate={{ scale: [1, 1.15, 1] }}
            transition={loop(2.6, 1.5)}
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
        className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)] sm:mt-4 sm:gap-x-3 sm:px-5"
      >
        <m.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
          transition={loop(3.4, 1.2)}
          className="shrink-0"
        >
          <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
        </m.div>
        <span className="text-[0.62rem] font-bold tracking-widest text-ink sm:text-xs sm:tracking-[0.15em]">
          SATURDAY
        </span>
        <span className="font-script text-2xl font-bold text-burgundy sm:text-3xl">
          12
        </span>
        <span className="text-[0.62rem] font-bold tracking-widest text-ink sm:text-xs sm:tracking-[0.15em]">
          DECEMBER 2026
        </span>
        <m.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
          transition={loop(3.7, 1.6)}
          className="shrink-0"
        >
          <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
        </m.div>
      </m.div>

      <m.div variants={fadeUp} className="mt-5 w-28 xs:w-32 sm:mt-6 sm:w-40">
        <FlourishDivider className="h-4 w-full" />
      </m.div>

      <m.div
        variants={fadeUp}
        className="relative mt-5 w-full rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.05)] sm:mt-6 sm:px-5"
      >
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.7)]" />
        <div className="relative z-10">
          <p className="text-[0.68rem] font-semibold tracking-wider text-ink/80 sm:text-xs sm:tracking-[0.08em]">
            To Our Respected Guest,
          </p>
          <p className="mt-1.5 wrap-break-word text-base font-bold leading-snug text-ink xs:text-lg sm:text-xl">
            {guestName}
          </p>
        </div>
      </m.div>

      {!isOpening && (
        <m.div
          variants={fadeUp}
          className="relative mt-8 inline-block sm:mt-10"
        >
          <m.div
            className="pointer-events-none absolute inset-0 rounded-full bg-burgundy/60 blur-xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={loop(2.4, 1)}
          />
          <m.button
            type="button"
            onClick={onOpen}
            className="relative min-h-12 rounded-full border border-mustard/60 bg-linear-to-r from-blush-dark via-burgundy to-blush-dark bg-size-[200%_100%] px-8 py-4 text-[0.62rem] font-bold tracking-[0.18em] text-white shadow-lg xs:px-10 sm:px-12 sm:text-xs sm:tracking-[0.25em]"
            whileHover={{ scale: 1.06, backgroundPosition: "100% 0" }}
            whileTap={{ scale: 0.96 }}
          >
            OPEN INVITATION
          </m.button>
        </m.div>
      )}
    </>
  );
});
