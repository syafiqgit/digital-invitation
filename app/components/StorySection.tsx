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
    date: "Desember 2022",
    title: "Awal Berkenalan",
    description:
      "Takdir mempertemukan kami melalui sebuah acara kecil di kota yang sama. Percakapan sederhana yang berlanjut menjadi senyuman penuh arti.",
    photoUrl: "https://picsum.photos/id/1011/600/800",
  },
  {
    date: "Juni 2024",
    title: "Menjalin Komitmen",
    description:
      "Setelah melalui berbagai tawa, cerita, dan dukungan satu sama lain, kami memutuskan untuk melangkah bersama dalam ikatan komitmen yang serius.",
    photoUrl: "https://picsum.photos/id/1025/600/800",
  },
  {
    date: "Desember 2025",
    title: "Menuju Pelaminan",
    description:
      "Dengan restu kedua orang tua dan niat yang suci, kami mengikat janji untuk menempuh babak baru sebagai teman hidup selamanya.",
    photoUrl: "https://picsum.photos/id/338/600/800",
  },
];

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
  // Membingkai kartu pertama
  { top: "18%", left: "5%", type: "bloom", color: "var(--burgundy)" },
  { top: "25%", left: "95%", type: "leaf", rot: 25 },

  // Membingkai kartu kedua (area tengah)
  { top: "48%", left: "8%", type: "bloom", color: "var(--coral)" },
  { top: "52%", left: "92%", type: "leaf", rot: -30 },

  // Membingkai kartu ketiga (area bawah)
  { top: "75%", left: "5%", type: "bloom", color: "var(--blush-dark)" },
  { top: "82%", left: "95%", type: "leaf", rot: 40 },

  // Tambahan kecil untuk mengisi celah antar kartu
  { top: "35%", left: "15%", type: "leaf", rot: -10 },
  { top: "65%", left: "85%", type: "bloom", color: "var(--sage-light)" },
] as const;

const sparkles = [
  { top: "15%", left: "25%" },
  { top: "35%", left: "80%" },
  { top: "65%", left: "18%" },
  { top: "88%", left: "78%" },
].map((s) => ({ ...s, style: { top: s.top, left: s.left, ...GPU_HINT } }));

