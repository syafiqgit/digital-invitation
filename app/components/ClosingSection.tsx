"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import WreathFrame from "./WreathFrame";

interface ClosingSectionProps {
  guestName?: string;
  groomName?: string;
  brideName?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

const glowVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.3, ease: EASE } },
};

const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
};

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE } },
};

const petals = [
  { left: "8%", size: 7, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "28%", size: 6, duration: 13, delay: 3, color: "var(--coral)" },
  { left: "50%", size: 6, duration: 12, delay: 1.5, color: "var(--mustard)" },
  { left: "72%", size: 7, duration: 14, delay: 4, color: "var(--burgundy)" },
  {
    left: "90%",
    size: 6,
    duration: 12.5,
    delay: 2,
    color: "var(--sage-light)",
  },
] as const;

const stars = [
  { top: "14%", left: "12%" },
  { top: "22%", left: "88%" },
  { top: "70%", left: "10%" },
  { top: "78%", left: "90%" },
] as const;

const fireflies = [
  { left: "10%", top: "40%", duration: 7.5, delay: 0 },
  { left: "90%", top: "35%", duration: 8.5, delay: 2 },
  { left: "50%", top: "55%", duration: 9, delay: 4 },
] as const;

const butterflies = [
  { left: "18%", top: "15%", color: "var(--coral)", duration: 19, delay: 0 },
  { left: "80%", top: "62%", color: "var(--burgundy)", duration: 21, delay: 5 },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

const SparkleIcon = memo(function SparkleIcon({
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

const HeartIcon = memo(function HeartIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--burgundy)">
      <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.4 1.6 6.9 4.4 5.2c2.2-1.3 4.9-.7 6.5 1.3l1.1 1.4 1.1-1.4c1.6-2 4.3-2.6 6.5-1.3 2.8 1.7 3.3 5.2 1.7 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 24" className={className} fill="none">
      <line
        x1="0"
        y1="12"
        x2="76"
        y2="12"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="124"
        y1="12"
        x2="200"
        y2="12"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <g transform="translate(100, 12)">
        {ANGLES_5.map((deg) => (
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

export default function ClosingSection({
  guestName = "Tamu Undangan",
  groomName = "Alexander",
  brideName = "Amelia",
}: ClosingSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />

      <motion.div
        variants={glowVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl lg:h-96 lg:w-96"
      />

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

      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-10 opacity-35 lg:block lg:w-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="h-full w-full"
        >
          <FloralVine orientation="vertical" className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-10 -scale-x-100 opacity-35 lg:block lg:w-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, -1.5, 0, 1.5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          style={{ transformOrigin: "top center" }}
          className="h-full w-full"
        >
          <FloralVine orientation="vertical" className="h-full w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-[1] h-28 w-28 opacity-85 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-[1] h-24 w-24 opacity-55 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.15 }}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{
            duration: 6.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-24 w-24 opacity-55 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.25 }}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{
            duration: 6.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-y-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-28 w-28 opacity-85 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{
            duration: 6.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
        </motion.div>
      </motion.div>

      {petals.map((p, i) => (
        <motion.div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-[-5%] z-[1]"
          style={{ left: p.left, width: p.size, height: p.size }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 16, -10, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.55, 0.55, 0],
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
              opacity="0.75"
            />
          </svg>
        </motion.div>
      ))}

      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="pointer-events-none absolute z-[1]"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0.15, 0.8, 0.15], scale: [0.6, 1.1, 0.6] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <SparkleIcon className="h-3 w-3" />
        </motion.div>
      ))}

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
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block rounded-full border border-mustard/60 bg-ivory/95 px-4 py-1 text-xs font-bold tracking-[0.35em] text-ink shadow-sm backdrop-blur-sm"
        >
          TERIMA KASIH
        </motion.span>

        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-6 w-full rounded-3xl border border-sage/40 bg-ivory/95 px-6 py-6 shadow-[0_14px_36px_-18px_rgba(58,54,48,0.3)] backdrop-blur-sm sm:px-8"
        >
          <p className="text-sm font-medium leading-relaxed text-ink lg:text-base">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
            kami.
          </p>

          <div className="my-5 flex justify-center">
            <OrnateDivider className="h-5 w-40" />
          </div>

          <p className="text-xs font-bold tracking-[0.15em] text-ink/80">
            KEPADA YTH.
          </p>
          <p className="mt-1 text-lg font-bold text-burgundy">{guestName}</p>
        </motion.div>

        <motion.div
          variants={wreathVariant}
          className="relative mt-9 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
        >
          <WreathFrame className="absolute inset-0 h-full w-full" />
          <div className="relative z-10 flex flex-col items-center px-6">
            <SparkleIcon className="h-4 w-4" />
            <p className="mt-2 text-[11px] font-semibold leading-relaxed tracking-[0.15em] text-ink">
              WASSALAMU&apos;ALAIKUM
              <br />
              WARAHMATULLAHI
              <br />
              WABARAKATUH
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-9">
          <p className="font-script text-4xl font-semibold text-ink lg:text-5xl">
            {brideName}
          </p>
          <motion.div
            variants={lineGrow}
            className="mx-auto my-2 h-px w-16 origin-center bg-mustard/50"
          />
          <p className="font-script text-2xl font-semibold text-burgundy lg:text-3xl">
            &amp;
          </p>
          <motion.div
            variants={lineGrow}
            className="mx-auto my-2 h-px w-16 origin-center bg-mustard/50"
          />
          <p className="font-script text-4xl font-semibold text-ink lg:text-5xl">
            {groomName}
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-10 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] text-ink/60"
        >
          DIBUAT DENGAN
          <HeartIcon className="h-3 w-3" />
          UNTUK HARI BAHAGIA KAMI
        </motion.p>
      </motion.div>
    </section>
  );
}
