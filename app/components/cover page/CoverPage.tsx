"use client";

import { memo, useCallback, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  type Transition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "../BackgroundPattern";
import FloralCorner from "../FloralCorner";
import FloralVine from "../FloralVine";
import WreathFrame, { WREATH_HOLE } from "../WreathFrame";
import FloatingDecorations from "../FloatingDecorations";

/* -------------------------------------------------------------------------- */
/*                                TYPES & UTILS                               */
/* -------------------------------------------------------------------------- */
interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

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

/* -------------------------------------------------------------------------- */
/*                           MOTION VARIANTS (STATIC)                         */
/* -------------------------------------------------------------------------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.2 },
  },
};

const borderFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.3 },
  },
};

const glowVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.1 },
  },
};

const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -2 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 22 },
  },
};

/* -------------------------------------------------------------------------- */
/*                           PRE-CALCULATED DATA                              */
/* -------------------------------------------------------------------------- */
const textLift = {
  textShadow:
    "0 1px 3px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.7)",
} as const;

const nameTextStyle = {
  overflowWrap: "normal",
  wordBreak: "keep-all",
  whiteSpace: "normal",
} as const;

const wreathSparkles = [
  {
    left: "23.62%",
    top: "12.32%",
    size: "h-2.5 w-2.5",
    duration: 2.4,
    delay: 0,
  },
  { left: "93.33%", top: "57.64%", size: "h-2 w-2", duration: 2.8, delay: 0.9 },
  {
    left: "30.14%",
    top: "92.59%",
    size: "h-2.5 w-2.5",
    duration: 2.6,
    delay: 1.7,
  },
];

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    swayOrigin: "top",
    swayRange: 1.2,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className:
      "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    swayOrigin: "top",
    swayRange: 1.2,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className:
      "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "",
    swayOrigin: "left",
    swayRange: 1,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className:
      "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    swayOrigin: "left",
    swayRange: 1,
  },
];

const corners = [
  {
    key: "bl",
    position: "bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4",
    flip: "",
    fadeDelay: 0,
    swayOrigin: "bottom left",
  },
  {
    key: "br",
    position: "bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.05,
    swayOrigin: "bottom right",
  },
  {
    key: "tl",
    position: "top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.1,
    swayOrigin: "top left",
  },
  {
    key: "tr",
    position: "top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.15,
    swayOrigin: "top right",
  },
];

/* -------------------------------------------------------------------------- */
/*                                SVG COMPONENTS                              */
/* -------------------------------------------------------------------------- */
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

