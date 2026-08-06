"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface EventSectionProps {
  venueName?: string;
  venueAddress?: string;
  mapsUrl?: string;
  akadTime?: string;
  resepsiTime?: string;
  date?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

const fireflies = [
  { left: "9%", top: "20%", duration: 7, delay: 0 },
  { left: "20%", top: "72%", duration: 8.5, delay: 1.5 },
  { left: "87%", top: "22%", duration: 7.5, delay: 3 },
  { left: "91%", top: "68%", duration: 9, delay: 2 },
  { left: "50%", top: "10%", duration: 8, delay: 4.5 },
] as const;

const butterflies = [
  { left: "7%", top: "38%", color: "var(--coral)", duration: 18, delay: 0 },
  { left: "89%", top: "48%", color: "var(--burgundy)", duration: 20, delay: 5 },
] as const;

const floatingPetals = [
  { left: "13%", size: 6, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "79%", size: 7, duration: 13, delay: 4, color: "var(--sage-light)" },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

const MiniFlower = memo(function MiniFlower({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <g transform="translate(20, 20)">
        {ANGLES_5.map((deg) => (
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
  );
});

const ClockIcon = memo(function ClockIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5.2l3.6 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const PinIcon = memo(function PinIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.13 11.34 7.43 11.6a.9.9 0 0 0 1.14 0C12.87 21.34 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 160 20" className={className} fill="none">
      <line
        x1="0"
        y1="10"
        x2="62"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="98"
        y1="10"
        x2="160"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(80, 10)">
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

const AgendaCard = memo(function AgendaCard({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{ willChange: "transform, opacity" }}
      className="flex flex-1 flex-col items-center rounded-2xl border border-sage/40 bg-blush/15 px-4 py-5"
    >
      <p className="font-script text-2xl font-semibold text-burgundy lg:text-3xl">
        {title}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-ink">
        <ClockIcon className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold sm:text-sm">{time}</span>
      </div>
    </motion.div>
  );
});

export default function EventSection({
  venueName = "Grand Hyatt Jakarta",
  venueAddress = "Jl. M.H. Thamrin Kav. 28-30, Menteng, Jakarta Pusat 10350",
  mapsUrl = "https://maps.google.com/?q=Grand+Hyatt+Jakarta",
  akadTime = "08:00 - 10:00 WIB",
  resepsiTime = "11:00 - 14:00 WIB",
  date = "Sabtu, 12 Desember 2026",
}: EventSectionProps) {
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

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
        >
          WAKTU &amp; TEMPAT
        </motion.span>

        <motion.div variants={fadeUp} className="mt-4 flex items-center gap-3">
          <MiniFlower className="h-5 w-5" />
          <p className="text-sm font-bold tracking-[0.1em] text-ink">{date}</p>
          <MiniFlower className="h-5 w-5" />
        </motion.div>

        <motion.div
          variants={cardPop}
          style={{ willChange: "transform, opacity" }}
          className="mt-9 w-full rounded-3xl border border-sage/30 bg-ivory px-5 py-8 shadow-[0_16px_40px_-18px_rgba(58,54,48,0.35)] sm:px-8"
        >
          <motion.div
            variants={container}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <AgendaCard title="Akad Nikah" time={akadTime} />
            <AgendaCard title="Resepsi" time={resepsiTime} />
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center">
            <OrnateDivider className="my-6 h-4 w-40" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            className="flex flex-col items-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/15 text-burgundy">
              <PinIcon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-base font-bold text-ink">{venueName}</p>
            <p className="mt-1 max-w-xs text-xs font-medium leading-relaxed text-ink/80">
              {venueAddress}
            </p>
          </motion.div>

          <motion.a
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blush-dark px-8 py-3 text-xs font-bold tracking-[0.2em] text-white shadow-md transition hover:scale-105"
          >
            <PinIcon className="h-3.5 w-3.5" />
            LIHAT LOKASI
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
