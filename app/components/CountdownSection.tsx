"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface CountdownSectionProps {
  targetDate?: string;
  brideName?: string;
  groomName?: string;
  displayDate?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - Digit ganti tiap detik dianimasikan dengan jarak kecil (6px) dan  */
/*    durasi pendek (0.35s) supaya tidak terasa "delay" saat detik      */
/*    berganti terus-menerus setiap 1000ms.                            */
/*  - viewport once: true untuk animasi masuk section, tidak retrigger. */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE } },
};

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

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function CornerSprig({ className = "" }: { className?: string }) {
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
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

function OrnateDivider({ className = "" }: { className?: string }) {
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
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

/* ------------------------------------------------------------------ */
/*  TimeBox — kartu angka dengan digit yang fade+slide halus tiap       */
/*  berganti. AnimatePresence mode="popLayout" dipakai supaya digit     */
/*  lama & baru tidak saling "dorong" layout (mencegah jitter),         */
/*  cukup crossfade + slight vertical shift, sangat murah untuk         */
/*  di-render ulang tiap detik.                                         */
/* ------------------------------------------------------------------ */

function TimeBox({ value, label }: { value: number; label: string }) {
  const display = pad(value);
  return (
    <motion.div variants={boxPop} className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -inset-1.5 rounded-2xl border border-mustard/30 sm:-inset-2 lg:-inset-2.5" />
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-mustard/50 bg-gradient-to-b from-ivory to-blush/25 shadow-[0_8px_20px_-8px_rgba(58,54,48,0.3)] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
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
      <span className="mt-2.5 text-[10px] font-bold tracking-[0.25em] text-ink/65 sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

function Separator() {
  return (
    <div className="flex h-16 items-center pb-5 sm:h-20 sm:pb-6 lg:h-24 lg:pb-7">
      <span className="text-xl font-bold text-mustard/70 sm:text-2xl">:</span>
    </div>
  );
}

export default function CountdownSection({
  targetDate = "2026-12-12T08:00:00+07:00",
  brideName = "Talitha",
  groomName = "Regga",
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
      {/* dasar dekoratif — statis, konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blush/30 blur-[100px] lg:h-96 lg:w-96" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/30 blur-[85px] lg:h-72 lg:w-72" />

      {/* corner floral, fade halus */}
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-y-100" />
      </motion.div>

      {/* frame kartu tipis */}
      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-mustard/20 sm:inset-6 lg:inset-10" />

      {/* sprig kecil di sudut dalam */}
      <div className="pointer-events-none absolute left-6 top-6 z-[1] h-6 w-6 opacity-60 sm:left-9 sm:top-9">
        <CornerSprig className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute right-6 top-6 z-[1] h-6 w-6 -scale-x-100 opacity-60 sm:right-9 sm:top-9">
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
          className="inline-block rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
        >
          MENUJU HARI BAHAGIA
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="font-script mt-4 text-3xl text-ink lg:text-4xl"
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
            <span className="h-px w-8 bg-sage/50" />
            <p className="text-xs font-semibold tracking-[0.15em] text-ink/60 sm:text-sm">
              {displayDate}
            </p>
            <span className="h-px w-8 bg-sage/50" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
