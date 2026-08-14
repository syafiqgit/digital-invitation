"use client";

import { memo } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  type Transition,
  type Variants,
} from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface ClosingSectionProps {
  groomName?: string;
  brideName?: string;
  couplePhotoUrl?: string;
}

const DEFAULT_COUPLE_PHOTO = "https://picsum.photos/id/1025/800/1000";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GPU_HINT = { willChange: "transform, opacity" } as const;
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({ duration, delay, repeat: Infinity, ease });

/* ---------- Framer Motion variants (Entrance Only) ---------- */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

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

const textLift = {
  textShadow:
    "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data (Decluttered for 60fps performance) ---------- */

const vines = [
  // Instruksi: Animasi sway vine vertikal dikunci statis (isAnimated: false)
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "0.7deg",
    duration: "8.6s",
    delay: "0.2s",
    isAnimated: true,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "-0.7deg",
    duration: "9.2s",
    delay: "0.3s",
    isAnimated: true,
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
  },
];

/* ---------- Small Presentational Pieces ---------- */

const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.8"
            ry="7.2"
            fill={color}
            opacity="0.94"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.3" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

const CornerFlourish = memo(function CornerFlourish({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <path
        d="M4 4 C 4 24, 18 36, 40 38 C 48 39, 54 44, 56 52"
        stroke="var(--sage)"
        strokeWidth="1.1"
        fill="none"
        opacity="0.6"
      />
      <g transform="translate(10, 10)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.6"
            ry="7"
            fill="var(--blush-dark)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.2" fill="var(--mustard)" />
      </g>
      <ellipse
        cx="28"
        cy="30"
        rx="3"
        ry="6"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(30 28 30)"
      />
    </svg>
  );
});

const SprigDivider = memo(function SprigDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 220 28" className={className} fill="none">
      <line
        x1="0"
        y1="14"
        x2="86"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="134"
        y1="14"
        x2="220"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(110, 14)">
        {ANGLES_6.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.6"
            ry="7"
            fill="var(--coral)"
            opacity="0.92"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.4" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

/* Statis menggantikan MajesticRay untuk menghemat resource GPU mid-range */
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-2xl lg:h-[620px] lg:w-[620px]"
    />
  );
});

