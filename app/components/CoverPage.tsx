"use client";

import { memo, useCallback, useMemo, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Transition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

const GPU_HINT = { willChange: "transform, opacity" } as const;

const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease,
});

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

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.3 },
  },
};

const borderFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.4 },
  },
};

const glowVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.5, ease: "easeOut", delay: 0.2 },
  },
};

const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -4 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const textLift = {
  textShadow:
    "0 1px 3px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.7)",
} as const;

const nameTextStyle = {
  overflowWrap: "normal",
  wordBreak: "normal",
  whiteSpace: "nowrap",
} as const;

const containerQueryStyle = {
  containerType: "inline-size",
} as const;

/* ---------- Static Decoration Data ---------- */

const petals = [
  // Layer Belakang (Kecil, lambat, agak blur memberikan kesan jauh)
  {
    left: "12%",
    size: 12,
    duration: 15,
    delay: 0,
    color: "var(--blush-dark)",
    blur: "blur-[2px]",
    zIndex: "z-[5]",
  },
  {
    left: "45%",
    size: 10,
    duration: 17,
    delay: 3,
    color: "var(--burgundy)",
    blur: "blur-[3px]",
    zIndex: "z-[5]",
  },
  {
    left: "75%",
    size: 14,
    duration: 14,
    delay: 1,
    color: "var(--coral)",
    blur: "blur-[2px]",
    zIndex: "z-[5]",
  },

  // Layer Tengah (Ukuran normal, fokus tajam)
  {
    left: "25%",
    size: 18,
    duration: 12,
    delay: 2,
    color: "var(--coral)",
    blur: "blur-none",
    zIndex: "z-[10]",
  },
  {
    left: "65%",
    size: 16,
    duration: 13,
    delay: 4,
    color: "var(--sage-light)",
    blur: "blur-none",
    zIndex: "z-[10]",
  },
  {
    left: "88%",
    size: 20,
    duration: 11,
    delay: 0.5,
    color: "var(--blush-dark)",
    blur: "blur-none",
    zIndex: "z-[10]",
  },

  // Layer Depan (Ekstra besar, sangat blur, cepat, melayang di atas konten seolah melewati lensa kamera)
  {
    left: "5%",
    size: 45,
    duration: 8,
    delay: 1.5,
    color: "var(--burgundy)",
    blur: "blur-[6px]",
    zIndex: "z-[60]",
  },
  {
    left: "92%",
    size: 55,
    duration: 9,
    delay: 5,
    color: "var(--coral)",
    blur: "blur-[8px]",
    zIndex: "z-[60]",
  },
] as const;

const sparkles = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "35%", left: "15%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "12%" },
  { top: "78%", left: "18%" },
  { top: "88%", left: "82%" },
] as const;

const fireflies = [
  { left: "20%", bottom: "10%", duration: 7, delay: 0 },
  { left: "80%", bottom: "25%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "60%", duration: 8, delay: 3 },
  { left: "85%", bottom: "50%", duration: 9, delay: 2 },
  { left: "50%", bottom: "15%", duration: 7.5, delay: 4 },
];

const goldDusts = [
  { left: "15%", bottom: "-10%", size: 4, duration: 12, delay: 0 },
  { left: "45%", bottom: "-5%", size: 6, duration: 15, delay: 2 },
  { left: "75%", bottom: "-15%", size: 3, duration: 10, delay: 1 },
  { left: "85%", bottom: "-10%", size: 5, duration: 14, delay: 3 },
  { left: "25%", bottom: "-20%", size: 7, duration: 16, delay: 4 },
];

interface ButterflyConfig {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  path: number[];
  yPath: number[];
}

const butterflies: ButterflyConfig[] = [
  {
    top: "22%",
    left: "6%",
    size: 22,
    duration: 14,
    delay: 0,
    color: "var(--blush-dark)",
    path: [0, 40, 10, 55, 0],
    yPath: [0, -25, 10, -15, 0],
  },
  {
    top: "68%",
    left: "88%",
    size: 18,
    duration: 17,
    delay: 3,
    color: "var(--coral)",
    path: [0, -35, -8, -45, 0],
    yPath: [0, 20, -15, 15, 0],
  },
  {
    top: "45%",
    left: "92%",
    size: 16,
    duration: 12,
    delay: 6,
    color: "var(--burgundy)",
    path: [0, -30, 5, -20, 0],
    yPath: [0, -20, 15, -10, 0],
  },
];

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "",
    delay: 0,
    sway: makeSway(1.4, 7, "top center"),
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    sway: makeSway(1.4, 7.6, "top center", true),
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "",
    delay: 0.2,
    sway: makeSway(0.9, 8.2, "left center"),
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    sway: makeSway(0.9, 8.8, "left center", true),
  },
];

