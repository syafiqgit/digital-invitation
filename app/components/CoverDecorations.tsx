"use client";

import { memo } from "react";
import { m, type Transition, type Variants } from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

export const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease,
});

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

/* ---------- VARIANTS ---------- */
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.3 },
  },
};

const borderFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.4 },
  },
};

const glowVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.5, ease: "easeOut", delay: 0.2 },
  },
};

export const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -4 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* ---------- DATA STATIS ---------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "",
    sway: makeSway(1.4, 7, "top center"),
    transition: loop(7, 0.6),
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "-scale-x-100",
    sway: makeSway(1.4, 7.6, "top center", true),
    transition: loop(7.6, 0.7),
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "",
    sway: makeSway(0.9, 8.2, "left center"),
    transition: loop(8.2, 0.8),
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "-scale-y-100",
    sway: makeSway(0.9, 8.8, "left center", true),
    transition: loop(8.8, 0.9),
  },
];

const corners = [
  {
    key: "bl",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: makeSway(2.2, 6.5, "bottom left"),
    transition: loop(6.5, 0.6),
  },
  {
    key: "br",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: makeSway(2.2, 7, "bottom right", true),
    transition: loop(7, 0.7),
  },
  {
    key: "tl",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: makeSway(2.2, 6.8, "top left"),
    transition: loop(6.8, 0.8),
  },
  {
    key: "tr",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: makeSway(2.2, 7.3, "top right", true),
    transition: loop(7.3, 0.9),
  },
];

const petals = [
  {
    left: "12%",
    size: 12,
    duration: 16,
    delay: 0,
    color: "var(--blush-dark)",
    blur: "blur-[2px]",
    zIndex: "z-[5]",
  },
  {
    left: "75%",
    size: 14,
    duration: 14,
    delay: 1,
    color: "var(--coral)",
    blur: "blur-[2px]",
    zIndex: "z-[5]",
  },
  {
    left: "25%",
    size: 18,
    duration: 12,
    delay: 2,
    color: "var(--coral)",
    blur: "blur-none",
    zIndex: "z-[10]",
  },
  {
    left: "88%",
    size: 20,
    duration: 11,
    delay: 0.5,
    color: "var(--blush-dark)",
    blur: "blur-none",
    zIndex: "z-[10]",
  },
  {
    left: "50%",
    size: 40,
    duration: 9,
    delay: 3,
    color: "var(--burgundy)",
    blur: "blur-[6px]",
    zIndex: "z-[40]",
  },
];

const sparkles = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "12%" },
  { top: "88%", left: "82%" },
];

const fireflies = [
  { left: "20%", bottom: "10%", duration: 7, delay: 0 },
  { left: "80%", bottom: "25%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "60%", duration: 8, delay: 3 },
  { left: "85%", bottom: "50%", duration: 9, delay: 2 },
];

const goldDusts = [
  { left: "15%", bottom: "-10%", size: 4, duration: 13, delay: 0 },
  { left: "50%", bottom: "-5%", size: 6, duration: 15, delay: 2 },
  { left: "82%", bottom: "-12%", size: 5, duration: 14, delay: 3.5 },
];

const butterflies = [
  {
    top: "22%",
    left: "6%",
    size: 20,
    duration: 15,
    delay: 0,
    color: "var(--blush-dark)",
    path: [0, 40, 10, 55, 0],
    yPath: [0, -25, 10, -15, 0],
  },
  {
    top: "68%",
    left: "88%",
    size: 18,
    duration: 17,
    delay: 3,
    color: "var(--coral)",
    path: [0, -35, -8, -45, 0],
    yPath: [0, 20, -15, 15, 0],
  },
];

const cornerOrnaments = [
  {
    cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
    rotate: "-scale-y-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.6, 0.4),
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "-scale-x-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(3.9, 0.9),
  },
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "-scale-x-100 -scale-y-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.3, 1.4),
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(4.1, 0.2),
  },
];

/* ---------- SVGs (Shared) ---------- */
export const Sparkle = memo(({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
  </svg>
));

export const MiniFlower = memo(({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
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

export const FlourishDivider = memo(
  ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 200 24" className={className} fill="none">
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
  ),
);

/* ---------- EXPORTED COMPOSITIONS ---------- */
export const CoverBackground = memo(function CoverBackground() {
  return (
    <>
      <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.035]"
      >
        <span className="font-script text-[16rem] leading-none text-ink sm:text-[22rem]">
          A
        </span>
      </div>
      <m.div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        animate={{ scale: [1, 1.04, 1] }}
        transition={loop(40)}
      >
        <Image
          src="/assets/garden-scatter-bg.webp"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="pointer-events-none object-cover"
          style={{ filter: "saturate(1.15) contrast(1.06)" }}
        />
      </m.div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_72%)] blur-2xl sm:h-[420px] sm:w-[420px]"
      />
    </>
  );
});

