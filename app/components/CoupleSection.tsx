"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface CoupleSectionProps {
  groomName?: string;
  groomFullName?: string;
  groomParents?: string;
  brideName?: string;
  brideFullName?: string;
  brideParents?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
  openingAnimation?: boolean;
}

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.35 },
  },
};

const textLift = {
  strong: {
    textShadow:
      "0 1px 2px rgba(255,255,255,0.95), 0 1px 12px rgba(255,255,255,0.85)",
  },
  soft: {
    textShadow:
      "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
  },
} as const;

const scatterItems = [
  { top: "5%", left: "8%", type: "bloom", color: "var(--burgundy)" },
  { top: "6%", left: "20%", type: "leaf", rot: -25 },
  { top: "4%", left: "80%", type: "leaf", rot: 25 },
  { top: "6%", left: "92%", type: "bloom", color: "var(--coral)" },
  { top: "80%", left: "3%", type: "bloom", color: "var(--coral)" },
  { top: "80%", left: "97%", type: "bloom", color: "var(--blush-dark)" },
  { top: "92%", left: "20%", type: "leaf", rot: 30 },
  { top: "92%", left: "80%", type: "leaf", rot: -30 },
  { top: "94%", left: "8%", type: "bloom", color: "var(--burgundy)" },
  { top: "94%", left: "92%", type: "bloom", color: "var(--coral)" },
  { top: "32%", left: "4%", type: "bloom", color: "var(--sage-light)" },
  { top: "32%", left: "96%", type: "bloom", color: "var(--sage-light)" },
  { top: "45%", left: "2%", type: "leaf", rot: -10 },
  { top: "45%", left: "98%", type: "leaf", rot: 10 },
  { top: "58%", left: "4%", type: "bloom", color: "var(--coral)" },
  { top: "58%", left: "96%", type: "bloom", color: "var(--burgundy)" },
  { top: "15%", left: "35%", type: "leaf", rot: -35 },
  { top: "15%", left: "65%", type: "leaf", rot: 35 },
  { top: "85%", left: "38%", type: "leaf", rot: 40 },
  { top: "85%", left: "62%", type: "leaf", rot: -40 },
] as const;

const sparkles = [
  { top: "12%", left: "45%" },
  { top: "22%", left: "10%" },
  { top: "20%", left: "90%" },
  { top: "70%", left: "12%" },
  { top: "72%", left: "88%" },
  { top: "88%", left: "50%" },
] as const;

const floatingPetals = [
  { left: "6%", size: 7, duration: 10, delay: 0, color: "var(--blush-dark)" },
  { left: "93%", size: 6, duration: 12, delay: 3, color: "var(--coral)" },
  { left: "50%", size: 6, duration: 11, delay: 6, color: "var(--sage-light)" },
] as const;

const butterflies = [
  { left: "10%", top: "18%", color: "var(--coral)", duration: 16, delay: 0 },
  { left: "82%", top: "26%", color: "var(--burgundy)", duration: 19, delay: 4 },
  {
    left: "48%",
    top: "68%",
    color: "var(--blush-dark)",
    duration: 17,
    delay: 8,
  },
] as const;

const fireflies = [
  { left: "14%", bottom: "10%", duration: 7, delay: 0 },
  { left: "30%", bottom: "22%", duration: 8.5, delay: 1.5 },
  { left: "70%", bottom: "14%", duration: 7.5, delay: 3 },
  { left: "86%", bottom: "26%", duration: 9, delay: 2 },
  { left: "50%", bottom: "8%", duration: 8, delay: 4.5 },
] as const;

const fairyLights = [
  { cx: 40, cy: 38 },
  { cx: 90, cy: 20 },
  { cx: 140, cy: 13 },
  { cx: 200, cy: 26 },
  { cx: 260, cy: 13 },
  { cx: 310, cy: 20 },
  { cx: 360, cy: 38 },
] as const;

const cornerOrnaments = [
  { cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8", rotate: "" },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
  },
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "rotate-90",
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "-rotate-90",
  },
] as const;

const wreathBlooms = [
  { x: 40, y: 14, s: 1, color: "var(--burgundy)" },
  { x: 95, y: 6, s: 0.8, color: "var(--coral)" },
  { x: 150, y: 16, s: 0.9, color: "var(--blush-dark)" },
  { x: 205, y: 5, s: 0.75, color: "var(--coral)" },
  { x: 260, y: 15, s: 1, color: "var(--burgundy)" },
] as const;

