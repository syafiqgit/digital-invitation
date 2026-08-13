"use client";

import { memo } from "react";
import Image from "next/image";
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
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";

interface CoupleSectionProps {
  groomName?: string;
  groomFullName?: string;
  groomParents?: string;
  brideName?: string;
  brideFullName?: string;
  brideParents?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
  openingAnimation?: boolean;
}

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

const GPU_HINT = { willChange: "transform, opacity" } as const;
const GPU_HINT_OPACITY = { willChange: "opacity" } as const;

const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({ duration, delay, repeat: Infinity, ease });

const makeSway = (
  magnitude: number,
  duration: number,
  origin: string,
  reverse = false,
) => ({
  rotate: reverse
    ? [0, -magnitude, 0, magnitude, 0]
    : [0, magnitude, 0, -magnitude, 0],
  origin,
  duration,
});

/* ---------- Framer Motion variants ---------- */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.35 },
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
  strong: {
    textShadow:
      "0 1px 4px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.85)",
  },
  soft: {
    textShadow:
      "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
  },
} as const;

/* ---------- Static decoration data (trimmed for performance) ---------- */

const scatterItems = [
  { top: "6%", left: "10%", type: "bloom", color: "var(--burgundy)" },
  { top: "5%", left: "90%", type: "leaf", rot: 25 },
  { top: "88%", left: "6%", type: "bloom", color: "var(--coral)" },
  { top: "88%", left: "94%", type: "bloom", color: "var(--blush-dark)" },
  { top: "34%", left: "3%", type: "bloom", color: "var(--sage-light)" },
  { top: "34%", left: "97%", type: "leaf", rot: -10 },
  { top: "60%", left: "4%", type: "leaf", rot: 15 },
  { top: "60%", left: "96%", type: "bloom", color: "var(--coral)" },
] as const;

const sparkles = [
  { top: "14%", left: "45%" },
  { top: "22%", left: "12%" },
  { top: "22%", left: "88%" },
  { top: "68%", left: "14%" },
  { top: "70%", left: "86%" },
].map((s) => ({ ...s, style: { top: s.top, left: s.left, ...GPU_HINT } }));

const floatingPetals = [
  {
    left: "18%",
    size: 11,
    duration: 13,
    delay: 1,
    color: "var(--coral)",
    blur: "blur-none",
    zIndex: "z-[4]",
  },
  {
    left: "70%",
    size: 10,
    duration: 15,
    delay: 4,
    color: "var(--sage-light)",
    blur: "blur-none",
    zIndex: "z-[4]",
  },
  {
    left: "45%",
    size: 12,
    duration: 12,
    delay: 6,
    color: "var(--burgundy)",
    blur: "blur-[1px]",
    zIndex: "z-[4]",
  },
  {
    left: "8%",
    size: 26,
    duration: 9,
    delay: 2,
    color: "var(--blush-dark)",
    blur: "blur-[4px]",
    zIndex: "z-[20]",
  },
  {
    left: "58%",
    size: 24,
    duration: 10,
    delay: 5.5,
    color: "var(--coral)",
    blur: "blur-[4px]",
    zIndex: "z-[20]",
  },
  {
    left: "92%",
    size: 28,
    duration: 11,
    delay: 3,
    color: "var(--burgundy)",
    blur: "blur-[5px]",
    zIndex: "z-[20]",
  },
].map((p) => ({
  ...p,
  style: { left: p.left, width: p.size, height: p.size, ...GPU_HINT },
}));

const goldDusts = [
  { left: "18%", bottom: "-4%", size: 5, duration: 14, delay: 0 },
  { left: "50%", bottom: "0%", size: 6, duration: 16, delay: 2.5 },
  { left: "82%", bottom: "-6%", size: 4, duration: 12, delay: 1 },
];

const butterflies = [
  { left: "12%", top: "20%", color: "var(--coral)", duration: 17, delay: 0 },
  { left: "84%", top: "24%", color: "var(--burgundy)", duration: 19, delay: 4 },
].map((b) => ({ ...b, style: { left: b.left, top: b.top, ...GPU_HINT } }));

const fireflies = [
  { left: "16%", bottom: "12%", duration: 7.5, delay: 0 },
  { left: "82%", bottom: "18%", duration: 8, delay: 1.5 },
  { left: "22%", bottom: "55%", duration: 8.5, delay: 3 },
  { left: "78%", bottom: "50%", duration: 7.5, delay: 2 },
].map((f) => ({
  ...f,
  style: { left: f.left, bottom: f.bottom, ...GPU_HINT },
}));