/* ---------- Frame Layers (Optimized with CSS Keyframes) ---------- */

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(var(--end-deg, 2deg)) translate3d(0,0,0); }
        }
        .animate-sway { animation: sway ease-in-out infinite; }
        
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg) translate3d(0,0,0); }
          50% { transform: scale(1.1) rotate(var(--rot, 5deg)) translate3d(0,0,0); }
        }
        .animate-gentle-pulse { animation: gentle-pulse ease-in-out infinite; }
      `}</style>

      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
        >
          {/* Hardware-accelerated CSS Animation. Sesuai instruksi: vine kiri & kanan statis (isAnimated: false) */}
          <div
            className={`h-full w-full ${v.isAnimated ? "animate-sway" : ""}`}
            style={
              v.isAnimated
                ? ({
                    transformOrigin: v.origin,
                    "--end-deg": v.endDeg,
                    animationDuration: v.duration,
                    animationDelay: v.delay,
                    willChange: "transform",
                  } as React.CSSProperties)
                : undefined
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.fadeDelay ? `${c.fadeDelay}s` : "0s",
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[1.8rem] border border-mustard/10 sm:inset-6 lg:inset-10" />
    </>
  );
});

/* ---------- Main Component ---------- */

function ClosingSectionInner({
  groomName = "Alexander",
  brideName = "Amelia",
  couplePhotoUrl = DEFAULT_COUPLE_PHOTO,
}: ClosingSectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 xs:px-5 sm:px-8 sm:py-24 md:py-28 text-center">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <AmbientGlow />
      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-1 xs:max-w-md sm:max-w-xl sm:px-2 md:max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Badge */}
        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="flex items-center gap-3"
        >
          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "6deg",
                animationDuration: "3.4s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>

          <span className="inline-block rounded-full border border-mustard/40 bg-white/80 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy shadow-sm backdrop-blur-sm sm:text-xs">
            THANK YOU
          </span>

          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "-6deg",
                animationDuration: "3.7s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>
        </m.div>

        {/* Heading */}
        <m.p
          variants={fadeUp}
          className="font-script mt-5 px-2 text-[2.1rem] leading-tight font-semibold text-ink xs:text-4xl sm:mt-6 sm:text-5xl md:text-[3.4rem]"
          style={{ ...textLift, ...GPU_HINT }}
        >
          It Is an Honor
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mt-3 mb-7 sm:mt-4 sm:mb-9"
        >
          <SprigDivider className="h-3 w-32 xs:w-40 sm:w-48 opacity-70" />
        </m.div>

        {/* Gorgeous Arch Photo Showcase */}
        <m.div variants={fadeUp} className="relative mb-7 sm:mb-9">
          <div className="pointer-events-none absolute -inset-3 rounded-t-[11rem] rounded-b-[2.2rem] bg-gradient-to-b from-mustard/20 via-transparent to-blush/20 blur-xl sm:-inset-4" />
          <div className="relative aspect-[4/5] w-44 overflow-hidden rounded-t-[9rem] rounded-b-3xl border-[3px] border-mustard/60 bg-white/90 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.06)] xs:w-52 sm:w-60 md:w-64">
            <div className="absolute inset-[6px] rounded-t-[8.4rem] rounded-b-[1.4rem] border border-mustard/30 pointer-events-none z-10" />
            <div className="relative h-full w-full overflow-hidden rounded-t-[8.6rem] rounded-b-2xl bg-gray-100">
              {/* UI Fix: loading="lazy" & ukuran srcset teroptimasi untuk performa aset */}
              <img
                src={couplePhotoUrl}
                alt="Couple"
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent" />
            </div>
          </div>
        </m.div>

        {/* Message (UI Fix: Font minimal 16px / text-base pada breakpoint yang sesuai untuk readability mobile) */}
        <m.p
          variants={fadeUp}
          className="mx-auto mb-8 max-w-xs px-1 text-sm leading-relaxed text-ink/80 xs:max-w-sm sm:mb-10 sm:max-w-md sm:text-base"
        >
          It is an honor and a joy for us if you would grace us with your
          presence and bestow your blessings upon the newlyweds.
        </m.p>

        {/* Names Card */}
        <m.div
          variants={fadeUp}
          className="relative w-full max-w-sm rounded-[1.75rem] border border-mustard/30 bg-white/85 px-6 py-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden backdrop-blur-md sm:max-w-md sm:rounded-[2rem] sm:px-10 sm:py-12"
        >
          <div className="absolute inset-[10px] rounded-[1.4rem] border border-mustard/20 pointer-events-none sm:inset-[14px] sm:rounded-[1.6rem]" />

          <CornerFlourish className="pointer-events-none absolute left-2 top-2 h-8 w-8 opacity-60 sm:left-3 sm:top-3 sm:h-10 sm:w-10" />
          <CornerFlourish className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 rotate-180 opacity-60 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10" />

          <p
            className="font-script text-3xl font-semibold text-ink sm:text-[2.7rem]"
            style={textLift}
          >
            {brideName}
          </p>
          <div className="my-2 flex items-center justify-center gap-3 sm:my-3">
            <span className="h-px w-8 bg-sage/40 sm:w-12" />
            <span className="font-script text-xl text-burgundy sm:text-2xl">
              &amp;
            </span>
            <span className="h-px w-8 bg-sage/40 sm:w-12" />
          </div>
          <p
            className="font-script text-3xl font-semibold text-ink sm:text-[2.7rem]"
            style={textLift}
          >
            {groomName}
          </p>
        </m.div>

        {/* Footer */}
        <m.div
          variants={fadeUp}
          className="mt-9 flex items-center gap-3 text-[10px] tracking-widest text-ink/50 uppercase sm:mt-12 sm:text-xs"
        >
          <span className="h-px w-5 bg-ink/20 sm:w-8" />
          <span>&copy; 2026 Wedding Garden Invitation</span>
          <span className="h-px w-5 bg-ink/20 sm:w-8" />
        </m.div>
      </m.div>
    </section>
  );
}

export default function ClosingSection(props: ClosingSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <ClosingSectionInner {...props} />
    </LazyMotion>
  );
}
