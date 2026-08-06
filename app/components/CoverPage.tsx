"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import WreathFrame from "./WreathFrame";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.5 },
  },
};

const borderFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.6 },
  },
};

const glowVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: "easeOut", delay: 0.3 },
  },
};

const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, rotate: -6 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 130, damping: 16 },
  },
};

const textLift = {
  textShadow:
    "0 1px 3px rgba(255,255,255,0.9), 0 1px 14px rgba(255,255,255,0.7)",
} as const;

const petals = [
  { left: "8%", size: 8, duration: 9, delay: 0, color: "var(--blush-dark)" },
  { left: "22%", size: 6, duration: 11, delay: 2, color: "var(--sage-light)" },
  { left: "38%", size: 7, duration: 10, delay: 4, color: "var(--coral)" },
  { left: "65%", size: 8, duration: 9.5, delay: 3, color: "var(--burgundy)" },
  {
    left: "90%",
    size: 6,
    duration: 11.5,
    delay: 2.5,
    color: "var(--sage-light)",
  },
] as const;

const stars = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "78%", left: "18%" },
  { top: "88%", left: "82%" },
] as const;

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-10 opacity-90 sm:w-12 lg:w-14",
    flip: "",
    delay: 0,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-10 opacity-90 sm:w-12 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-10 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "",
    delay: 0.2,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className:
      "absolute bottom-0 left-0 h-10 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
  },
];

const corners = [
  {
    key: "top-left",
    position: "left-0 top-0",
    fadeDelay: 0,
    floatDelay: 0,
    floatY: -6,
    flip: "",
  },
  {
    key: "top-right",
    position: "right-0 top-0",
    fadeDelay: 0.15,
    floatDelay: 0.5,
    floatY: -6,
    flip: "-scale-x-100",
  },
  {
    key: "bottom-left",
    position: "bottom-0 left-0",
    fadeDelay: 0.3,
    floatDelay: 0.3,
    floatY: 6,
    flip: "-scale-y-100",
  },
  {
    key: "bottom-right",
    position: "bottom-0 right-0",
    fadeDelay: 0.45,
    floatDelay: 0.8,
    floatY: 6,
    flip: "-scale-x-100 -scale-y-100",
  },
];

const MiniFlower = memo(function MiniFlower({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <g transform="translate(20, 20)">
        {[0, 72, 144, 216, 288].map((deg) => (
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

const FlourishDivider = memo(function FlourishDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 24" className={className} fill="none">
      <line
        x1="0"
        y1="12"
        x2="80"
        y2="12"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="120"
        y1="12"
        x2="200"
        y2="12"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <g transform="translate(100, 12)">
        {[0, 72, 144, 216, 288].map((deg) => (
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

export default function CoverPage({
  guestName = "Tamu Undangan",
  onOpen,
}: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
      >
        <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" />

        <motion.div
          variants={borderFade}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute inset-4 z-0 rounded-sm border border-sage/30 sm:inset-6"
        />

        {vines.map((v) => (
          <motion.div
            key={v.key}
            variants={vineFade}
            initial="hidden"
            animate="show"
            transition={{ delay: v.delay }}
            className={`pointer-events-none z-0 ${v.className} ${v.flip}`}
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </motion.div>
        ))}

        <motion.div
          variants={glowVariant}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl lg:h-112 lg:w-md"
        />

        {petals.map((p, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute top-[-5%] z-10"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "105vh"],
              x: [0, 20, -12, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.6, 0.6, 0],
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
            key={i}
            className="pointer-events-none absolute z-10"
            style={{ top: s.top, left: s.left }}
          >
            <motion.div
              animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.15, 0.6] }}
              transition={{
                duration: 2.8 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.35,
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="var(--mustard)"
              >
                <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        {corners.map((c) => (
          <motion.div
            key={c.key}
            variants={cornerFade}
            initial="hidden"
            animate="show"
            transition={{ delay: c.fadeDelay }}
            className={`pointer-events-none absolute ${c.position} z-10 h-28 w-28 opacity-80 sm:h-40 sm:w-40 lg:h-52 lg:w-52`}
          >
            <motion.div
              animate={{ y: [0, c.floatY, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: c.floatDelay,
              }}
              className="h-full w-full"
            >
              <FloralCorner className={`h-full w-full ${c.flip}`} />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-20 flex w-full max-w-sm flex-col items-center px-8 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full border border-mustard/60 bg-ivory px-5 py-1.5 text-xs font-bold tracking-[0.3em] text-burgundy shadow-sm"
          >
            UNDANGAN PERNIKAHAN
          </motion.span>

          <motion.div
            variants={wreathVariant}
            className="relative mt-6 flex h-56 w-56 items-center justify-center lg:h-80 lg:w-80"
          >
            <WreathFrame className="absolute inset-0 h-full w-full" />
            <div className="relative z-10 flex flex-col items-center">
              <p
                className="font-script whitespace-nowrap text-4xl font-semibold leading-tight text-ink lg:text-6xl"
                style={textLift}
              >
                Amelia
              </p>
              <p
                className="font-script my-1 text-2xl font-semibold text-burgundy lg:text-4xl"
                style={textLift}
              >
                &amp;
              </p>
              <p
                className="font-script whitespace-nowrap text-4xl font-semibold leading-tight text-ink lg:text-6xl"
                style={textLift}
              >
                Alexander
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-2.5 rounded-2xl border border-mustard/40 bg-ivory px-5 py-3 shadow-sm sm:gap-3"
          >
            <MiniFlower className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold tracking-[0.15em] text-ink sm:text-sm">
              SABTU
            </span>
            <span className="font-script text-3xl font-bold text-burgundy">
              12
            </span>
            <span className="text-xs font-bold tracking-[0.15em] text-ink sm:text-sm">
              DESEMBER 2026
            </span>
            <MiniFlower className="h-5 w-5 shrink-0" />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 w-40">
            <FlourishDivider className="h-4 w-full" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-6 w-full rounded-2xl border border-sage/30 bg-ivory px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-[0.08em] text-ink/70">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="mt-1.5 wrap-break-word text-xl font-bold leading-snug text-ink">
              {guestName}
            </p>
          </motion.div>

          {!isOpening && (
            <motion.div variants={fadeUp} className="mt-8">
              <button
                type="button"
                onClick={handleOpen}
                className="rounded-full bg-blush-dark px-10 py-3.5 text-xs font-bold tracking-[0.25em] text-white shadow-md transition hover:scale-105"
              >
                BUKA UNDANGAN
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