const MiniFlower = memo(({ className = "" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 40 40" className={className} fill="none">
    <g transform="translate(20, 20)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-8"
          rx="5"
          ry="9"
          fill="var(--blush-dark)"
          opacity="0.9"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="3" fill="var(--mustard)" />
    </g>
  </svg>
));
MiniFlower.displayName = "MiniFlower";

const FlourishDivider = memo(({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 200 24"
    className={className}
    fill="none"
  >
    <line
      x1="0"
      y1="12"
      x2="80"
      y2="12"
      stroke="var(--sage)"
      strokeWidth="0.8"
      opacity="0.5"
    />
    <line
      x1="120"
      y1="12"
      x2="200"
      y2="12"
      stroke="var(--sage)"
      strokeWidth="0.8"
      opacity="0.5"
    />
    <g transform="translate(100, 12)">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-5"
          rx="3.2"
          ry="6"
          fill="var(--coral)"
          opacity="0.9"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="2" fill="var(--mustard)" />
    </g>
  </svg>
));
FlourishDivider.displayName = "FlourishDivider";

/* -------------------------------------------------------------------------- */
/*                        ISOLATED CINEMATIC SPLASH                           */
/* -------------------------------------------------------------------------- */
const CinematicSplash = memo(({ onComplete }: { onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration && v.duration - v.currentTime <= 0.4) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <m.div
      key="cinematic-splash"
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-[100] bg-ivory"
    >
      <video
        ref={videoRef}
        src="/assets/Burgundy_roses_blooming_intro.webm"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        onTimeUpdate={handleTimeUpdate}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={onComplete}
        aria-label="Skip cinematic introduction"
        className="absolute right-5 top-5 z-[110] rounded-full bg-ink/20 px-4 py-1.5 text-[0.65rem] font-bold tracking-widest text-white backdrop-blur-md transition-colors hover:bg-ink/40 sm:text-xs"
      >
        SKIP
      </button>
    </m.div>
  );
});
CinematicSplash.displayName = "CinematicSplash";

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
function CoverPageInner({ guestName = "Dear Guest", onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  const handleVideoComplete = useCallback(() => {
    setShowVideo(false);
  }, []);

  return (
    <m.div
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        willChange: "opacity",
      }}
    >
      {/* 1. BACKGROUND */}
      <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.035]"
      >
        <span className="font-script text-[16rem] leading-none text-ink sm:text-[19rem] md:text-[22rem]">
          A
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
        <Image
          src="/assets/garden-scatter-bg.webp"
          alt="Background Garden"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="pointer-events-none object-cover"
          style={{ filter: "saturate(1.15) contrast(1.06)" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-3 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_72%)] blur-2xl sm:h-90 sm:w-90 md:h-105 md:w-105"
      />

      {/* 2. ORNAMENTS & DECORATIONS */}
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-3 z-2 rounded-2xl border border-mustard/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] sm:inset-5 md:inset-6"
      />
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="pointer-events-none absolute inset-5 z-2 hidden rounded-[1.4rem] border border-dashed border-mustard/20 sm:block sm:inset-7 md:inset-8"
      />
      <m.div
        variants={glowVariant}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute left-1/2 top-1/2 z-2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl xs:h-64 xs:w-64 sm:h-72 sm:w-72 md:h-88 md:w-88 lg:h-104 lg:w-104"
      >
        <div className="h-full w-full rounded-full bg-blush/40" />
      </m.div>

      {vines.map((v, i) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          animate="show"
          className={`pointer-events-none z-2 ${v.className} ${v.flip}`}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: v.swayOrigin }}
            animate={{ rotate: [0, v.swayRange, 0, -v.swayRange, 0] }}
            transition={loop(7 + i * 0.6, i * 0.4)}
          >
            <FloralVine
              orientation={v.orientation}
              className="h-full w-full"
              tileSize={360}
            />
          </m.div>
        </m.div>
      ))}

      {corners.map((c) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          animate="show"
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 ${c.position}`}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: c.swayOrigin }}
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={loop(6, c.fadeDelay * 2)}
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {/* COMPONENT ANIMASI EKSTERNAL */}
      <FloatingDecorations />

      {/* 3. MAIN CONTENT CONTAINER */}
      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ containerType: "inline-size" }}
        className="relative z-20 flex w-full max-w-xs flex-col items-center px-5 text-center xs:max-w-sm sm:max-w-md sm:px-8 md:max-w-lg md:px-10 lg:max-w-160"
      >
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

          {wreathSparkles.map((s, i) => (
            <m.div
              key={`ws-${i}`}
              className={`pointer-events-none absolute z-15 -translate-x-1/2 -translate-y-1/2 ${s.size}`}
              style={{ left: s.left, top: s.top }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
              transition={loop(s.duration, s.delay + 1.2)}
            >
              <Sparkle className="h-full w-full opacity-90" />
            </m.div>
          ))}

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
          className="relative mt-5 w-full overflow-hidden rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:mt-6 sm:px-5 md:px-6 md:py-6"
        >
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.7)]" />
          <m.div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            {/* Label dibuat sedikit lebih redup (text-ink/70) agar kontras dengan nama */}
            <p className="text-[0.7rem] font-medium tracking-widest text-ink/70 sm:text-xs sm:tracking-[0.1em] md:text-sm">
              To Our Respected Guest,
            </p>
            {/* Nama tamu diperbesar, ditebalkan, diubah warna burgundy, dan diberi shadow */}
            <p className="mt-2 wrap-break-word text-xl font-extrabold leading-snug text-burgundy drop-shadow-sm xs:text-2xl sm:text-3xl md:text-4xl">
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
              onClick={handleOpen}
              className="relative min-h-12 rounded-full border border-mustard/60 bg-linear-to-r from-blush-dark via-burgundy to-blush-dark bg-size-[200%_100%] px-8 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white shadow-lg xs:px-10 sm:px-12 sm:text-xs sm:tracking-[0.25em] md:px-14 md:py-4.5 md:text-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              OPEN INVITATION
            </m.button>
          </m.div>
        )}
      </m.div>

      {/* 4. CINEMATIC SPLASH / INTRO VIDEO */}
      <AnimatePresence>
        {showVideo && <CinematicSplash onComplete={handleVideoComplete} />}
      </AnimatePresence>
    </m.div>
  );
}

export default function CoverPage(props: CoverPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoverPageInner {...props} />
    </LazyMotion>
  );
}