const corners = [
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: makeSway(2.2, 6.5, "bottom left"),
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: makeSway(2.2, 7, "bottom right", true),
  },
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: makeSway(2.2, 6.8, "top left"),
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: makeSway(2.2, 7.3, "top right", true),
  },
];

const cornerOrnaments = [
  {
    cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
    rotate: "-scale-y-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.6, 0.4),
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "-scale-x-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(3.9, 0.9),
  },
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "-scale-x-100 -scale-y-100",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.3, 1.4),
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(4.1, 0.2),
  },
];

/* ---------- Small Presentational Components ---------- */

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
      className="pointer-events-none absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2"
      animate={{ rotate: 360 }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
    >
      <div className="h-[350px] w-[350px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.08)_60deg,transparent_120deg,rgba(212,175,55,0.08)_180deg,transparent_240deg,rgba(212,175,55,0.08)_300deg,transparent_360deg)] blur-2xl sm:h-[450px] sm:w-[450px]" />
    </m.div>
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
        {[0, 72, 144, 216, 288].map((deg) => (
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

const Butterfly = memo(function Butterfly({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <m.svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      animate={{ scaleX: [1, 0.78, 1] }}
      transition={{
        duration: 0.35,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ transformOrigin: "center" }}
    >
      <path
        d="M16 16 C 10 4, 0 6, 2 14 C 3 20, 10 20, 16 16 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M16 16 C 22 4, 32 6, 30 14 C 29 20, 22 20, 16 16 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M16 16 C 12 22, 6 26, 8 29 C 12 30, 16 24, 16 16 Z"
        fill={color}
        opacity="0.65"
      />
      <path
        d="M16 16 C 20 22, 26 26, 24 29 C 20 30, 16 24, 16 16 Z"
        fill={color}
        opacity="0.65"
      />
      <line
        x1="16"
        y1="10"
        x2="16"
        y2="24"
        stroke="var(--ink)"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </m.svg>
  );
});

/* ---------- Main Component ---------- */

function CoverPageInner({
  guestName = "Tamu Undangan",
  onOpen,
}: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpening(true);
    onOpen();
  }, [onOpen]);

  const vineTransitions = useMemo(
    () => vines.map((v) => loop(v.sway.duration, v.delay + 0.6)),
    [],
  );
  const cornerTransitions = useMemo(
    () => corners.map((c) => loop(c.sway.duration, c.fadeDelay + 0.6)),
    [],
  );

  return (
    <AnimatePresence>
      <m.div
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" />

        {/* --- Watermark Monogram --- */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
          <span className="font-script text-[30rem] leading-none text-ink">
            A
          </span>
        </div>

        <m.div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          animate={{ scale: [1, 1.05, 1] }}
          transition={loop(30)}
          style={GPU_HINT}
        >
          <Image
            src="/assets/garden-scatter-bg.webp"
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="pointer-events-none object-cover opacity-100"
            style={{ filter: "saturate(1.2) contrast(1.1)" }}
          />
        </m.div>

        {/* Elegant Inner Border */}
        <m.div
          variants={borderFade}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute inset-3 z-[2] rounded-2xl border border-mustard/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] sm:inset-6"
        />

        {/* Vines Layer */}
        {vines.map((v, i) => (
          <m.div
            key={v.key}
            variants={vineFade}
            initial="hidden"
            animate="show"
            transition={{ delay: v.delay }}
            className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
          >
            <m.div
              animate={{ rotate: v.sway.rotate }}
              transition={vineTransitions[i]}
              style={{ transformOrigin: v.sway.origin }}
              className="h-full w-full"
            >
              <FloralVine
                orientation={v.orientation}
                className="h-full w-full"
                tileSize={360}
              />
            </m.div>
          </m.div>
        ))}

        {/* Luxurious Central Glow */}
        <m.div
          variants={glowVariant}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl sm:h-72 sm:w-72 lg:h-[28rem] lg:w-[28rem]"
        >
          <m.div
            className="h-full w-full rounded-full bg-blush/40"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={loop(5, 1.7)}
          />
        </m.div>

        {/* --- Efek Cahaya Memutar Mewah --- */}
        <MajesticRay />

        {/* Ambient Decor: Petals, Sparkles, Fireflies, Gold Dust */}
        {petals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className={`pointer-events-none absolute top-[-10%] ${p.zIndex} ${p.blur}`}
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, p.size > 20 ? 45 : 20, -15, 0], // Ayunan lebih lebar untuk layer depan
              rotate: [0, 180, 360],
              opacity: [0, 0.85, 0.85, 0],
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

        {sparkles.map((s, i) => (
          <div
            key={i}
            className="pointer-events-none absolute z-10"
            style={{ top: s.top, left: s.left }}
          >
            <m.div
              animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.6, 1.2, 0.6] }}
              transition={loop(2.8 + (i % 3), i * 0.35)}
            >
              <Sparkle className="h-3 w-3 opacity-90 sm:h-4 sm:w-4" />
            </m.div>
          </div>
        ))}

        {fireflies.map((f, i) => (
          <m.div
            key={`ff-${i}`}
            className="pointer-events-none absolute z-10 h-1.5 w-1.5 sm:h-2 sm:w-2"
            style={{ left: f.left, bottom: f.bottom }}
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

        {/* --- Partikel Emas Mewah --- */}
        {goldDusts.map((g, i) => (
          <m.div
            key={`gd-${i}`}
            className="pointer-events-none absolute z-[12]"
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
            key={i}
            className="pointer-events-none absolute z-10"
            style={{ top: b.top, left: b.left }}
            animate={{ x: b.path, y: b.yPath, opacity: [0, 0.9, 0.9, 0.9, 0] }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            <Butterfly size={b.size} color={b.color} />
          </m.div>
        ))}

        {/* Double Cornering: Luxurious Corner Flourish behind FloralCorner */}
        {cornerOrnaments.map((c, i) => (
          <div
            key={`cf-${i}`}
            className={`pointer-events-none absolute z-[15] h-14 w-14 opacity-90 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${c.cls} ${c.rotate}`}
          >
            <m.div
              animate={c.pulse}
              transition={c.transition}
              className="h-full w-full"
            >
              <CornerFlourish className="h-full w-full" />
            </m.div>
          </div>
        ))}

        {corners.map((c, i) => (
          <m.div
            key={c.key}
            variants={cornerFade}
            initial="hidden"
            animate="show"
            transition={{ delay: c.fadeDelay }}
            className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-36 sm:w-36 lg:h-48 lg:w-48 ${c.position}`}
          >
            <m.div
              animate={{ rotate: c.sway.rotate }}
              transition={cornerTransitions[i]}
              style={{ transformOrigin: c.sway.origin }}
              className="h-full w-full"
            >
              <FloralCorner className="h-full w-full" flip={c.flip} />
            </m.div>
          </m.div>
        ))}

        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          style={containerQueryStyle}
          className="relative z-20 flex w-full max-w-sm flex-col items-center px-6 text-center sm:max-w-md sm:px-8 lg:max-w-[640px]"
        >
          <m.span
            variants={fadeUp}
            className="relative inline-block rounded-full border border-mustard/60 bg-ivory/95 px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.25em] text-burgundy shadow-sm sm:px-5 sm:text-xs sm:tracking-[0.3em]"
          >
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="relative z-10">UNDANGAN PERNIKAHAN</span>
          </m.span>

          <m.div
            variants={wreathVariant}
            className="relative mt-4 w-[clamp(270px,92cqw,610px)] sm:mt-5"
          >
            <WreathFrame className="w-full drop-shadow-sm" />

            <div
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
              style={{
                left: `${WREATH_HOLE.centerLeftPct}%`,
                top: `${WREATH_HOLE.centerTopPct}%`,
                width: `${WREATH_HOLE.widthPct - 34}%`,
              }}
            >
              <p
                className="w-full font-script font-semibold leading-[0.9] text-ink"
                style={{
                  ...textLift,
                  ...nameTextStyle,
                  fontSize: "clamp(1.5rem, 5.9cqw, 2.6rem)",
                }}
              >
                Amelia
              </p>

              <m.div
                className="relative my-1"
                animate={{ scale: [1, 1.15, 1] }}
                transition={loop(2.6, 1.5)}
              >
                <p
                  className="font-script font-semibold leading-none text-burgundy"
                  style={{
                    ...textLift,
                    fontSize: "clamp(0.8rem, 2.7cqw, 1.25rem)",
                  }}
                >
                  &amp;
                </p>
                <div className="absolute -right-3 -top-1">
                  <Sparkle className="h-2 w-2 opacity-70" />
                </div>
              </m.div>

              <p
                className="w-full font-script font-semibold leading-[0.9] text-ink"
                style={{
                  ...textLift,
                  ...nameTextStyle,
                  fontSize: "clamp(1.4rem, 5.5cqw, 2.5rem)",
                }}
              >
                Alexander
              </p>
            </div>
          </m.div>

          <m.div
            variants={fadeUp}
            className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)] sm:mt-4 sm:gap-x-3 sm:px-5"
          >
            <m.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
              transition={loop(3.4, 1.2)}
              className="shrink-0"
            >
              <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
            </m.div>
            <span className="text-[0.65rem] font-bold tracking-[0.12em] text-ink sm:text-xs sm:tracking-[0.15em]">
              SABTU
            </span>
            <span className="font-script text-2xl font-bold text-burgundy sm:text-3xl">
              12
            </span>
            <span className="text-[0.65rem] font-bold tracking-[0.12em] text-ink sm:text-xs sm:tracking-[0.15em]">
              DESEMBER 2026
            </span>
            <m.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
              transition={loop(3.7, 1.6)}
              className="shrink-0"
            >
              <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
            </m.div>
          </m.div>

          <m.div variants={fadeUp} className="mt-5 w-32 sm:mt-6 sm:w-40">
            <FlourishDivider className="h-4 w-full" />
          </m.div>

          <m.div
            variants={fadeUp}
            className="relative mt-5 w-full rounded-2xl border border-mustard/40 bg-ivory/95 px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.05)] sm:mt-6 sm:px-5"
          >
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_12px_rgba(255,255,255,0.7)]" />
            <div className="relative z-10">
              <p className="text-[0.7rem] font-semibold tracking-[0.06em] text-ink/80 sm:text-xs sm:tracking-[0.08em]">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p className="mt-1.5 wrap-break-word text-lg font-bold leading-snug text-ink sm:text-xl">
                {guestName}
              </p>
            </div>
          </m.div>

          {!isOpening && (
            <m.div
              variants={fadeUp}
              className="relative mt-8 inline-block sm:mt-10"
            >
              <m.div
                className="pointer-events-none absolute inset-0 rounded-full bg-burgundy/60 blur-xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={loop(2.4, 1)}
              />
              <m.button
                type="button"
                onClick={handleOpen}
                className="relative min-h-12 rounded-full border border-mustard/60 bg-gradient-to-r from-blush-dark to-burgundy px-10 py-4 text-[0.65rem] font-bold tracking-[0.2em] text-white shadow-lg sm:px-12 sm:text-xs sm:tracking-[0.25em]"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                style={GPU_HINT}
              >
                BUKA UNDANGAN
              </m.button>
            </m.div>
          )}
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

function CoverPage(props: CoverPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoverPageInner {...props} />
    </LazyMotion>
  );
}

export default memo(CoverPage);
