"use client";

import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface CountdownSectionProps {
  targetDate?: string;
  brideName?: string;
  groomName?: string;
  displayDate?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const boxPop: Variants = {
  hidden: { opacity: 0, scale: 0.75, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

const fireflies = [
  { left: "10%", top: "22%", duration: 7, delay: 0 },
  { left: "22%", top: "72%", duration: 8.5, delay: 1.5 },
  { left: "86%", top: "20%", duration: 7.5, delay: 3 },
  { left: "90%", top: "70%", duration: 9, delay: 2 },
  { left: "50%", top: "12%", duration: 8, delay: 4.5 },
] as const;

const butterflies = [
  { left: "8%", top: "40%", color: "var(--coral)", duration: 18, delay: 0 },
  { left: "88%", top: "50%", color: "var(--burgundy)", duration: 20, delay: 5 },
] as const;

const floatingPetals = [
  { left: "15%", size: 6, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "78%", size: 7, duration: 13, delay: 4, color: "var(--sage-light)" },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

function getTimeLeft(target: Date) {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const CornerSprig = memo(function CornerSprig({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <path
        d="M2 2 C 2 12, 8 18, 18 20"
        stroke="var(--sage)"
        strokeWidth="0.9"
        fill="none"
        opacity="0.55"
      />
      <g transform="translate(6, 6)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-3.6"
            rx="2.4"
            ry="4.6"
            fill="var(--coral)"
            opacity="0.85"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.4" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none">
      <line
        x1="0"
        y1="10"
        x2="80"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="120"
        y1="10"
        x2="200"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(100, 10)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-4.4"
            rx="2.8"
            ry="5.4"
            fill="var(--burgundy)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.8" fill="var(--mustard)" />
      </g>
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
        opacity="0.5"
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

const TimeBox = memo(function TimeBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const display = pad(value);
  return (
    <motion.div variants={boxPop} className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -inset-1.5 rounded-2xl border border-mustard/40 sm:-inset-2 lg:-inset-2.5" />
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-mustard/60 bg-gradient-to-b from-ivory to-blush/25 shadow-[0_8px_20px_-8px_rgba(58,54,48,0.3)] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <span className="pointer-events-none absolute inset-1 rounded-xl border border-white/50" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ willChange: "transform, opacity" }}
              className="font-script relative text-3xl font-bold text-burgundy sm:text-4xl lg:text-5xl"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="mt-2.5 text-[11px] font-extrabold tracking-[0.22em] text-ink sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
});

const Separator = memo(function Separator() {
  return (
    <div className="flex h-16 items-center pb-5 sm:h-20 sm:pb-6 lg:h-24 lg:pb-7">
      <span className="text-xl font-bold text-mustard/80 sm:text-2xl">:</span>
    </div>
  );
});

export default function CountdownSection({
  targetDate = "2026-12-12T08:00:00+07:00",
  brideName = "Amelia",
  groomName = "Alexander",
  displayDate = "SABTU, 12 DESEMBER 2026",
}: CountdownSectionProps) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-mustard/15 blur-[70px] lg:h-56 lg:w-56" />

      <motion.svg
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 w-full opacity-80 lg:h-20"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        {fairyLights.map((f, i) => (
          <g key={`fl-${i}`}>
            <circle
              cx={f.cx}
              cy={f.cy}
              r="4.5"
              fill="var(--mustard)"
              opacity="0.18"
            />
            <motion.circle
              cx={f.cx}
              cy={f.cy}
              r="2.2"
              fill="var(--mustard)"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 2.2 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </g>
        ))}
      </motion.svg>

      <div className="hidden sm:contents">
        {floatingPetals.map((p, i) => (
          <motion.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-6%] z-[1]"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "112vh"],
              x: [0, 14, -8, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 20 20" fill="none">
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="9"
                fill={p.color}
                opacity="0.65"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:contents">
        {butterflies.map((b, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[1] h-4 w-5 lg:h-6 lg:w-8"
            style={{ left: b.left, top: b.top }}
            animate={{
              x: [0, 30, -14, 40, 0],
              y: [0, -20, -4, -28, 0],
              rotate: [0, 6, -5, 4, 0],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ scaleX: [1, 0.82, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-full"
            >
              <Butterfly className="h-full w-full" color={b.color} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="contents">
        {fireflies.map((f, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="pointer-events-none absolute z-[1] h-1.5 w-1.5 lg:h-2 lg:w-2"
            style={{ left: f.left, top: f.top }}
            animate={{
              y: [0, -30, -8, -40, 0],
              x: [0, 10, -6, 8, 0],
              opacity: [0, 0.9, 0.4, 0.9, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Firefly className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-y-100" />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-sage/25 sm:inset-6 lg:inset-10" />
      <div className="pointer-events-none absolute inset-7 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block lg:inset-12" />

      <div className="pointer-events-none absolute left-6 top-6 z-[1] h-6 w-6 opacity-70 sm:left-9 sm:top-9">
        <CornerSprig className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute right-6 top-6 z-[1] h-6 w-6 -scale-x-100 opacity-70 sm:right-9 sm:top-9">
        <CornerSprig className="h-full w-full" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="inline-block rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
        >
          MENUJU HARI BAHAGIA
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="font-script mt-4 text-3xl font-semibold text-ink lg:text-4xl"
        >
          {brideName} &amp; {groomName}
        </motion.p>

        <motion.div variants={fadeUp}>
          <OrnateDivider className="mt-4 h-4 w-32 sm:w-40" />
        </motion.div>

        <motion.div
          variants={container}
          className="mt-8 flex items-center gap-2.5 sm:gap-4 lg:gap-6"
        >
          <TimeBox value={timeLeft.days} label="HARI" />
          <Separator />
          <TimeBox value={timeLeft.hours} label="JAM" />
          <Separator />
          <TimeBox value={timeLeft.minutes} label="MENIT" />
          <Separator />
          <TimeBox value={timeLeft.seconds} label="DETIK" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="mt-8 flex items-center gap-2 sm:mt-9">
            <span className="h-px w-8 bg-sage/60" />
            <p className="text-xs font-bold tracking-[0.15em] text-ink/80 sm:text-sm">
              {displayDate}
            </p>
            <span className="h-px w-8 bg-sage/60" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
