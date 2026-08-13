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

interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  photoUrl?: string;
}

interface StorySectionProps {
  milestones?: StoryMilestone[];
}

const DEFAULT_MILESTONES: StoryMilestone[] = [
  {
    date: "December 2022",
    title: "First Met",
    description:
      "Destiny brought us together through a small gathering in the same city. A simple conversation that blossomed into a meaningful smile.",
    photoUrl: "https://picsum.photos/id/1011/600/800",
  },
  {
    date: "June 2024",
    title: "Making Our Commitment",
    description:
      "After sharing countless laughs, stories, and mutual support, we decided to walk hand in hand into a serious commitment.",
    photoUrl: "https://picsum.photos/id/1025/600/800",
  },
  {
    date: "December 2025",
    title: "Heading to the Altar",
    description:
      "With the blessing of our parents and pure intentions, we pledged to embark on a new chapter as lifelong companions.",
    photoUrl: "https://picsum.photos/id/338/600/800",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GPU_HINT = { willChange: "transform, opacity" } as const;
const GPU_HINT_OPACITY = { willChange: "opacity" } as const;
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
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
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
    "0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data (trimmed for performance) ---------- */

const scatterItems = [
  { top: "10%", left: "5%", type: "bloom", color: "var(--burgundy)" },
  { top: "20%", left: "90%", type: "leaf", rot: 25 },
  { top: "70%", left: "6%", type: "bloom", color: "var(--blush-dark)" },
  { top: "85%", left: "90%", type: "bloom", color: "var(--sage-light)" },
] as const;

const sparkles = [
  { top: "12%", left: "20%", duration: 3.2, delay: 0 },
  { top: "62%", left: "18%", duration: 3.4, delay: 1 },
  { top: "82%", left: "78%", duration: 4, delay: 0.3 },
];

const fireflies = [
  { left: "18%", bottom: "10%", duration: 7, delay: 0 },
  { left: "82%", bottom: "35%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "65%", duration: 7.5, delay: 3 },
];

const floatingPetals = [
  { left: "8%", size: 7, duration: 16, delay: 0, color: "var(--blush-dark)" },
  { left: "75%", size: 14, duration: 13, delay: 4, color: "var(--sage-light)" },
  { left: "15%", size: 25, duration: 11, delay: 5, color: "var(--coral)" },
];

const goldDusts = [
  { left: "12%", bottom: "5%", size: 4, duration: 14, delay: 0 },
  { left: "88%", bottom: "10%", size: 5, duration: 15, delay: 3 },
];

const butterflies = [
  { left: "12%", top: "22%", color: "var(--coral)", duration: 16, delay: 0 },
];

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
    delay: 0.4,
    duration: 3.6,
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
    delay: 0.9,
    duration: 3.9,
  },
];

/* ---------- Small presentational pieces ---------- */

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

/* Static, non-rotating glow — replaces the previous rotating conic-gradient */
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10)_0%,transparent_70%)] blur-2xl lg:h-[620px] lg:w-[620px]"
    />
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

const HeartIcon = memo(function HeartIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--burgundy)">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
});

/* ---------- Ambient decoration ---------- */

