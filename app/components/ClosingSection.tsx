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
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
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

/* ---------- Static decoration data ---------- */

const scatterItems = [
  { top: "10%", left: "10%", type: "bloom", color: "var(--burgundy)" },
  { top: "22%", left: "88%", type: "leaf", rot: 25 },
  { top: "45%", left: "6%", type: "bloom", color: "var(--coral)" },
  { top: "68%", left: "92%", type: "bloom", color: "var(--blush-dark)" },
  { top: "88%", left: "10%", type: "leaf", rot: -30 },
] as const;

const sparkles = [
  { top: "15%", left: "20%" },
  { top: "35%", left: "82%" },
  { top: "65%", left: "15%" },
  { top: "85%", left: "80%" },
].map((s) => ({ ...s, style: { top: s.top, left: s.left, ...GPU_HINT } }));

const fireflies = [
  { left: "20%", bottom: "15%", duration: 7, delay: 0 },
  { left: "80%", bottom: "28%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "60%", duration: 7.5, delay: 3 },
  { left: "85%", bottom: "50%", duration: 9, delay: 2 },
].map((f) => ({
  ...f,
  style: { left: f.left, bottom: f.bottom, ...GPU_HINT },
}));

const petals = [
  { left: "10%", size: 6, duration: 12, delay: 1, color: "var(--sage-light)" },
  {
    left: "55%",
    size: 7,
    duration: 10.5,
    delay: 4,
    color: "var(--blush-dark)",
  },
  { left: "90%", size: 6, duration: 13, delay: 2, color: "var(--coral)" },
].map((p) => ({
  ...p,
  style: { left: p.left, width: p.size, height: p.size, ...GPU_HINT },
}));

const butterflies = [
  { left: "12%", top: "30%", color: "var(--coral)", duration: 15, delay: 0 },
  {
    left: "82%",
    top: "70%",
    color: "var(--burgundy)",
    duration: 17,
    delay: 2.5,
  },
].map((b) => ({ ...b, style: { left: b.left, top: b.top, ...GPU_HINT } }));

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

const Firefly = memo(function Firefly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-full bg-mustard blur-[1.5px] ${className}`} />
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

/* ---------- Ambient Decor & Frames ---------- */

const AmbientDecor = memo(function AmbientDecor() {
  return (
    <>
      <div className="hidden sm:contents">
        {scatterItems.map((item, i) => (
          <div
            key={`scatter-${i}`}
            style={{ top: item.top, left: item.left }}
            className="pointer-events-none absolute z-[1]"
          >
            {item.type === "bloom" ? (
              <MiniBloom className="opacity-80" color={item.color} />
            ) : (
              <MiniLeaf className="opacity-70" rot={item.rot} />
            )}
          </div>
        ))}

        {sparkles.map((s, i) => (
          <m.div
            key={`sparkle-${i}`}
            className="pointer-events-none absolute z-[1]"
            style={s.style}
            animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.6, 1.1, 0.6] }}
            transition={loop(3 + (i % 3), i * 0.4)}
          >
            <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
          </m.div>
        ))}

        {petals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-5%] z-[1]"
            style={p.style}
            animate={{
              y: ["0vh", "108vh"],
              x: [0, -14, 10, 0],
              rotate: [0, -180, -360],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={loop(p.duration, p.delay, "linear")}
          >
            <svg viewBox="0 0 20 20" fill="none">
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="9"
                fill={p.color}
                opacity="0.7"
              />
            </svg>
          </m.div>
        ))}

        {butterflies.map((b, i) => (
          <m.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[2] h-5 w-6 lg:h-7 lg:w-9"
            style={b.style}
            animate={{
              x: [0, 25, -15, 35, 0],
              y: [0, -18, -5, -25, 0],
              rotate: [0, 5, -4, 4, 0],
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
              y: [0, -60, -20, -90, 0],
              x: [0, 12, -8, 6, 0],
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
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
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
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-8 sm:py-24 md:py-28 text-center">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <m.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/40 blur-[100px] xs:h-80 xs:w-80 sm:h-[26rem] sm:w-[26rem] sm:blur-[140px]"
        style={GPU_HINT}
      />

      <FrameLayers />
      <AmbientDecor />

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
          className="flex items-center gap-2 sm:gap-3"
        >
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
            transition={loop(3.4, 0.4)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
          <span className="inline-block rounded-full border border-mustard/50 bg-gradient-to-b from-ivory to-ivory/80 px-3.5 py-1 text-[9px] font-extrabold tracking-[0.3em] text-burgundy shadow-[0_2px_10px_rgba(58,54,48,0.08)] backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.34em]">
            THANK YOU
          </span>
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
            transition={loop(3.7, 0.8)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
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
          <SprigDivider className="h-4 w-32 xs:w-40 sm:w-48" />
        </m.div>

        {/* Gorgeous Arch Photo Showcase */}
        <m.div variants={fadeUp} className="relative mb-7 sm:mb-9">
          <div className="pointer-events-none absolute -inset-3 rounded-t-[11rem] rounded-b-[2.2rem] bg-gradient-to-b from-mustard/25 via-transparent to-blush/25 blur-xl sm:-inset-4" />
          <m.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(212,175,55,0.0)",
                "0 0 0 6px rgba(212,175,55,0.12)",
                "0 0 0 0 rgba(212,175,55,0.0)",
              ],
            }}
            transition={loop(4.5, 0.5)}
            className="relative aspect-[4/5] w-44 overflow-hidden rounded-t-[9rem] rounded-b-3xl border-[3px] border-mustard/70 bg-gradient-to-b from-ivory to-ivory/90 p-2 shadow-[0_18px_48px_rgba(58,54,48,0.18)] xs:w-52 sm:w-60 md:w-64"
          >
            <div className="absolute inset-[6px] rounded-t-[8.4rem] rounded-b-[1.4rem] border border-mustard/30 pointer-events-none z-10" />
            <div className="absolute inset-0 rounded-t-[9rem] rounded-b-3xl shadow-[inset_0_0_24px_rgba(255,255,255,0.85)] pointer-events-none z-10" />
            <div className="relative h-full w-full overflow-hidden rounded-t-[8.6rem] rounded-b-2xl">
              <img
                src={couplePhotoUrl}
                alt="Couple"
                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.08]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/10 via-transparent to-transparent" />
            </div>
          </m.div>
        </m.div>

        {/* Message */}
        <m.p
          variants={fadeUp}
          className="mx-auto mb-8 max-w-xs px-1 text-[13px] leading-relaxed text-ink/80 xs:max-w-sm sm:mb-10 sm:max-w-md sm:text-[15px]"
        >
          It is an honor and a joy for us if you would grace us with your
          presence and bestow your blessings upon the newlyweds.
        </m.p>

        {/* Names Card */}
        <m.div
          variants={fadeUp}
          className="relative w-full max-w-sm rounded-[1.75rem] border border-mustard/50 bg-gradient-to-b from-ivory/98 to-ivory/90 px-6 py-9 shadow-[0_20px_55px_rgba(58,54,48,0.14)] overflow-hidden sm:max-w-md sm:rounded-[2rem] sm:px-10 sm:py-12"
        >
          <div className="absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_24px_rgba(255,255,255,0.85)] pointer-events-none sm:rounded-[2rem]" />
          <div className="absolute inset-[10px] rounded-[1.4rem] border border-mustard/25 pointer-events-none sm:inset-[14px] sm:rounded-[1.6rem]" />

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
          className="mt-9 flex items-center gap-3 text-[9px] tracking-[0.22em] text-ink/50 uppercase sm:mt-12 sm:text-[10px]"
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
