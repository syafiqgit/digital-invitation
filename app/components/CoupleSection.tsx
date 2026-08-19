"use client";

import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import Image from "next/image";
import { memo } from "react";
import BackgroundPattern from "./BackgroundPattern";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import FloatingDecorations from "./FloatingDecorations";

const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

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

/* -------------------------------------------------------------------------- */
/*                                TYPES                                       */
/* -------------------------------------------------------------------------- */
interface CoupleSectionProps {
  groomName?: string;
  groomFullName?: string;
  groomParents?: string;
  brideName?: string;
  brideFullName?: string;
  brideParents?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
}

interface ArchPortraitProps {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
  floatDelay?: number;
  priority?: boolean;
}

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Class ukuran wrapper foto bride/groom — sebelumnya diduplikasi 2x. */
const PORTRAIT_WRAPPER_CLASS =
  "flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] md:max-w-[13rem] lg:max-w-[16rem]";

/* -------------------------------------------------------------------------- */
/*                           MOTION VARIANTS (STATIC)                         */
/* -------------------------------------------------------------------------- */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.2 },
  },
};

const textLift = {
  strong: {
    textShadow:
      "0 1px 4px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.85)",
  },
  soft: {
    textShadow:
      "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  VINES & CORNERS — sway animation dipindah dari framer `animate` (JS/rAF   */
/*  loop tak berhenti) ke CSS keyframes, konsisten dengan animasi loop lain   */
/*  di file ini (float, badge-spin, amp-scale) dan lebih ringan di main       */
/*  thread + GPU-composited.                                                 */
/* -------------------------------------------------------------------------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    swayOrigin: "top",
    swayVar: "7s 0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className:
      "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    swayOrigin: "top",
    swayVar: "7.6s 0.4s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className:
      "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "",
    swayOrigin: "left",
    swayVar: "8.2s 0.8s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className:
      "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    swayOrigin: "left",
    swayVar: "8.8s 1.2s",
  },
];

const corners = [
  {
    key: "bl",
    position: "bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4",
    flip: "",
    fadeDelay: 0,
    swayOrigin: "bottom left",
    swayVar: "6s 0s",
  },
  {
    key: "br",
    position: "bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.05,
    swayOrigin: "bottom right",
    swayVar: "6s 0.1s",
  },
  {
    key: "tl",
    position: "top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.1,
    swayOrigin: "top left",
    swayVar: "6s 0.2s",
  },
  {
    key: "tr",
    position: "top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.15,
    swayOrigin: "top right",
    swayVar: "6s 0.3s",
  },
];

/* -------------------------------------------------------------------------- */
/*                           DECOR PIECES COMPONENTS                          */
/* -------------------------------------------------------------------------- */
export const Monogram = memo(function Monogram({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-linear-to-br from-blush via-blush-dark/70 to-burgundy/55"
    >
      <span className="font-script text-3xl text-white drop-shadow-md sm:text-4xl lg:text-6xl">
        {initial}
      </span>
    </div>
  );
});
Monogram.displayName = "Monogram";

export const SprigDivider = memo(function SprigDivider({
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
SprigDivider.displayName = "SprigDivider";

export const CornerFlourish = memo(function CornerFlourish({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 60"
      className={className}
      fill="none"
    >
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
CornerFlourish.displayName = "CornerFlourish";

export const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      className={className}
      fill="none"
    >
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
MiniBloom.displayName = "MiniBloom";

export const MiniLeaf = memo(function MiniLeaf({
  className = "",
  rot = 0,
}: {
  className?: string;
  rot?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
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
MiniLeaf.displayName = "MiniLeaf";

export const Sparkle = memo(function Sparkle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="var(--mustard)"
    >
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
});
Sparkle.displayName = "Sparkle";

export const Butterfly = memo(function Butterfly({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 24"
      className={className}
      fill="none"
    >
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
Butterfly.displayName = "Butterfly";

export const GrassSilhouette = memo(function GrassSilhouette({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
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
GrassSilhouette.displayName = "GrassSilhouette";

export const StaticWreathBand = memo(function StaticWreathBand({
  className = "",
  flip = false,
  animated = false,
}: {
  className?: string;
  flip?: boolean;
  animated?: boolean;
}) {
  const svg = (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 28"
      className={animated ? "h-full w-full" : className}
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

  if (!animated) return svg;

  return (
    <div
      className={className}
      style={{
        animation: "couple-band-sway 5s ease-in-out infinite",
        transformOrigin: "center",
      }}
    >
      {svg}
    </div>
  );
});
StaticWreathBand.displayName = "StaticWreathBand";

/* -------------------------------------------------------------------------- */
/*                              KOMPONEN PORTRAIT                             */
/* -------------------------------------------------------------------------- */
export const ArchPortrait = memo(function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
  floatDelay = 0,
  priority = false,
}: ArchPortraitProps) {
  return (
    <div className="relative flex w-full flex-col items-center text-center">
      <div
        className="relative w-full"
        style={{
          animation: `couple-portrait-float 5s ease-in-out ${floatDelay}s infinite`,
        }}
      >
        <div className="absolute -inset-[7px] rounded-t-[3.6rem] rounded-b-xl border-[1.5px] border-mustard shadow-[0_0_15px_rgba(212,175,55,0.3)] sm:-inset-2.5 sm:rounded-t-[4.3rem] lg:-inset-3 lg:rounded-t-[6.6rem] lg:rounded-b-3xl" />
        <div className="absolute -inset-[3px] rounded-t-[3.4rem] rounded-b-lg border border-mustard/70 sm:-inset-1 sm:rounded-t-[4rem] lg:-inset-1.5 lg:rounded-t-[6.3rem] lg:rounded-b-2xl" />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(58,54,48,0.4)] ring-1 ring-white/70 sm:rounded-t-[4.2rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={displayName || "Portrait"}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 16rem, (min-width: 640px) 10rem, 38vw"
              className="object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/50 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>

        <div className="pointer-events-none absolute -bottom-[18%] left-1/2 z-20 w-[130%] -translate-x-1/2 sm:-bottom-[22%] lg:-bottom-[24%]">
          <Image
            src="/assets/garland.png"
            alt=""
            width={900}
            height={529}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <div
          className={`pointer-events-none absolute -top-2 z-30 h-5 w-5 opacity-90 sm:-top-3 sm:h-6 sm:w-6 lg:-top-4 lg:h-8 lg:w-8 ${
            align === "left" ? "-left-1 sm:-left-2" : "-right-1 sm:-right-2"
          }`}
        >
          <MiniLeaf
            rot={align === "left" ? -30 : 30}
            className="h-full w-full drop-shadow-sm"
          />
        </div>
      </div>

      <p
        className="font-script mt-12 text-2xl font-semibold leading-none text-balance break-words text-ink sm:mt-16 sm:text-4xl lg:mt-20 lg:text-5xl"
        style={textLift.strong}
      >
        {displayName}
      </p>
      <span className="mt-1.5 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-balance text-ink lg:mt-2 lg:text-[13px]"
        style={textLift.soft}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[11px] font-medium leading-relaxed text-balance text-ink/90 lg:mt-2.5 lg:text-[12px]"
        style={textLift.soft}
      >
        {align === "left" ? "Daughter of" : "Son of"}
        <br />
        {parents}
      </p>
    </div>
  );
});
ArchPortrait.displayName = "ArchPortrait";

/* -------------------------------------------------------------------------- */
/*  STYLES — semua loop animation (float, badge, amp-scale, band-sway, vine   */
/*  & corner sway) sekarang konsisten pakai CSS keyframes, tidak ada lagi     */
/*  framer `animate` JS loop untuk vines/corners.                            */
/* -------------------------------------------------------------------------- */
const COUPLE_STYLES = `
  @keyframes couple-portrait-float {
    0%, 100% { transform: translateY(-3px); }
    50% { transform: translateY(3px); }
  }
  @keyframes couple-badge-spin-l {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(15deg); }
  }
  @keyframes couple-badge-spin-r {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg); }
  }
  @keyframes couple-amp-scale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes couple-band-sway {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(1deg); }
  }
  @keyframes couple-vine-sway {
    0%, 50%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(1.2deg); }
    75% { transform: rotate(-1.2deg); }
  }
  @keyframes couple-corner-sway {
    0%, 50%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(1.5deg); }
    75% { transform: rotate(-1.5deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .couple-anim-float,
    .couple-anim-sway {
      animation: none !important;
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                MAIN SECTION                                */
/* -------------------------------------------------------------------------- */
function CoupleSectionInner({
  groomName = "Alexander",
  groomFullName = "Alexander",
  groomParents = "Mr. ... & Mrs. ...",
  brideName = "Amelia",
  brideFullName = "Amelia",
  brideParents = "Mr. ... & Mrs. ...",
  groomPhotoUrl = DEFAULT_GROOM_PHOTO,
  bridePhotoUrl = DEFAULT_BRIDE_PHOTO,
}: CoupleSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-ivory px-4 pt-28 pb-24 xs:px-5 sm:px-6 sm:pt-36 sm:pb-32 md:pt-40 md:pb-36">
      <style dangerouslySetInnerHTML={{ __html: COUPLE_STYLES }} />

      {/* 1. BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>

      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] opacity-70 lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] opacity-70 lg:h-72 lg:w-72" />

      {/* 2. ORNAMENTS & DECORATIONS */}
      <FloatingDecorations />

      {vines.map((v) => {
        const [duration, delay] = v.swayVar.split(" ");
        return (
          <m.div
            key={v.key}
            variants={vineFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`pointer-events-none absolute z-2 ${v.className} ${v.flip}`}
          >
            <div
              className="couple-anim-sway h-full w-full"
              style={{
                transformOrigin: v.swayOrigin,
                animation: `couple-vine-sway ${duration} ease-in-out ${delay} infinite`,
              }}
            >
              <FloralVine
                orientation={v.orientation}
                className="h-full w-full"
                tileSize={360}
              />
            </div>
          </m.div>
        );
      })}

      {corners.map((c) => {
        const [duration, delay] = c.swayVar.split(" ");
        return (
          <m.div
            key={c.key}
            variants={cornerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: c.fadeDelay }}
            className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 ${c.position}`}
          >
            <div
              className="couple-anim-sway h-full w-full"
              style={{
                transformOrigin: c.swayOrigin,
                animation: `couple-corner-sway ${duration} ease-in-out ${delay} infinite`,
              }}
            >
              <FloralCorner className="h-full w-full" flip={c.flip} />
            </div>
          </m.div>
        );
      })}

      <div className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-6 w-full opacity-90 sm:block sm:h-8 lg:h-10">
        <GrassSilhouette className="h-full w-full" />
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <m.div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center xs:max-w-md sm:max-w-2xl md:max-w-3xl xl:max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* BLOK 1: Header */}
        <m.div
          variants={fadeOnly}
          className="flex flex-col items-center gap-1 text-center"
        >
          <StaticWreathBand
            animated
            className="mb-1 h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              style={{
                animation: "couple-badge-spin-l 3.4s ease-in-out infinite",
                transformOrigin: "center",
              }}
            >
              <MiniBloom
                className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
            </div>
            <span className="relative inline-block overflow-hidden rounded-full border border-mustard/60 bg-gradient-to-b from-ivory to-ivory/85 px-3.5 py-1 text-[9px] font-extrabold tracking-[0.3em] text-burgundy shadow-[0_2px_10px_rgba(58,54,48,0.08)] backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.34em]">
              THE BRIDE &amp; GROOM
            </span>
            <div
              style={{
                animation: "couple-badge-spin-r 3.7s ease-in-out infinite",
                transformOrigin: "center",
              }}
            >
              <MiniBloom
                className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
            </div>
          </div>

          <p
            className="font-script mt-3 max-w-[16rem] rounded-2xl bg-ivory/80 px-3 py-1.5 text-base font-semibold leading-snug text-ink backdrop-blur-[2px] xs:max-w-[18rem] xs:text-lg sm:mt-4 sm:max-w-md sm:text-2xl lg:mt-5 lg:text-3xl"
            style={{ textShadow: "0 1px 6px rgba(255,255,255,0.9)" }}
          >
            With joyful hearts, we warmly invite you
          </p>

          <SprigDivider className="mt-2 h-4 w-28 xs:w-32 sm:mt-3 sm:w-40 lg:mt-4 lg:h-5 lg:w-44" />
        </m.div>

        {/* BLOK 2: Area Foto */}
        <m.div
          variants={fadeOnly}
          className="relative mt-5 flex w-full flex-row items-end justify-center gap-2 sm:mt-8 sm:gap-4 md:mt-10 md:gap-5 lg:gap-6"
          style={{ paddingInline: "clamp(0.75rem, 6vw, 3rem)" }}
        >
          <div className={PORTRAIT_WRAPPER_CLASS}>
            <ArchPortrait
              displayName={brideName}
              fullName={brideFullName}
              parents={brideParents}
              photoUrl={bridePhotoUrl}
              align="left"
              floatDelay={0}
              priority
            />
          </div>

          <div className="relative z-20 mb-6 w-14 shrink-0 sm:mb-10 sm:w-24 md:mb-11 md:w-32 lg:mb-12 lg:w-40">
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 opacity-70 blur-xl" />
            <WreathFrame className="relative z-10 w-full" />

            <div
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: `${WREATH_HOLE.centerLeftPct}%`,
                top: `${WREATH_HOLE.centerTopPct}%`,
                width: `${WREATH_HOLE.widthPct - 20}%`,
                height: `${WREATH_HOLE.heightPct - 20}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="font-script block text-sm font-semibold leading-none text-burgundy sm:text-2xl lg:text-4xl"
                  style={{
                    textShadow: "0 2px 10px rgba(255,255,255,0.8)",
                    display: "inline-block",
                    animation: "couple-amp-scale 3s ease-in-out infinite",
                  }}
                >
                  &amp;
                </span>
              </div>
            </div>
          </div>

          <div className={PORTRAIT_WRAPPER_CLASS}>
            <ArchPortrait
              displayName={groomName}
              fullName={groomFullName}
              parents={groomParents}
              photoUrl={groomPhotoUrl}
              align="right"
              floatDelay={-2.5}
            />
          </div>
        </m.div>

        {/* BLOK 3: Pembatas Bawah */}
        <m.div variants={fadeOnly} className="mt-9 sm:mt-12 lg:mt-16">
          <StaticWreathBand
            flip
            animated
            className="h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
          />
        </m.div>
      </m.div>
    </section>
  );
}

export default function CoupleSection(props: CoupleSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoupleSectionInner {...props} />
    </LazyMotion>
  );
}