const fairyLights = [
  { cx: 40, cy: 34 },
  { cx: 110, cy: 14 },
  { cx: 200, cy: 24 },
  { cx: 290, cy: 14 },
  { cx: 360, cy: 34 },
] as const;

const cornerOrnaments = [
  {
    cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
    rotate: "",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.6, 0.4),
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(3.9, 0.9),
  },
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "rotate-90",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.3, 1.4),
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "-rotate-90",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(4.1, 0.2),
  },
];

const wreathBlooms = [
  { x: 40, y: 14, s: 1, color: "var(--burgundy)" },
  { x: 95, y: 6, s: 0.8, color: "var(--coral)" },
  { x: 150, y: 16, s: 0.9, color: "var(--blush-dark)" },
  { x: 205, y: 5, s: 0.75, color: "var(--coral)" },
  { x: 260, y: 15, s: 1, color: "var(--burgundy)" },
] as const;

const wreathLeaves = [
  { x: 65, y: 12, rot: -20 },
  { x: 120, y: 4, rot: 15 },
  { x: 178, y: 12, rot: -12 },
  { x: 232, y: 4, rot: 18 },
] as const;

const grassBlades = [
  { x: 10, h: 22, rot: -8 },
  { x: 24, h: 30, rot: 4 },
  { x: 40, h: 18, rot: -12 },
  { x: 58, h: 26, rot: 6 },
  { x: 76, h: 20, rot: -4 },
  { x: 94, h: 28, rot: 10 },
  { x: 300, h: 20, rot: -6 },
  { x: 318, h: 28, rot: 8 },
  { x: 336, h: 18, rot: -10 },
  { x: 354, h: 26, rot: 5 },
  { x: 372, h: 22, rot: -3 },
  { x: 390, h: 30, rot: 9 },
] as const;

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
    delay: 0,
    sway: makeSway(1.1, 7.4, "top center"),
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    sway: makeSway(1.1, 8, "top center", true),
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
    delay: 0.2,
    sway: makeSway(0.7, 8.6, "left center"),
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    sway: makeSway(0.7, 9.2, "left center", true),
  },
];

const vineTransitions = vines.map((v) => loop(v.sway.duration, v.delay + 0.5));

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: makeSway(1.8, 6.6, "top left"),
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: makeSway(1.8, 7.1, "top right", true),
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: makeSway(1.8, 6.9, "bottom left"),
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: makeSway(1.8, 7.4, "bottom right", true),
  },
];
const cornerTransitions = corners.map((c) =>
  loop(c.sway.duration, c.fadeDelay + 0.5),
);

/* ---------- Small presentational pieces ---------- */

