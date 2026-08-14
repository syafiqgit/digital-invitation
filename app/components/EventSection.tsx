"use client";

import { memo, useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

// --- INTERFACES ---
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

// --- CONSTANTS ---
const DEFAULT_TARGET_DATE = "2026-12-12T08:00:00+07:00";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GPU_HINT = { willChange: "transform, opacity" } as const;

// --- FRAMER MOTION VARIANTS (Only for 1-time entrance) ---
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const digitPop: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

// --- STATIC DECORATION DATA (Moved animation logic to CSS vars) ---
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 lg:h-14",
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
    className: "bottom-0 left-0 h-6 w-full sm:h-10 lg:h-14",
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
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
    delay: "0.3s",
  },
];

const countdownUnits = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

// --- PRESENTATIONAL COMPONENTS ---
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
        x2="90"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="130"
        y1="14"
        x2="220"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
});

// (Asumsikan CalendarIcon dan PinIcon ada, disederhanakan untuk layout)
const CalendarIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="var(--burgundy)"
      strokeWidth="1.5"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="var(--burgundy)"
      strokeWidth="1.5"
    />
  </svg>
));
const PinIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
    <path
      d="M12 22c4-4.5 7-8.3 7-12a7 7 0 0 0-14 0c0 3.7 3 7.5 7 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
));

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
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
                animationDelay: c.delay,
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5" />
    </>
  );
});

/* ---------- COUNTDOWN ---------- */
function useCountdown(target: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      const total = Math.floor(diff / 1000);
      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
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
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-mustard/40 bg-white/60 shadow-sm backdrop-blur-sm sm:h-20 sm:w-20">
        <span className="font-serif relative z-10 text-2xl font-semibold tabular-nums text-burgundy sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
});

/* ---------- EVENT BLOCK ---------- */
const EventBlock = memo(function EventBlock({
  title,
  time,
  venue,
  address,
}: any) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <span className="rounded-full border border-mustard/50 bg-white/50 px-5 py-1.5 text-[10px] font-bold tracking-[0.2em] text-burgundy sm:text-xs">
        {title}
      </span>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink sm:text-base">
        <CalendarIcon />
        <span>{time}</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-xs text-ink/70 sm:text-sm">
        <span className="font-semibold text-ink">{venue}</span>
        <span className="leading-relaxed">{address}</span>
      </div>
    </div>
  );
});

/* ---------- MAIN SECTION ---------- */
function EventSectionInner({
  targetDate = DEFAULT_TARGET_DATE,
  ...props
}: EventSectionProps) {
  const timeLeft = useCountdown(targetDate);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-20 sm:px-6">
      {/* 
        ENGINEERING NOTE: CSS Animations untuk performa 60fps.
        Menggunakan translate3d(0,0,0) untuk memicu GPU Acceleration. 
      */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(var(--end-deg, 2deg)) translate3d(0,0,0); }
        }
        .animate-sway {
          animation: sway ease-in-out infinite;
        }
      `}</style>

      {/* Background Decor (Static) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center text-center xs:max-w-md sm:max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Title */}
        <m.div variants={fadeUp} style={GPU_HINT}>
          <span className="inline-block rounded-full border border-mustard/40 bg-white/60 px-5 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy backdrop-blur-sm sm:px-6 sm:text-xs">
            SAVE THE DATE
          </span>
        </m.div>

        <m.h2
          variants={fadeUp}
          className="font-script mt-6 text-4xl font-medium text-ink sm:text-5xl md:text-6xl"
          style={GPU_HINT}
        >
          Saturday, December 12, 2026
        </m.h2>

        <m.div variants={fadeUp} style={GPU_HINT} className="my-6">
          <SprigDivider className="h-3 w-32 opacity-70" />
        </m.div>

        {/* Countdown Timer */}
        <m.div
          variants={fadeUp}
          className="flex justify-center gap-3 sm:gap-5"
          style={GPU_HINT}
        >
          {countdownUnits.map((u) => (
            <CountdownDigit
              key={u.key}
              value={timeLeft[u.key]}
              label={u.label}
            />
          ))}
        </m.div>

        {/* Event Card Container */}
        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mt-12 flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-mustard/30 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
          <EventBlock
            title="HOLY MATRIMONY"
            time={props.akadTime || "08:00 AM - 10:00 AM"}
            venue={props.akadVenue}
            address={props.akadAddress}
          />

          <div className="flex w-full justify-center opacity-50">
            <SprigDivider className="h-3 w-32" />
          </div>

          <EventBlock
            title="RECEPTION"
            time={props.resepsiTime || "11:00 AM - 02:00 PM"}
            venue={props.resepsiVenue}
            address={props.resepsiAddress}
          />
        </m.div>

        {/* Action Button */}
        <m.a
          variants={fadeUp}
          href={props.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#6B2A36] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-transform"
          style={GPU_HINT}
        >
          <PinIcon />
          Open Location
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
