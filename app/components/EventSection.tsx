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

/* ---------- Static decoration data (trimmed for performance) ---------- */

const scatterItems = [
  { top: "8%", left: "10%", type: "bloom", color: "var(--burgundy)" },
  { top: "18%", left: "88%", type: "leaf", rot: 25 },
  { top: "30%", left: "6%", type: "bloom", color: "var(--sage-light)" },
  { top: "62%", left: "8%", type: "leaf", rot: -30 },
  { top: "92%", left: "12%", type: "bloom", color: "var(--coral)" },
] as const;

const sparkles = [
  { top: "12%", left: "25%", duration: 3.2, delay: 0 },
  { top: "58%", left: "16%", duration: 3.4, delay: 1.2 },
  { top: "80%", left: "82%", duration: 4, delay: 0.3 },
];

const fireflies = [
  { left: "15%", bottom: "10%", duration: 7, delay: 0 },
  { left: "85%", bottom: "30%", duration: 8.5, delay: 1.5 },
  { left: "20%", bottom: "70%", duration: 7.5, delay: 3 },
];

const floatingPetals = [
  { left: "8%", size: 7, duration: 16, delay: 0, color: "var(--blush-dark)" },
  { left: "65%", size: 8, duration: 15, delay: 5, color: "var(--sage-light)" },
  { left: "20%", size: 12, duration: 12, delay: 3, color: "var(--coral)" },
  { left: "75%", size: 14, duration: 13, delay: 4, color: "var(--sage-light)" },
];

const goldDusts = [
  { left: "20%", bottom: "-2%", size: 5, duration: 15, delay: 0 },
  { left: "80%", bottom: "0%", size: 6, duration: 13, delay: 1 },
];

const butterflies = [
  { left: "10%", top: "20%", color: "var(--coral)", duration: 16, delay: 0 },
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

/* ---------- Ambient Decoration ---------- */

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
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-mustard/70 bg-gradient-to-b from-ivory/95 to-white shadow-[0_6px_20px_rgba(212,175,55,0.2)] sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem] lg:h-20 lg:w-20">
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.9)]" />
        <span className="font-serif relative z-10 text-xl font-bold tabular-nums text-burgundy sm:text-2xl md:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/70 sm:text-[10px] md:text-xs">
        {label}
      </span>
    </div>
  );
});

const CountdownTimer = memo(function CountdownTimer({
  targetDate,
}: {
  targetDate: string;
}) {
  const timeLeft = useCountdown(targetDate);

  return (
    <m.div variants={fadeUp} className="relative mt-2 sm:mt-4" style={GPU_HINT}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-150 rounded-full bg-blush/30 blur-2xl animate-[glow-pulse_4s_ease-in-out_infinite]"
        style={GPU_HINT}
      />
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 flex items-center justify-center gap-3 sm:gap-5 md:gap-6"
      >
        {countdownUnits.map((u) => (
          <m.div key={u.key} variants={digitPop}>
            <CountdownDigit value={timeLeft[u.key]} label={u.label} />
          </m.div>
        ))}
      </m.div>
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
    <div className="flex flex-1 flex-col items-center gap-2.5 px-4 py-7 text-center sm:px-6 sm:py-9 md:py-10">
      <span className="inline-block rounded-full border border-mustard/60 bg-gradient-to-r from-ivory via-white to-ivory px-4 py-1 text-[9px] font-extrabold tracking-[0.25em] text-burgundy shadow-sm sm:text-[10px]">
        {title}
      </span>
      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink sm:text-base">
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
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.3); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.6); }
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
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT_OPACITY}
      />

      <AmbientGlow />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
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
          className="font-script mt-4 text-3xl font-semibold text-ink xs:text-4xl sm:mt-5 sm:text-5xl md:text-6xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Sabtu, 12 Desember 2026
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mb-4 mt-4 sm:mb-6 sm:mt-6"
        >
          <SprigDivider className="h-4 w-36 opacity-80 sm:w-44" />
        </m.div>

        <CountdownTimer targetDate={targetDate} />

        <m.div
          variants={fadeUp}
          className="relative mt-10 flex w-full flex-col overflow-hidden rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-b from-ivory/95 to-white/90 shadow-[0_15px_50px_rgba(212,175,55,0.12)] backdrop-blur-md sm:mt-12 sm:flex-row sm:divide-x sm:divide-mustard/30"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)]" />

          <EventBlock
            title="AKAD NIKAH"
            time={akadTime}
            venue={akadVenue}
            address={akadAddress}
          />

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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-burgundy to-[#5e1927] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(94,25,39,0.3)] transition-all hover:shadow-[0_10px_25px_rgba(94,25,39,0.5)] sm:mt-10 sm:px-10 sm:text-xs"
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