const Monogram = memo(function Monogram({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush via-blush-dark/70 to-burgundy/55">
      <span className="font-script text-3xl text-white drop-shadow-md sm:text-4xl lg:text-6xl">
        {initial}
      </span>
    </div>
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
      <ellipse
        cx="94"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(-25 94 14)"
      />
      <ellipse
        cx="126"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(25 126 14)"
      />
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

const MiniLeaf = memo(function MiniLeaf({
  className = "",
  rot = 0,
}: {
  className?: string;
  rot?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="5.2"
        ry="9.5"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform={`rotate(${rot} 12 12)`}
      />
    </svg>
  );
});

const Sparkle = memo(function Sparkle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
});

const GoldDust = memo(function GoldDust({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-mustard to-yellow-200 ${className}`}
    />
  );
});

/* Static, non-animated ambient glow — replaces the previous continuously  */
/* rotating 600–800px conic-gradient, the biggest performance cost.        */
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10)_0%,transparent_70%)] blur-2xl lg:h-[620px] lg:w-[620px]"
    />
  );
});

const Butterfly = memo(function Butterfly({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 32 24" className={className} fill="none">
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="21"
        stroke="var(--ink)"
        strokeWidth="1.1"
        opacity="0.55"
      />
      <ellipse cx="8" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse cx="8.5" cy="16" rx="5.5" ry="4.5" fill={color} opacity="0.65" />
      <ellipse cx="24" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse
        cx="23.5"
        cy="16"
        rx="5.5"
        ry="4.5"
        fill={color}
        opacity="0.65"
      />
      <circle cx="8" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
      <circle cx="24" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
    </svg>
  );
});

const Firefly = memo(function Firefly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-full bg-mustard blur-[1.5px] ${className}`} />
  );
});

const GrassSilhouette = memo(function GrassSilhouette({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      {grassBlades.map((b, i) => (
        <path
          key={i}
          d={`M${b.x} 40 Q${b.x + 2} ${40 - b.h * 0.6} ${b.x + 4} ${40 - b.h}`}
          stroke="var(--sage)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          transform={`rotate(${b.rot} ${b.x} 40)`}
        />
      ))}
    </svg>
  );
});

const StaticWreathBand = memo(function StaticWreathBand({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 300 28"
      className={className}
      fill="none"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <line
        x1="0"
        y1="20"
        x2="300"
        y2="20"
        stroke="var(--sage)"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="1 5"
      />
      {wreathLeaves.map((l, i) => (
        <ellipse
          key={`wl-${i}`}
          cx={l.x}
          cy={l.y}
          rx="3.4"
          ry="6.4"
          fill="var(--sage-light)"
          stroke="var(--sage)"
          strokeWidth="0.5"
          opacity="0.75"
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
        />
      ))}
      {wreathBlooms.map((b, i) => (
        <g
          key={`wb-${i}`}
          transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}
        >
          {ANGLES_5.map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-5"
              rx="3.2"
              ry="6.2"
              fill={b.color}
              opacity="0.9"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2" fill="var(--mustard)" />
        </g>
      ))}
    </svg>
  );
});

/* ---------- Portrait block ---------- */

const ArchPortrait = memo(function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
}: {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
}) {
  return (
    <div className="relative flex w-full flex-col items-center text-center">
      <m.div
        animate={{ y: [-3, 3, -3] }}
        transition={loop(6, align === "left" ? 0 : 1)}
        className="relative w-full"
        style={GPU_HINT}
      >
        <div className="absolute -inset-[7px] rounded-t-[3.6rem] rounded-b-xl border-[1.5px] border-mustard shadow-[0_0_15px_rgba(212,175,55,0.3)] sm:-inset-2.5 sm:rounded-t-[4.3rem] lg:-inset-3 lg:rounded-t-[6.6rem] lg:rounded-b-3xl" />
        <div className="absolute -inset-[3px] rounded-t-[3.4rem] rounded-b-lg border border-mustard/70 sm:-inset-1 sm:rounded-t-[4rem] lg:-inset-1.5 lg:rounded-t-[6.3rem] lg:rounded-b-2xl" />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(58,54,48,0.4)] ring-1 ring-white/70 sm:rounded-t-[4.2rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/50 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>

        <div className="pointer-events-none absolute -bottom-[18%] left-1/2 z-20 w-[130%] -translate-x-1/2 sm:-bottom-[22%] lg:-bottom-[24%]">
          <Image
            src="/assets/garland.png"
            alt=""
            width={900}
            height={529}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <div
          className={`pointer-events-none absolute -top-2 z-30 h-5 w-5 opacity-90 sm:-top-3 sm:h-6 sm:w-6 lg:-top-4 lg:h-8 lg:w-8 ${
            align === "left" ? "-left-1 sm:-left-2" : "-right-1 sm:-right-2"
          }`}
        >
          <MiniLeaf
            rot={align === "left" ? -30 : 30}
            className="h-full w-full drop-shadow-sm"
          />
        </div>
      </m.div>

      <p
        className="font-script mt-12 text-2xl font-semibold leading-none text-balance break-words text-ink sm:mt-16 sm:text-4xl lg:mt-20 lg:text-5xl"
        style={textLift.strong}
      >
        {displayName}
      </p>
      <span className="mt-1.5 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-balance text-ink lg:mt-2 lg:text-[13px]"
        style={textLift.soft}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[11px] font-medium leading-relaxed text-balance text-ink/90 lg:mt-2.5 lg:text-[12px]"
        style={textLift.soft}
      >
        {align === "left" ? "Daughter of" : "Son of"}
        <br />
        {parents}
      </p>
    </div>
  );
});

/* ---------- Ambient decoration groups ---------- */
/* Heavy decorative particles only render from md breakpoint upward. */