export const CoverOrnaments = memo(function CoverOrnaments() {
  return (
    <>
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-3 z-[2] rounded-2xl border border-mustard/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] sm:inset-6"
      />
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15 }}
        className="pointer-events-none absolute inset-5 z-[2] hidden rounded-[1.4rem] border border-dashed border-mustard/20 sm:block sm:inset-8"
      />
      <m.div
        variants={glowVariant}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl xs:h-64 xs:w-64 sm:h-72 sm:w-72 lg:h-[26rem] lg:w-[26rem]"
      >
        <m.div
          className="h-full w-full rounded-full bg-blush/40"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={loop(5, 1.7)}
        />
      </m.div>

      {vines.map((v) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          animate="show"
          className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
        >
          <m.div
            animate={{ rotate: v.sway.rotate }}
            transition={v.transition}
            style={{ transformOrigin: v.sway.origin }}
            className="h-full w-full"
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
          className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-36 sm:w-36 lg:h-48 lg:w-48 ${c.position}`}
        >
          <m.div
            animate={{ rotate: c.sway.rotate }}
            transition={c.transition}
            style={{ transformOrigin: c.sway.origin }}
            className="h-full w-full"
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[15] h-14 w-14 opacity-90 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${c.cls} ${c.rotate}`}
        >
          <m.div
            animate={c.pulse}
            transition={c.transition}
            className="h-full w-full"
          >
            <svg viewBox="0 0 60 60" className="h-full w-full" fill="none">
              <path
                d="M4 4 C 4 24, 18 36, 40 38 C 48 39, 54 44, 56 52"
                stroke="var(--sage)"
                strokeWidth="1.1"
                fill="none"
                opacity="0.6"
              />
              <g transform="translate(10, 10)">
                {[0, 72, 144, 216, 288].map((deg) => (
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
          </m.div>
        </div>
      ))}
    </>
  );
});

export const CoverParticles = memo(function CoverParticles() {
  return (
    <>
      <div className="hidden sm:contents">
        {petals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className={`pointer-events-none absolute top-[-10%] ${p.zIndex} ${p.blur}`}
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, p.size > 20 ? 40 : 16, -12, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.8, 0.8, 0],
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
            className="pointer-events-none absolute z-[12]"
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
            <div className="h-full w-full rounded-full bg-gradient-to-tr from-mustard to-yellow-200 blur-[1px] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </m.div>
        ))}
        {butterflies.map((b, i) => (
          <m.div
            key={`bf-${i}`}
            className="pointer-events-none absolute z-10"
            style={{ top: b.top, left: b.left }}
            animate={{ x: b.path, y: b.yPath, opacity: [0, 0.9, 0.9, 0.9, 0] }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            <m.svg
              viewBox="0 0 32 32"
              width={b.size}
              height={b.size}
              fill="none"
              animate={{ scaleX: [1, 0.78, 1] }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "center" }}
            >
              <path
                d="M16 16 C 10 4, 0 6, 2 14 C 3 20, 10 20, 16 16 Z"
                fill={b.color}
                opacity="0.85"
              />
              <path
                d="M16 16 C 22 4, 32 6, 30 14 C 29 20, 22 20, 16 16 Z"
                fill={b.color}
                opacity="0.85"
              />
              <path
                d="M16 16 C 12 22, 6 26, 8 29 C 12 30, 16 24, 16 16 Z"
                fill={b.color}
                opacity="0.65"
              />
              <path
                d="M16 16 C 20 22, 26 26, 24 29 C 20 30, 16 24, 16 16 Z"
                fill={b.color}
                opacity="0.65"
              />
              <line
                x1="16"
                y1="10"
                x2="16"
                y2="24"
                stroke="var(--ink)"
                strokeWidth="1.2"
                opacity="0.6"
              />
            </m.svg>
          </m.div>
        ))}
      </div>

      {sparkles.map((s, i) => (
        <div
          key={`sp-${i}`}
          className="pointer-events-none absolute z-10"
          style={{ top: s.top, left: s.left }}
        >
          <m.div
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.6, 1.2, 0.6] }}
            transition={loop(2.8 + (i % 3), i * 0.35)}
          >
            <Sparkle className="h-3 w-3 opacity-90 sm:h-4 sm:w-4" />
          </m.div>
        </div>
      ))}
      {fireflies.map((f, i) => (
        <m.div
          key={`ff-${i}`}
          className="pointer-events-none absolute z-10 h-1.5 w-1.5 sm:h-2 sm:w-2"
          style={{ left: f.left, bottom: f.bottom }}
          animate={{
            y: [0, -60, -20, -90, 0],
            x: [0, 12, -8, 6, 0],
            opacity: [0, 0.9, 0.4, 0.9, 0],
          }}
          transition={loop(f.duration, f.delay)}
        >
          <div className="h-full w-full rounded-full bg-mustard blur-[1.5px]" />
        </m.div>
      ))}
    </>
  );
});