const wreathLeaves = [
  { x: 65, y: 12, rot: -20 },
  { x: 120, y: 4, rot: 15 },
  { x: 178, y: 12, rot: -12 },
  { x: 232, y: 4, rot: 18 },
] as const;

const grassBlades = [
  { x: 10, h: 22, rot: -8 },
  { x: 24, h: 30, rot: 4 },
  { x: 40, h: 18, rot: -12 },
  { x: 58, h: 26, rot: 6 },
  { x: 76, h: 20, rot: -4 },
  { x: 94, h: 28, rot: 10 },
  { x: 300, h: 20, rot: -6 },
  { x: 318, h: 28, rot: 8 },
  { x: 336, h: 18, rot: -10 },
  { x: 354, h: 26, rot: 5 },
  { x: 372, h: 22, rot: -3 },
  { x: 390, h: 30, rot: 9 },
] as const;

// Matches the Cover page's `vines` layout: left, right, top, bottom
// so the couple section gets the same full floral-vine border.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
  },
];

// Matches the Cover page's `corners` layout: uses FloralCorner's own
// `flip` prop instead of Tailwind scale utilities.
const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
  },
];

const Monogram = memo(function Monogram({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush via-blush-dark/70 to-burgundy/55">
      <span className="font-script text-3xl text-white drop-shadow-md sm:text-4xl lg:text-6xl">
        {initial}
      </span>
    </div>
  );
});