const AmbientDecor = memo(function AmbientDecor() {
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
          <m.div
            key={`sparkle-${i}`}
            className="pointer-events-none absolute z-[1]"
            style={s.style}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.6, 1.2, 0.6] }}
            transition={loop(3 + (i % 3), i * 0.4)}
          >
            <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
          </m.div>
        ))}

        {floatingPetals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className={`pointer-events-none absolute top-[-10%] ${p.zIndex} ${p.blur}`}
            style={p.style}
            animate={{
              y: ["0vh", "115vh"],
              x: [0, p.size > 20 ? 40 : 16, -12, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={loop(p.duration, p.delay, "linear")}
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
          </m.div>
        ))}

        {goldDusts.map((g, i) => (
          <m.div
            key={`gd-${i}`}
            className="pointer-events-none absolute z-[15]"
            style={{
              left: g.left,
              bottom: g.bottom,
              width: g.size,
              height: g.size,
            }}
            animate={{
              y: ["0vh", "-105vh"],
              x: [0, 12, -8, 0],
              opacity: [0, 0.8, 0.4, 0],
            }}
            transition={loop(g.duration, g.delay, "linear")}
          >
            <GoldDust className="h-full w-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </m.div>
        ))}

        {butterflies.map((b, i) => (
          <m.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[2] h-4 w-5 lg:h-6 lg:w-8"
            style={b.style}
            animate={{
              x: [0, 32, -16, 40, 0],
              y: [0, -22, -6, -28, 0],
              rotate: [0, 6, -5, 4, 0],
            }}
            transition={loop(b.duration, b.delay)}
          >
            <Butterfly className="h-full w-full" color={b.color} />
          </m.div>
        ))}
      </div>

      <div className="contents">
        {fireflies.map((f, i) => (
          <m.div
            key={`firefly-${i}`}
            className="pointer-events-none absolute z-[1] h-1.5 w-1.5 lg:h-2 lg:w-2"
            style={f.style}
            animate={{
              y: [0, -55, -18, -80, 0],
              x: [0, 10, -6, 4, 0],
              opacity: [0, 0.9, 0.4, 0.9, 0],
            }}
            transition={loop(f.duration, f.delay)}
          >
            <Firefly className="h-full w-full" />
          </m.div>
        ))}
      </div>
    </>
  );
});

