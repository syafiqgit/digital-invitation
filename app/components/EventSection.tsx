"use client";

import { memo, useEffect, useState } from "react";
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

interface EventSectionProps {
  targetDate?: string;
  akadTime?: string;
  akadVenue?: string;
  akadAddress?: string;
  resepsiTime?: string;
  resepsiVenue?: string;
  resepsiAddress?: string;
  mapsUrl?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEFAULT_TARGET_DATE = "2026-12-12T08:00:00+07:00";
const DEFAULT_AKAD_TIME = "08:00 - 09:00 WIB";
const DEFAULT_AKAD_VENUE = "Kediaman Mempelai";
const DEFAULT_AKAD_ADDRESS = "Jl. Melati No. 12, Jakarta";
const DEFAULT_RESEPSI_TIME = "11:00 - 14:00 WIB";
const DEFAULT_RESEPSI_VENUE = "Gedung Serba Guna Mawar";
const DEFAULT_RESEPSI_ADDRESS = "Jl. Kenanga No. 45, Jakarta";
const DEFAULT_MAPS_URL = "https://maps.google.com";

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
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const digitPop: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
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

/* ---------- Static decoration data ---------- */

const scatterItems = [
  { top: "15%", left: "12%", type: "bloom", color: "var(--burgundy)" },
  { top: "22%", left: "85%", type: "leaf", rot: 25 },
  { top: "45%", left: "8%", type: "bloom", color: "var(--coral)" },
  { top: "55%", left: "92%", type: "bloom", color: "var(--blush-dark)" },
  { top: "78%", left: "14%", type: "leaf", rot: -30 },
  { top: "82%", left: "88%", type: "bloom", color: "var(--sage-light)" },
] as const;

const sparkles = [
  { top: "18%", left: "25%" },
  { top: "32%", left: "82%" },
  { top: "72%", left: "18%" },
  { top: "65%", left: "75%" },
].map((s) => ({ ...s, style: { top: s.top, left: s.left, ...GPU_HINT } }));

const fireflies = [
  { left: "20%", bottom: "15%", duration: 7, delay: 0 },
  { left: "80%", bottom: "25%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "65%", duration: 7.5, delay: 3 },
  { left: "85%", bottom: "55%", duration: 9, delay: 2 },
].map((f) => ({
  ...f,
  style: { left: f.left, bottom: f.bottom, ...GPU_HINT },
}));

const petals = [
  { left: "8%", size: 6, duration: 12, delay: 1, color: "var(--sage-light)" },
  {
    left: "52%",
    size: 7,
    duration: 10.5,
    delay: 5,
    color: "var(--blush-dark)",
  },
  { left: "90%", size: 6, duration: 13, delay: 3, color: "var(--coral)" },
].map((p) => ({
  ...p,
  style: { left: p.left, width: p.size, height: p.size, ...GPU_HINT },
}));

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

const countdownUnits = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

const ZERO_TIME_LEFT: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

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

const Firefly = memo(function Firefly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-full bg-mustard blur-[1.5px] ${className}`} />
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

const CalendarIcon = memo(function CalendarIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2.5"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
      />
      <line
        x1="3"
        y1="9.5"
        x2="21"
        y2="9.5"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
      />
      <line
        x1="7.5"
        y1="3"
        x2="7.5"
        y2="7"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="3"
        x2="16.5"
        y2="7"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="13.5" r="1.1" fill="var(--mustard)" />
      <circle cx="12" cy="13.5" r="1.1" fill="var(--mustard)" />
      <circle cx="16" cy="13.5" r="1.1" fill="var(--mustard)" />
    </svg>
  );
});

const PinIcon = memo(function PinIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 22c4-4.5 7-8.3 7-12a7 7 0 0 0-14 0c0 3.7 3 7.5 7 12Z"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
        fill="var(--blush)"
        fillOpacity="0.4"
      />
      <circle cx="12" cy="10" r="2.6" fill="var(--burgundy)" />
    </svg>
  );
});

/* ---------- Ambient Decoration (Scatters, Sparkles, Fireflies) ---------- */
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

// FrameLayers with elegant CornerFlourish injections
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

      {/* Ornamen Sudut Mewah (berdenyut di belakang floral corner) */}
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

/* ---------- Countdown ---------- */

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function useCountdown(target: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME_LEFT);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

const CountdownDigit = memo(function CountdownDigit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <m.div variants={digitPop} className="flex flex-col items-center gap-1.5">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-mustard/60 bg-ivory/95 shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:h-16 sm:w-16">
        {/* Glow tipis di dalam kotak */}
        <div className="absolute inset-0 rounded-[1.25rem] shadow-[inset_0_0_12px_rgba(255,255,255,0.8)]" />
        <span className="font-serif relative z-10 text-xl font-bold text-burgundy sm:text-2xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/70 sm:text-[10px]">
        {label}
      </span>
    </m.div>
  );
});

/* ---------- Event info card ---------- */

const EventBlock = memo(function EventBlock({
  title,
  time,
  venue,
  address,
}: {
  title: string;
  time: string;
  venue: string;
  address: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2.5 px-3 py-6 text-center sm:px-5 sm:py-8">
      <span className="inline-block rounded-full border border-mustard/50 bg-ivory px-3 py-0.5 text-[9px] font-extrabold tracking-[0.24em] text-burgundy sm:text-[10px]">
        {title}
      </span>
      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink sm:text-base">
        <CalendarIcon className="h-4 w-4 shrink-0" />
        <span>{time}</span>
      </div>
      <div className="mt-1 flex items-start gap-1.5 text-xs text-ink/80 sm:text-sm">
        <PinIcon className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="text-left leading-relaxed">
          <span className="font-semibold text-ink">{venue}</span>
          <br />
          {address}
        </span>
      </div>
    </div>
  );
});

/* ---------- Main section ---------- */

function EventSectionInner({
  targetDate = DEFAULT_TARGET_DATE,
  akadTime = DEFAULT_AKAD_TIME,
  akadVenue = DEFAULT_AKAD_VENUE,
  akadAddress = DEFAULT_AKAD_ADDRESS,
  resepsiTime = DEFAULT_RESEPSI_TIME,
  resepsiVenue = DEFAULT_RESEPSI_VENUE,
  resepsiAddress = DEFAULT_RESEPSI_ADDRESS,
  mapsUrl = DEFAULT_MAPS_URL,
}: EventSectionProps) {
  const timeLeft = useCountdown(targetDate);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-20 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <m.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT}
      />

      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-2xl flex-col items-center px-2 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
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
            SAVE THE DATE
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
          Sabtu, 12 Desember 2026
        </m.p>

        {/* Countdown: glow breathes behind it, digits pop in staggered */}
        <m.div
          variants={fadeUp}
          className="relative mt-6 sm:mt-8"
          style={GPU_HINT}
        >
          <m.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-150 rounded-full bg-blush/25 blur-2xl"
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [1.3, 1.6, 1.3] }}
            transition={loop(4, 0.5)}
            style={GPU_HINT}
          />
          <m.div
            variants={containerVariants}
            className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-4"
          >
            {countdownUnits.map((u) => (
              <CountdownDigit
                key={u.key}
                value={timeLeft[u.key]}
                label={u.label}
              />
            ))}
          </m.div>
        </m.div>

        {/* Combined Akad & Resepsi card with elevated shadow & elegant divider */}
        <m.div
          variants={fadeUp}
          className="mt-8 flex w-full flex-col overflow-hidden rounded-3xl border border-mustard/40 bg-ivory/95 shadow-[0_12px_40px_rgba(58,54,48,0.08)] sm:mt-10 sm:flex-row sm:divide-x sm:divide-sage/25"
        >
          <EventBlock
            title="AKAD NIKAH"
            time={akadTime}
            venue={akadVenue}
            address={akadAddress}
          />

          {/* Elegant Divider (hanya muncul di layout tumpuk/mobile) */}
          <div className="flex w-full justify-center opacity-60 sm:hidden">
            <SprigDivider className="h-4 w-40" />
          </div>

          <EventBlock
            title="RESEPSI"
            time={resepsiTime}
            venue={resepsiVenue}
            address={resepsiAddress}
          />
        </m.div>

        <m.a
          variants={fadeUp}
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg sm:mt-10 sm:px-10 sm:text-xs"
          style={GPU_HINT}
        >
          <PinIcon className="h-4 w-4 [&_path]:stroke-white [&_circle]:fill-white" />
          Buka Lokasi
        </m.a>
      </m.div>
    </section>
  );
}

export default function EventSection(props: EventSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <EventSectionInner {...props} />
    </LazyMotion>
  );
}