const PetalBadge = memo(function PetalBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <circle
        cx="20"
        cy="20"
        r="18.5"
        fill="var(--ivory)"
        stroke="var(--mustard)"
        strokeWidth="1"
      />
      <g transform="translate(20, 20)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6.5"
            rx="4.4"
            ry="8.6"
            fill="var(--burgundy)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.8" fill="var(--mustard)" />
      </g>
    </svg>
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
      <ellipse
        cx="94"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(-25 94 14)"
      />
      <ellipse
        cx="126"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(25 126 14)"
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

const Firefly = memo(function Firefly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-full bg-mustard blur-[1.5px] ${className}`} />
  );
});

const GrassSilhouette = memo(function GrassSilhouette({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      {grassBlades.map((b, i) => (
        <path
          key={i}
          d={`M${b.x} 40 Q${b.x + 2} ${40 - b.h * 0.6} ${b.x + 4} ${40 - b.h}`}
          stroke="var(--sage)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          transform={`rotate(${b.rot} ${b.x} 40)`}
        />
      ))}
    </svg>
  );
});

const ArchPortrait = memo(function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
}: {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
}) {
  return (
    <div className="relative flex w-full max-w-[8.5rem] flex-col items-center text-center sm:max-w-[10rem] lg:max-w-[16rem]">
      <div className="relative w-full">
        <div className="absolute -inset-[6px] rounded-t-[3.5rem] rounded-b-xl border border-mustard/35 sm:-inset-2 sm:rounded-t-[4.2rem] lg:-inset-[10px] lg:rounded-t-[6.5rem] lg:rounded-b-3xl" />
        <div className="relative h-[30vh] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_14px_30px_-10px_rgba(58,54,48,0.35)] ring-1 ring-white/60 sm:h-[34vh] sm:rounded-t-[4.2rem] lg:h-[22rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/40 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>
        <div
          className={`absolute h-6 w-6 sm:h-8 sm:w-8 lg:h-11 lg:w-11 ${
            align === "left"
              ? "-right-1.5 -bottom-1.5 sm:-right-2 sm:-bottom-2"
              : "-left-1.5 -bottom-1.5 sm:-left-2 sm:-bottom-2"
          }`}
        >
          <PetalBadge className="h-full w-full" />
        </div>
        <div
          className={`pointer-events-none absolute -top-2 h-5 w-5 opacity-80 sm:-top-3 sm:h-6 sm:w-6 lg:-top-4 lg:h-8 lg:w-8 ${
            align === "left" ? "-left-1 sm:-left-2" : "-right-1 sm:-right-2"
          }`}
        >
          <MiniLeaf
            rot={align === "left" ? -30 : 30}
            className="h-full w-full"
          />
        </div>
      </div>

      <p
        className="font-script mt-4 text-2xl font-semibold leading-none text-ink sm:mt-5 sm:text-4xl lg:mt-8 lg:text-5xl"
        style={textLift.strong}
      >
        {displayName}
      </p>
      <span className="mt-1.5 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink lg:mt-2 lg:text-[13px]"
        style={textLift.soft}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[11px] font-medium leading-relaxed text-ink/90 lg:mt-2.5 lg:text-[12px]"
        style={textLift.soft}
      >
        {align === "left" ? "Putri dari" : "Putra dari"}
        <br />
        {parents}
      </p>
    </div>
  );
});

export default function CoupleSection({
  groomName = "Alexander",
  groomFullName = "Alexander",
  groomParents = "Bapak ... & Ibu ...",
  brideName = "Amelia",
  brideFullName = "Amelia",
  brideParents = "Bapak ... & Ibu ...",
  groomPhotoUrl = DEFAULT_GROOM_PHOTO,
  bridePhotoUrl = DEFAULT_BRIDE_PHOTO,
  openingAnimation = true,
}: CoupleSectionProps) {
  const initialState = openingAnimation ? "hidden" : "visible";

  return (
    <section className="relative flex h-dvh min-h-[36rem] w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 sm:px-6">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-mustard/15 blur-[70px] lg:h-56 lg:w-56" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-burgundy/40 opacity-[0.14]" />

      {/* FIX: static, non-animated floral vines on all 4 sides
          (left, right, top, bottom) — matches Cover page's `vines` layout. */}
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
        >
          <FloralVine orientation={v.orientation} className="h-full w-full" />
        </div>
      ))}

      {/* FIX: static, non-animated floral corners on all 4 corners,
          using FloralCorner's own `flip` prop like the Cover page. */}
      {corners.map((c) => (
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <FloralCorner className="h-full w-full" flip={c.flip} />
        </div>
      ))}

      {/* Small compass-style corner ornaments, now static (no wiggle/fade). */}
      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="hidden sm:contents">
        {scatterItems.map((item, i) => (
          <div
            key={`scatter-${i}`}
            style={{ top: item.top, left: item.left }}
            className="pointer-events-none absolute z-[1]"
          >
            {item.type === "bloom" ? (
              <MiniBloom className="opacity-85" color={item.color} />
            ) : (
              <MiniLeaf className="opacity-80" rot={item.rot} />
            )}
          </div>
        ))}
      </div>

      <div className="hidden sm:contents">
        {sparkles.map((s, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="pointer-events-none absolute z-[1]"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.6, 1.1, 0.6] }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:contents">
        {floatingPetals.map((p, i) => (
          <motion.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-6%] z-[1]"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "112vh"],
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
                opacity="0.7"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:contents">
        {butterflies.map((b, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[2] h-4 w-5 lg:h-6 lg:w-8"
            style={{ left: b.left, top: b.top }}
            animate={{
              x: [0, 36, -18, 48, 0],
              y: [0, -26, -6, -34, 0],
              rotate: [0, 8, -6, 5, 0],
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
            style={{ left: f.left, bottom: f.bottom }}
            animate={{
              y: [0, -60, -20, -90, 0],
              x: [0, 12, -8, 6, 0],
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

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-6 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block sm:inset-8 lg:inset-12" />

      <svg
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-70"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
      >
        <path
          d="M20 40 Q 120 10, 200 40 Q 280 10, 380 40"
          stroke="var(--sage)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M20 760 Q 120 790, 200 760 Q 280 790, 380 760"
          stroke="var(--sage)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        {fairyLights.map((f, i) => (
          <g key={`fl-${i}`}>
            <circle
              cx={f.cx}
              cy={f.cy}
              r="5.5"
              fill="var(--mustard)"
              opacity="0.18"
            />
            <motion.circle
              cx={f.cx}
              cy={f.cy}
              r="2.6"
              fill="var(--mustard)"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 2.4 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </g>
        ))}
      </svg>

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-6 w-full opacity-90 sm:h-8 lg:h-10"
        style={{ transformOrigin: "bottom center" }}
        animate={{ skewX: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <GrassSilhouette className="h-full w-full" />
      </motion.div>

      <motion.div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
        initial={initialState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <motion.div
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
            >
              <StaticWreathBand className="mb-1 h-4 w-40 opacity-70 sm:h-5 sm:w-56 lg:h-6 lg:w-72" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <MiniBloom
                className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
              <span className="inline-block rounded-full border border-mustard/50 bg-ivory/90 px-3 py-0.5 text-[9px] font-extrabold tracking-[0.28em] text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:py-1 sm:text-[11px] sm:tracking-[0.32em]">
                MEMPELAI
              </span>
              <MiniBloom
                className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="font-script mt-2 max-w-[18rem] rounded-2xl bg-ivory/80 px-3 py-1.5 text-lg font-semibold text-ink backdrop-blur-[2px] sm:max-w-md sm:text-2xl lg:mt-3 lg:text-3xl"
              style={{
                textShadow: "0 1px 6px rgba(255,255,255,0.9)",
                willChange: "transform, opacity",
              }}
            >
              Dengan penuh syukur, kami mengundang Anda
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
            >
              <SprigDivider className="mt-1 h-4 w-32 sm:block lg:mt-2 lg:h-5 lg:w-44" />
            </motion.div>
          </div>

          <div className="relative mt-4 flex w-full flex-row items-end justify-center gap-3 sm:mt-6 sm:gap-5 lg:mt-10 lg:gap-8">
            <motion.div
              variants={slideFromLeft}
              style={{ willChange: "transform, opacity" }}
              className="flex w-full max-w-[8.5rem] shrink-0 sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={brideName}
                fullName={brideFullName}
                parents={brideParents}
                photoUrl={bridePhotoUrl}
                align="left"
              />
            </motion.div>

            <motion.div
              variants={popIn}
              style={{ willChange: "transform, opacity" }}
              className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-mustard bg-ivory shadow-lg sm:h-16 sm:w-16 lg:h-28 lg:w-28 lg:-translate-y-8"
            >
              <span className="absolute -inset-1 rounded-full border border-mustard/60" />
              <span className="absolute inset-[2px] rounded-full border border-sage/30 sm:inset-[3px]" />
              <span className="absolute -left-3 -top-1 h-4 w-4 opacity-70 sm:-left-4 sm:h-5 sm:w-5 lg:-left-6 lg:h-7 lg:w-7">
                <MiniLeaf rot={-40} className="h-full w-full" />
              </span>
              <span className="absolute -bottom-1 -right-3 h-4 w-4 opacity-70 sm:-right-4 sm:h-5 sm:w-5 lg:-right-6 lg:h-7 lg:w-7">
                <MiniLeaf rot={40} className="h-full w-full" />
              </span>
              <span className="font-script text-lg font-semibold text-burgundy sm:text-2xl lg:text-4xl">
                &amp;
              </span>
            </motion.div>

            <motion.div
              variants={slideFromRight}
              style={{ willChange: "transform, opacity" }}
              className="flex w-full max-w-[8.5rem] shrink-0 sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={groomName}
                fullName={groomFullName}
                parents={groomParents}
                photoUrl={groomPhotoUrl}
                align="right"
              />
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            className="mt-3 sm:mt-5 lg:mt-8"
          >
            <StaticWreathBand
              flip
              className="h-4 w-40 opacity-70 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const StaticWreathBand = memo(function StaticWreathBand({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 300 28"
      className={className}
      fill="none"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <line
        x1="0"
        y1="20"
        x2="300"
        y2="20"
        stroke="var(--sage)"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="1 5"
      />
      {wreathLeaves.map((l, i) => (
        <ellipse
          key={`wl-${i}`}
          cx={l.x}
          cy={l.y}
          rx="3.4"
          ry="6.4"
          fill="var(--sage-light)"
          stroke="var(--sage)"
          strokeWidth="0.5"
          opacity="0.75"
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
        />
      ))}
      {wreathBlooms.map((b, i) => (
        <g
          key={`wb-${i}`}
          transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}
        >
          {ANGLES_5.map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-5"
              rx="3.2"
              ry="6.2"
              fill={b.color}
              opacity="0.9"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2" fill="var(--mustard)" />
        </g>
      ))}
    </svg>
  );
});