const FairyLights = memo(function FairyLights() {
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
          <m.circle
            cx={f.cx}
            cy={f.cy}
            r="2.6"
            fill="var(--mustard)"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={loop(2.4 + (i % 3) * 0.4, i * 0.3)}
            style={GPU_HINT_OPACITY}
          />
        </g>
      ))}
    </svg>
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v, i) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: v.delay }}
          className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
        >
          <m.div
            animate={{ rotate: v.sway.rotate }}
            transition={vineTransitions[i]}
            style={{ transformOrigin: v.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </m.div>
        </m.div>
      ))}

      {corners.map((c, i) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <m.div
            animate={{ rotate: c.sway.rotate }}
            transition={cornerTransitions[i]}
            style={{ transformOrigin: c.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
        >
          <m.div
            animate={c.pulse}
            transition={c.transition}
            style={GPU_HINT}
            className="h-full w-full"
          >
            <CornerFlourish className="h-full w-full" />
          </m.div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-6 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block sm:inset-8 lg:inset-12" />
    </>
  );
});

/* ---------- Main section ---------- */

function CoupleSectionInner({
  groomName = "Alexander",
  groomFullName = "Alexander",
  groomParents = "Mr. ... & Mrs. ...",
  brideName = "Amelia",
  brideFullName = "Amelia",
  brideParents = "Mr. ... & Mrs. ...",
  groomPhotoUrl = DEFAULT_GROOM_PHOTO,
  bridePhotoUrl = DEFAULT_BRIDE_PHOTO,
  openingAnimation = true,
}: CoupleSectionProps) {
  const initialState = openingAnimation ? "hidden" : "visible";

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>

      <m.div
        className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={loop(7.5)}
        style={GPU_HINT_OPACITY}
      />
      <m.div
        className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={loop(8.5, 1)}
        style={GPU_HINT_OPACITY}
      />

      <AmbientGlow />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-burgundy/40 opacity-[0.14] sm:block" />

      <FrameLayers />
      <AmbientDecor />
      <FairyLights />

      <div className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-6 w-full opacity-90 sm:block sm:h-8 lg:h-10">
        <GrassSilhouette className="h-full w-full" />
      </div>

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center xs:max-w-md sm:max-w-2xl md:max-w-3xl"
        initial={initialState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <m.div variants={fadeUp} style={GPU_HINT}>
              <StaticWreathBand className="mb-1 h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72" />
            </m.div>

            <m.div
              variants={fadeUp}
              style={GPU_HINT}
              className="flex items-center gap-2 sm:gap-3"
            >
              <m.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
                transition={loop(3.4, 0.4)}
                style={GPU_HINT}
              >
                <MiniBloom
                  className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                  color="var(--sage-light)"
                />
              </m.div>
              <span className="relative inline-block overflow-hidden rounded-full border border-mustard/60 bg-gradient-to-b from-ivory to-ivory/85 px-3.5 py-1 text-[9px] font-extrabold tracking-[0.3em] text-burgundy shadow-[0_2px_10px_rgba(58,54,48,0.08)] backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.34em]">
                THE BRIDE &amp; GROOM
              </span>
              <m.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
                transition={loop(3.7, 0.8)}
                style={GPU_HINT}
              >
                <MiniBloom
                  className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                  color="var(--sage-light)"
                />
              </m.div>
            </m.div>

            <m.p
              variants={fadeUp}
              className="font-script mt-3 max-w-[16rem] rounded-2xl bg-ivory/80 px-3 py-1.5 text-base font-semibold leading-snug text-ink backdrop-blur-[2px] xs:text-lg xs:max-w-[18rem] sm:mt-4 sm:max-w-md sm:text-2xl lg:mt-5 lg:text-3xl"
              style={{
                textShadow: "0 1px 6px rgba(255,255,255,0.9)",
                ...GPU_HINT,
              }}
            >
              With joyful hearts, we warmly invite you
            </m.p>

            <m.div variants={fadeUp} style={GPU_HINT}>
              <SprigDivider className="mt-2 h-4 w-28 xs:w-32 sm:mt-3 sm:w-40 lg:mt-4 lg:h-5 lg:w-44" />
            </m.div>
          </div>

          <div
            className="relative mt-5 flex w-full flex-row items-end justify-center gap-2 sm:mt-8 sm:gap-4 md:mt-10 lg:gap-6"
            style={{ paddingInline: "clamp(0.75rem, 6vw, 3rem)" }}
          >
            <m.div
              variants={slideFromLeft}
              style={GPU_HINT}
              className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={brideName}
                fullName={brideFullName}
                parents={brideParents}
                photoUrl={bridePhotoUrl}
                align="left"
              />
            </m.div>

            <m.div
              variants={popIn}
              style={GPU_HINT}
              className="relative z-20 mb-6 w-14 shrink-0 sm:mb-10 sm:w-24 lg:mb-12 lg:w-40"
            >
              <m.div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-xl"
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={loop(4.2, 0.6)}
                style={GPU_HINT_OPACITY}
              />

              <WreathFrame className="relative z-10 w-full" />

              <div
                className="absolute z-10 flex items-center justify-center"
                style={{
                  left: `${WREATH_HOLE.centerLeftPct}%`,
                  top: `${WREATH_HOLE.centerTopPct}%`,
                  width: `${WREATH_HOLE.widthPct - 20}%`,
                  height: `${WREATH_HOLE.heightPct - 20}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <m.div className="relative flex items-center justify-center">
                  <m.div
                    className="absolute -left-2 -top-2"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={loop(2.5, 0.2)}
                  >
                    <Sparkle className="h-2 w-2 opacity-80 sm:h-3 sm:w-3" />
                  </m.div>

                  <m.span
                    className="font-script block font-semibold leading-none text-burgundy text-sm sm:text-2xl lg:text-4xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={loop(2.6, 1)}
                    style={{
                      textShadow: "0 2px 10px rgba(255,255,255,0.8)",
                      ...GPU_HINT,
                    }}
                  >
                    &amp;
                  </m.span>

                  <m.div
                    className="absolute -bottom-1 -right-2"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={loop(3, 1.2)}
                  >
                    <Sparkle className="h-1.5 w-1.5 opacity-80 sm:h-2 sm:w-2" />
                  </m.div>
                </m.div>
              </div>
            </m.div>

            <m.div
              variants={slideFromRight}
              style={GPU_HINT}
              className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={groomName}
                fullName={groomFullName}
                parents={groomParents}
                photoUrl={groomPhotoUrl}
                align="right"
              />
            </m.div>
          </div>

          <m.div
            variants={fadeUp}
            style={GPU_HINT}
            className="mt-9 sm:mt-12 lg:mt-16"
          >
            <StaticWreathBand
              flip
              className="h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
            />
          </m.div>
        </div>
      </m.div>
    </section>
  );
}

export default function CoupleSection(props: CoupleSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoupleSectionInner {...props} />
    </LazyMotion>
  );
}