const AmbientDecor = memo(function AmbientDecor() {
  return (
    <div className="hidden md:contents">
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
        <div
          key={`sparkle-${i}`}
          className="pointer-events-none absolute z-[1] animate-[twinkle_var(--d)_ease-in-out_infinite]"
          style={
            {
              top: s.top,
              left: s.left,
              "--d": `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
        </div>
      ))}

      {floatingPetals.map((p, i) => (
        <div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-[-10%] z-[2] animate-[petal-fall_var(--d)_linear_infinite]"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--d": `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
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
        </div>
      ))}

      {goldDusts.map((g, i) => (
        <div
          key={`gd-${i}`}
          className="pointer-events-none absolute z-[15] animate-[gold-rise_var(--d)_linear_infinite]"
          style={
            {
              left: g.left,
              bottom: g.bottom,
              width: g.size,
              height: g.size,
              "--d": `${g.duration}s`,
              animationDelay: `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-gradient-to-tr from-mustard to-yellow-200 blur-[1px] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
      ))}

      {fireflies.map((f, i) => (
        <div
          key={`firefly-${i}`}
          className="pointer-events-none absolute z-[1] h-1.5 w-1.5 animate-[firefly-drift_var(--d)_ease-in-out_infinite] lg:h-2 lg:w-2"
          style={
            {
              left: f.left,
              bottom: f.bottom,
              "--d": `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-mustard blur-[1.5px]" />
        </div>
      ))}

      {butterflies.map((b, i) => (
        <div
          key={`butterfly-${i}`}
          className="pointer-events-none absolute z-[2] h-5 w-6 animate-[butterfly-flit_var(--d)_ease-in-out_infinite] lg:h-7 lg:w-9"
          style={
            {
              left: b.left,
              top: b.top,
              "--d": `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Butterfly className="h-full w-full" color={b.color} />
        </div>
      ))}
    </div>
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
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 animate-[ornament-pulse_var(--d)_ease-in-out_infinite] sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
          style={
            {
              "--d": `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- Timeline ---------- */

const MilestoneCard = memo(function MilestoneCard({
  item,
  isEven,
}: {
  item: StoryMilestone;
  isEven: boolean;
}) {
  return (
    <m.div
      variants={fadeUp}
      className={`group relative flex w-full flex-col items-center gap-5 sm:flex-row sm:gap-0 ${
        isEven ? "sm:flex-row-reverse" : ""
      }`}
    >
      <div
        className={`ml-14 w-[calc(100%-3.5rem)] rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-b from-ivory/95 to-white/90 p-5 text-left shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md transition-shadow duration-500 ease-out hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] sm:ml-0 sm:w-[calc(50%-3rem)] sm:p-7 ${
          isEven ? "sm:mr-auto" : "sm:ml-auto"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.9)]" />

        {item.photoUrl && (
          <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-mustard/30 shadow-inner">
            <Image
              src={item.photoUrl}
              alt={item.title}
              fill
              sizes="(min-width: 640px) 50vw, 90vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
          </div>
        )}

        <span className="mb-3 inline-block rounded-full border border-mustard/60 bg-white/80 px-4 py-1 text-[9px] font-extrabold tracking-[0.25em] text-burgundy shadow-sm sm:text-[10px]">
          {item.date}
        </span>
        <h3 className="font-serif text-xl font-bold text-ink transition-colors duration-300 group-hover:text-burgundy sm:text-2xl">
          {item.title}
        </h3>
        <p className="mt-2.5 text-xs leading-relaxed text-ink/75 sm:text-sm">
          {item.description}
        </p>
      </div>

      <div className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-mustard/70 bg-gradient-to-br from-ivory to-white shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:border-burgundy/60 sm:left-1/2 sm:h-14 sm:w-14">
        <div className="absolute inset-0 rounded-full bg-mustard/20 opacity-0 [.group:hover_&]:animate-[dot-ping_1.6s_ease-out_infinite] [.group:hover_&]:opacity-100" />
        <HeartIcon className="relative z-10 h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
      </div>
    </m.div>
  );
});

/* ---------- Main component ---------- */

function StorySectionInner({
  milestones = DEFAULT_MILESTONES,
}: StorySectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6); }
          50% { opacity: 0.85; transform: scale(1.1); }
        }
        @keyframes petal-fall {
          0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          50% { transform: translate3d(15px, 57vh, 0) rotate(180deg); }
          90% { opacity: 0.75; }
          100% { transform: translate3d(0, 115vh, 0) rotate(360deg); opacity: 0; }
        }
        @keyframes gold-rise {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate3d(8px, -55vh, 0); opacity: 0.4; }
          85% { opacity: 0.8; }
          100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
        }
        @keyframes firefly-drift {
          0%, 100% { transform: translate3d(0,0,0); opacity: 0; }
          25% { transform: translate3d(12px, -60px, 0); opacity: 0.9; }
          50% { transform: translate3d(-8px, -20px, 0); opacity: 0.4; }
          75% { transform: translate3d(6px, -90px, 0); opacity: 0.9; }
        }
        @keyframes butterfly-flit {
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
          25% { transform: translate3d(30px, -20px, 0) rotate(6deg); }
          50% { transform: translate3d(-15px, -5px, 0) rotate(-5deg); }
          75% { transform: translate3d(40px, -30px, 0) rotate(4deg); }
        }
        @keyframes ornament-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 0.75; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          section [style*="animation"], section [class*="animate-"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT_OPACITY}
      />

      <AmbientGlow />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
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
          <span className="inline-block rounded-full border border-mustard/50 bg-ivory/90 px-3 py-0.5 text-[9px] font-extrabold tracking-[0.28em] text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:py-1 sm:text-[11px] sm:tracking-[0.32em]">
            OUR LOVE STORY
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

        <m.p
          variants={fadeUp}
          className="font-script mt-4 text-3xl font-semibold text-ink xs:text-4xl sm:mt-5 sm:text-5xl md:text-6xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Our Journey to Forever
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mb-10 mt-4 sm:mb-16"
        >
          <SprigDivider className="h-4 w-36 opacity-80 sm:w-44" />
        </m.div>

        <div className="relative flex w-full flex-col gap-12 sm:gap-20">
          <div className="absolute bottom-6 left-6 top-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-mustard/10 via-mustard/80 to-mustard/10 shadow-[0_0_8px_rgba(212,175,55,0.4)] sm:left-1/2" />

          {milestones.map((item, index) => (
            <MilestoneCard
              key={`milestone-${index}`}
              item={item}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </m.div>
    </section>
  );
}

export default function StorySection(props: StorySectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <StorySectionInner {...props} />
    </LazyMotion>
  );
}