const fireflies = [
  { left: "20%", bottom: "15%", duration: 7, delay: 0 },
  { left: "80%", bottom: "30%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "65%", duration: 7.5, delay: 3 },
  { left: "85%", bottom: "55%", duration: 9, delay: 2 },
].map((f) => ({
  ...f,
  style: { left: f.left, bottom: f.bottom, ...GPU_HINT },
}));

// --- UPDATE: Parallax Floating Petals 3D ---
const floatingPetals = [
  {
    left: "8%",
    size: 7,
    duration: 16,
    delay: 0,
    color: "var(--blush-dark)",
    blur: "blur-[3px]",
    zIndex: "z-[2]",
  },
  {
    left: "35%",
    size: 6,
    duration: 18,
    delay: 2,
    color: "var(--coral)",
    blur: "blur-[3px]",
    zIndex: "z-[2]",
  },
  {
    left: "75%",
    size: 14,
    duration: 13,
    delay: 4,
    color: "var(--sage-light)",
    blur: "blur-none",
    zIndex: "z-[5]",
  },
  {
    left: "90%",
    size: 42,
    duration: 9,
    delay: 1.5,
    color: "var(--burgundy)",
    blur: "blur-[6px]",
    zIndex: "z-[30]",
  },
].map((p) => ({
  ...p,
  style: { left: p.left, width: p.size, height: p.size, ...GPU_HINT },
}));

// --- UPDATE: Partikel Emas Mewah ---
const goldDusts = [
  { left: "15%", bottom: "10%", size: 4, duration: 13, delay: 0 },
  { left: "50%", bottom: "5%", size: 6, duration: 16, delay: 2 },
  { left: "85%", bottom: "15%", size: 5, duration: 14, delay: 3 },
];

const butterflies = [
  { left: "12%", top: "28%", color: "var(--coral)", duration: 16, delay: 0 },
  { left: "84%", top: "62%", color: "var(--burgundy)", duration: 18, delay: 3 },
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

const GoldDust = memo(function GoldDust({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-mustard to-yellow-200 blur-[1px] ${className}`}
    />
  );
});

const MajesticRay = memo(function MajesticRay() {
  return (
    <m.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] -translate-x-1/2 -translate-y-1/2 opacity-50"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      <div className="h-[550px] w-[550px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.06)_60deg,transparent_120deg,rgba(212,175,55,0.06)_180deg,transparent_240deg,rgba(212,175,55,0.06)_300deg,transparent_360deg)] blur-3xl lg:h-[750px] lg:w-[750px]" />
    </m.div>
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

        {floatingPetals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className={`pointer-events-none absolute top-[-10%] ${p.zIndex} ${p.blur}`}
            style={p.style}
            animate={{
              y: ["0vh", "115vh"],
              x: [0, p.size > 20 ? 45 : 20, -15, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.75, 0.75, 0],
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
              y: ["0vh", "-110vh"],
              x: [0, 15, -10, 5, 0],
              opacity: [0, 0.8, 0.4, 0.8, 0],
            }}
            transition={loop(g.duration, g.delay, "linear")}
          >
            <GoldDust className="h-full w-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </m.div>
        ))}

        {butterflies.map((b, i) => (
          <m.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[2] h-5 w-6 lg:h-7 lg:w-9"
            style={b.style}
            animate={{
              x: [0, 30, -15, 40, 0],
              y: [0, -20, -5, -30, 0],
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
    </>
  );
});

/* ---------- Main Component ---------- */

function StorySectionInner({
  milestones = DEFAULT_MILESTONES,
}: StorySectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-20 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <m.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT}
      />

      <MajesticRay />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-2 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
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
            KISAH CINTA KAMI
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
          className="font-script mt-4 text-3xl font-semibold text-ink sm:mt-5 sm:text-5xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Perjalanan Menuju Halal
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mt-2 mb-10 sm:mb-14"
        >
          <SprigDivider className="h-4 w-36 sm:w-44" />
        </m.div>

        {/* Timeline Container dengan Asimetris & Organic Layout */}
        <div className="relative flex w-full flex-col gap-10 sm:gap-16">
          {/* Garis Tengah Timeline dengan Gradient Emas */}
          <div className="absolute bottom-6 left-6 sm:left-1/2 top-6 w-0.5 -translate-x-1/2 bg-gradient-to-b from-mustard/20 via-mustard/70 to-mustard/20" />

          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <m.div
                key={`milestone-${index}`}
                variants={fadeUp}
                className={`relative flex flex-col sm:flex-row items-center w-full gap-4 sm:gap-0 ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Card Container dengan Efek Rotasi Tipis & Glassmorphism */}
                <div
                  className={`w-[calc(100%-3rem)] ml-auto sm:w-[calc(50%-3rem)] rounded-3xl border border-mustard/40 bg-ivory/95 p-5 sm:p-7 shadow-[0_12px_40px_rgba(58,54,48,0.08)] text-left relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isEven
                      ? "sm:mr-auto sm:text-left sm:-rotate-1"
                      : "sm:ml-auto sm:text-left sm:rotate-1"
                  }`}
                >
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_15px_rgba(255,255,255,0.7)] pointer-events-none" />

                  {/* Foto Arch Mewah di dalam Card */}
                  {item.photoUrl && (
                    <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-mustard/40 shadow-sm">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
                    </div>
                  )}

                  <span className="inline-block rounded-full border border-mustard/50 bg-ivory px-3 py-0.5 text-[9px] font-extrabold tracking-[0.2em] text-burgundy sm:text-[10px] mb-2 shadow-xs">
                    {item.date}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-ink sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/80 sm:text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Central Icon / Dot dengan efek Pulse */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-mustard/70 bg-ivory shadow-lg z-20">
                  <div className="absolute inset-0 rounded-full bg-mustard/20 animate-ping opacity-75" />
                  <HeartIcon className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </m.div>
            );
          })}
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
