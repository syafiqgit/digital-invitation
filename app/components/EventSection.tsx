"use client";

import { memo, useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import FloatingDecorations from "./FloatingDecorations";

/* -------------------------------------------------------------------------- */
/*                                 INTERFACES                                 */
/* -------------------------------------------------------------------------- */
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

interface EventBlockProps {
  title: string;
  time: string;
  venue?: string;
  address?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
const DEFAULT_TARGET_DATE = "2026-12-12T08:00:00+07:00";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*                           STATIC DECORATION DATA                           */
/* -------------------------------------------------------------------------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    origin: "top center",
    endDeg: "1.2deg",
    duration: "7s",
    delay: "0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    origin: "top center",
    endDeg: "1.2deg",
    duration: "7.6s",
    delay: "0.4s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "1deg",
    duration: "8.2s",
    delay: "0.8s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "1deg",
    duration: "8.8s",
    delay: "1.2s",
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.2s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.3s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.1s",
  },
];

const countdownUnits = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

/* -------------------------------------------------------------------------- */
/*                          PRESENTATIONAL COMPONENTS                         */
/* -------------------------------------------------------------------------- */
const SprigDivider = memo(function SprigDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 28"
      className={className}
      fill="none"
    >
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
SprigDivider.displayName = "SprigDivider";

const FlowerWatermark = memo(function FlowerWatermark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={className}
      fill="none"
    >
      <g transform="translate(20, 20)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-8"
            rx="5"
            ry="9"
            fill="var(--blush-dark)"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="3" fill="var(--mustard)" />
      </g>
    </svg>
  );
});
FlowerWatermark.displayName = "FlowerWatermark";

const CalendarIcon = memo(() => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
  >
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
CalendarIcon.displayName = "CalendarIcon";

const PinIcon = memo(() => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
  >
    <path
      d="M12 22c4-4.5 7-8.3 7-12a7 7 0 0 0-14 0c0 3.7 3 7.5 7 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
));
PinIcon.displayName = "PinIcon";

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-event-sway"
            style={
              {
                transformOrigin: v.origin,
                "--end-deg": v.endDeg,
                animationDuration: v.duration,
                animationDelay: v.delay,
              } as React.CSSProperties
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        // REFINED: Ukuran diperbesar dan disamakan persis dengan Couple Section
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-24 w-24 opacity-90 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 ${c.position}`}
        >
          <div
            className="h-full w-full animate-event-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5 md:inset-6" />
    </>
  );
});
FrameLayers.displayName = "FrameLayers";

/* -------------------------------------------------------------------------- */
/*                                  COUNTDOWN                                 */
/* -------------------------------------------------------------------------- */
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
      <div className="relative flex h-16 min-w-16 items-center justify-center overflow-hidden rounded-2xl border border-mustard/40 bg-white/60 px-3 shadow-sm backdrop-blur-sm sm:h-20 sm:min-w-20 md:h-24 md:min-w-24">
        <span
          key={value}
          className="font-serif animate-digit-tick relative z-10 text-2xl font-semibold tabular-nums text-burgundy sm:text-3xl md:text-4xl"
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
});
CountdownDigit.displayName = "CountdownDigit";

const CountdownTimer = memo(function CountdownTimer({
  targetDate,
}: {
  targetDate: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const timeLeft = useCountdown(targetDate);

  // Mencegah Hydration Mismatch: Me-render state statis selama SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center gap-3 sm:gap-5 md:gap-6">
        {countdownUnits.map((u) => (
          <CountdownDigit key={u.key} value={0} label={u.label} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3 sm:gap-5 md:gap-6">
      {countdownUnits.map((u) => (
        <CountdownDigit key={u.key} value={timeLeft[u.key]} label={u.label} />
      ))}
    </div>
  );
});
CountdownTimer.displayName = "CountdownTimer";

/* -------------------------------------------------------------------------- */
/*                                EVENT BLOCKS                                */
/* -------------------------------------------------------------------------- */
const EventBlock = memo(function EventBlock({
  title,
  time,
  venue,
  address,
}: EventBlockProps) {
  return (
    <div className="relative flex flex-col items-center gap-3 px-6 py-8 text-center md:px-8 md:py-9">
      {/* Badge Title */}
      <span className="rounded-full border border-mustard/50 bg-white/50 px-5 py-1.5 text-[10px] font-bold tracking-[0.2em] text-burgundy sm:text-xs">
        {title}
      </span>

      {/* Time */}
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink sm:text-base">
        <CalendarIcon />
        <span>{time}</span>
      </div>

      {/* Venue & Address (REFINED) */}
      <div className="mt-1 flex flex-col items-center gap-1.5 text-center">
        <span className="text-xs font-bold tracking-wide text-ink sm:text-sm">
          {venue}
        </span>
        <span className="max-w-[16rem] text-[11px] leading-relaxed text-ink/65 sm:max-w-[18rem] sm:text-xs">
          {address}
        </span>
      </div>
    </div>
  );
});
EventBlock.displayName = "EventBlock";

/* -------------------------------------------------------------------------- */
/*                               STYLES HOISTING                              */
/* -------------------------------------------------------------------------- */
const EVENT_STYLES = `
  @keyframes event-sway {
    0%, 100% { transform: rotate(0deg); }
    25%      { transform: rotate(var(--end-deg, 1.5deg)); }
    75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
  }
  .animate-event-sway {
    animation: event-sway ease-in-out infinite;
  }
  @keyframes digit-tick {
    0%   { opacity: 0; transform: translateY(-40%); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-digit-tick {
    animation: digit-tick 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes btn-shine {
    0%        { transform: translateX(-150%) skewX(-20deg); }
    55%, 100% { transform: translateX(400%) skewX(-20deg); }
  }
  .animate-btn-shine {
    animation: btn-shine 4.5s ease-in-out infinite;
  }
  @keyframes garden-beam {
    0%, 100% { opacity: 0.35; transform: translateX(-50%) rotate(0deg); }
    50%      { opacity: 0.6;  transform: translateX(-46%) rotate(3deg); }
  }
  .animate-garden-beam {
    animation: garden-beam 16s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-event-sway,
    .animate-digit-tick,
    .animate-btn-shine,
    .animate-garden-beam { animation: none; }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                MAIN SECTION                                */
/* -------------------------------------------------------------------------- */
function EventSectionInner({
  targetDate = DEFAULT_TARGET_DATE,
  ...props
}: EventSectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-20 sm:px-6">
      <style dangerouslySetInnerHTML={{ __html: EVENT_STYLES }} />

      {/* Background Decor (Static) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <FrameLayers />

      {/* Light Beam */}
      <div
        aria-hidden="true"
        className="animate-garden-beam pointer-events-none absolute -top-1/4 left-1/2 z-[1] hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
        }}
      />

      <FloatingDecorations />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp}>
          <span className="inline-block rounded-full border border-mustard/40 bg-white/60 px-5 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy backdrop-blur-sm sm:px-6 sm:text-xs">
            SAVE THE DATE
          </span>
        </m.div>

        <m.h2
          variants={fadeUp}
          className="font-script mt-6 text-4xl font-medium text-ink sm:text-5xl md:text-6xl"
        >
          Saturday, December 12, 2026
        </m.h2>

        <m.div variants={fadeUp} className="my-7">
          <SprigDivider className="h-5 w-44 opacity-90 sm:w-52" />
        </m.div>

        {/* Countdown Timer */}
        <m.div variants={fadeUp}>
          <CountdownTimer targetDate={targetDate} />
        </m.div>

        {/* Event Card Container */}
        <m.div
          variants={fadeUp}
          className="relative mt-12 flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-mustard/30 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--mustard),transparent)] opacity-60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-[0.05]"
          >
            <FlowerWatermark className="h-full w-full" />
          </div>

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
          className="relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#6B2A36] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-transform"
        >
          <span
            aria-hidden="true"
            className="animate-btn-shine pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]"
          />
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
