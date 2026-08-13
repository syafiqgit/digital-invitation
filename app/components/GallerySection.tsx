"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  type Transition,
  type Variants,
} from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface GallerySectionProps {
  photos?: string[];
}

const DEFAULT_PHOTOS = [
  "https://picsum.photos/id/1015/800/1000",
  "https://picsum.photos/id/1016/800/600",
  "https://picsum.photos/id/1018/800/1000",
  "https://picsum.photos/id/1025/800/800",
  "https://picsum.photos/id/1041/800/1000",
  "https://picsum.photos/id/1062/800/600",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GPU_HINT = { willChange: "transform, opacity" } as const;
const GPU_HINT_OPACITY = { willChange: "opacity" } as const;
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({ duration, delay, repeat: Infinity, ease });

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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const textLift = {
  textShadow:
    "0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data (trimmed for performance) ---------- */

const scatterItems = [
  { top: "8%", left: "10%", type: "bloom", color: "var(--burgundy)" },
  { top: "20%", left: "90%", type: "leaf", rot: 25 },
  { top: "72%", left: "8%", type: "leaf", rot: -30 },
  { top: "90%", left: "88%", type: "bloom", color: "var(--burgundy)" },
] as const;

const sparkles = [
  { top: "12%", left: "22%", duration: 3.2, delay: 0 },
  { top: "62%", left: "20%", duration: 3.4, delay: 1 },
  { top: "84%", left: "76%", duration: 4, delay: 0.3 },
];

const fireflies = [
  { left: "20%", bottom: "15%", duration: 7, delay: 0 },
  { left: "80%", bottom: "35%", duration: 8.5, delay: 1.5 },
  { left: "12%", bottom: "70%", duration: 7.5, delay: 3 },
];

const petals = [
  { left: "35%", size: 15, duration: 9, delay: 5, color: "var(--coral)" },
  { left: "85%", size: 12, duration: 14, delay: 3, color: "var(--coral)" },
];

const butterflies = [
  { left: "10%", top: "18%", color: "var(--coral)", duration: 16, delay: 0 },
];

const goldDusts = [
  { left: "15%", bottom: "5%", size: 4, duration: 14, delay: 0 },
  { left: "85%", bottom: "8%", size: 5, duration: 15, delay: 1 },
];

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
    delay: 0,
    sway: makeSway(1.1, 7.4, "top center"),
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    sway: makeSway(1.1, 8, "top center", true),
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
    delay: 0.2,
    sway: makeSway(0.7, 8.6, "left center"),
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    sway: makeSway(0.7, 9.2, "left center", true),
  },
];

const vineTransitions = vines.map((v) => loop(v.sway.duration, v.delay + 0.5));

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: makeSway(1.8, 6.6, "top left"),
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: makeSway(1.8, 7.1, "top right", true),
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: makeSway(1.8, 6.9, "bottom left"),
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: makeSway(1.8, 7.4, "bottom right", true),
  },
];

const cornerTransitions = corners.map((c) =>
  loop(c.sway.duration, c.fadeDelay + 0.5),
);

const cornerOrnaments = [
  {
    cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
    rotate: "",
    delay: 0.4,
    duration: 3.6,
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
    delay: 0.9,
    duration: 3.9,
  },
];

/* ---------- Small presentational pieces ---------- */

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

/* Static, non-rotating glow — replaces the previous rotating conic-gradient */
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10)_0%,transparent_70%)] blur-2xl lg:h-[620px] lg:w-[620px]"
    />
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
    </svg>
  );
});

const CloseIcon = memo(function CloseIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
});

const ChevronIcon = memo(function ChevronIcon({
  className = "",
  direction = "left",
}: {
  className?: string;
  direction?: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
      />
    </svg>
  );
});

const ZoomIcon = memo(function ZoomIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
});

/* ---------- Ambient decoration ---------- */

const AmbientDecor = memo(function AmbientDecor() {
  return (
    <div className="hidden md:contents">
      {scatterItems.map((item, i) => (
        <div
          key={`scatter-${i}`}
          style={{ top: item.top, left: item.left }}
          className="pointer-events-none absolute z-[1]"
        >
          {item.type === "bloom" ? (
            <MiniBloom className="opacity-80" color={item.color} />
          ) : (
            <MiniLeaf className="opacity-70" rot={item.rot} />
          )}
        </div>
      ))}

      {sparkles.map((s, i) => (
        <div
          key={`sparkle-${i}`}
          className="pointer-events-none absolute z-[1] animate-[twinkle_var(--d)_ease-in-out_infinite]"
          style={
            {
              top: s.top,
              left: s.left,
              "--d": `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
        </div>
      ))}

      {petals.map((p, i) => (
        <div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-[-5%] z-[1] animate-[petal-fall-rev_var(--d)_linear_infinite]"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--d": `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
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
        </div>
      ))}

      {goldDusts.map((g, i) => (
        <div
          key={`gd-${i}`}
          className="pointer-events-none absolute z-[15] animate-[gold-rise_var(--d)_linear_infinite]"
          style={
            {
              left: g.left,
              bottom: g.bottom,
              width: g.size,
              height: g.size,
              "--d": `${g.duration}s`,
              animationDelay: `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-gradient-to-tr from-mustard to-yellow-200 blur-[1px] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
      ))}

      {fireflies.map((f, i) => (
        <div
          key={`firefly-${i}`}
          className="pointer-events-none absolute z-[1] h-1.5 w-1.5 animate-[firefly-drift_var(--d)_ease-in-out_infinite] lg:h-2 lg:w-2"
          style={
            {
              left: f.left,
              bottom: f.bottom,
              "--d": `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-mustard blur-[1.5px]" />
        </div>
      ))}

      {butterflies.map((b, i) => (
        <div
          key={`butterfly-${i}`}
          className="pointer-events-none absolute z-[2] h-5 w-6 animate-[butterfly-flit_var(--d)_ease-in-out_infinite] lg:h-7 lg:w-9"
          style={
            {
              left: b.left,
              top: b.top,
              "--d": `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Butterfly className="h-full w-full" color={b.color} />
        </div>
      ))}
    </div>
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v, i) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: v.delay }}
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
        >
          <m.div
            animate={{ rotate: v.sway.rotate }}
            transition={vineTransitions[i]}
            style={{ transformOrigin: v.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </m.div>
        </m.div>
      ))}

      {corners.map((c, i) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <m.div
            animate={{ rotate: c.sway.rotate }}
            transition={cornerTransitions[i]}
            style={{ transformOrigin: c.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 animate-[ornament-pulse_var(--d)_ease-in-out_infinite] sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
          style={
            {
              "--d": `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- Photo grid ---------- */

const PhotoCard = memo(function PhotoCard({
  url,
  index,
  onOpen,
}: {
  url: string;
  index: number;
  onOpen: (index: number) => void;
}) {
  return (
    <m.button
      type="button"
      variants={fadeUp}
      onClick={() => onOpen(index)}
      aria-label={`Buka foto galeri ${index + 1}`}
      className={`group relative aspect-[4/5] overflow-hidden rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-br from-ivory/95 to-white/90 p-2.5 text-left shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md transition-shadow duration-500 ease-out hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:border-mustard/70 sm:p-4 ${
        index % 2 !== 0 ? "sm:mt-8 md:mt-4" : ""
      }`}
      style={GPU_HINT}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)]" />

      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-mustard/20 shadow-inner">
        <Image
          src={url}
          alt={`Galeri ${index + 1}`}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-burgundy/60 via-ink/20 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex translate-y-4 flex-col items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ZoomIcon className="h-6 w-6 text-white opacity-90" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              Lihat
            </span>
          </div>
        </div>
      </div>
    </m.button>
  );
});

/* ---------- Lightbox ---------- */

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerElementRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerElementRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, photos.length, onClose, onNavigate]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto galeri"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-md"
    >
      <m.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-h-[85dvh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-mustard/50 bg-ivory/95 p-3 shadow-[0_25px_50px_rgba(0,0,0,0.5)] sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_30px_rgba(255,255,255,0.8)]" />

        <div className="relative mx-auto aspect-[4/5] max-h-[75dvh] w-full max-w-2xl sm:aspect-[3/4]">
          <Image
            src={photos[index]}
            alt={`Foto galeri ${index + 1} dari ${photos.length}`}
            fill
            sizes="(min-width: 640px) 640px, 90vw"
            className="rounded-xl object-contain"
            priority
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onNavigate((index - 1 + photos.length) % photos.length)
              }
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-ink shadow-lg backdrop-blur-md transition-all hover:border-burgundy hover:bg-burgundy hover:text-white sm:left-4"
            >
              <ChevronIcon direction="left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % photos.length)}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 text-ink shadow-lg backdrop-blur-md transition-all hover:border-burgundy hover:bg-burgundy hover:text-white sm:right-4"
            >
              <ChevronIcon direction="right" className="h-5 w-5" />
            </button>
            <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink/50 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
              {index + 1} / {photos.length}
            </span>
          </>
        )}

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup pratinjau"
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-ink shadow-lg backdrop-blur-md transition-all hover:border-burgundy hover:bg-burgundy hover:text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </m.div>
    </m.div>
  );
}

/* ---------- Main component ---------- */

function GallerySectionInner({ photos = DEFAULT_PHOTOS }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openAt = useCallback((index: number) => setSelectedIndex(index), []);
  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6); }
          50% { opacity: 0.85; transform: scale(1.1); }
        }
        @keyframes petal-fall-rev {
          0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          50% { transform: translate3d(-15px, 57vh, 0) rotate(-180deg); }
          90% { opacity: 0.7; }
          100% { transform: translate3d(0, 115vh, 0) rotate(-360deg); opacity: 0; }
        }
        @keyframes gold-rise {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate3d(8px, -55vh, 0); opacity: 0.4; }
          85% { opacity: 0.8; }
          100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
        }
        @keyframes firefly-drift {
          0%, 100% { transform: translate3d(0,0,0); opacity: 0; }
          25% { transform: translate3d(12px, -60px, 0); opacity: 0.9; }
          50% { transform: translate3d(-8px, -20px, 0); opacity: 0.4; }
          75% { transform: translate3d(6px, -90px, 0); opacity: 0.9; }
        }
        @keyframes butterfly-flit {
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
          25% { transform: translate3d(30px, -20px, 0) rotate(6deg); }
          50% { transform: translate3d(-15px, -5px, 0) rotate(-5deg); }
          75% { transform: translate3d(40px, -30px, 0) rotate(4deg); }
        }
        @keyframes ornament-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          section [style*="animation"], section [class*="animate-"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT_OPACITY}
      />

      <AmbientGlow />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="flex items-center gap-2 sm:gap-3"
        >
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
            transition={loop(3.4, 0.4)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
          <span className="inline-block rounded-full border border-mustard/50 bg-ivory/90 px-3 py-0.5 text-[9px] font-extrabold tracking-[0.28em] text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:py-1 sm:text-[11px] sm:tracking-[0.32em]">
            Our Gallery
          </span>
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
            transition={loop(3.7, 0.8)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
        </m.div>

        <m.p
          variants={fadeUp}
          className="font-script mt-4 text-3xl font-semibold text-ink xs:text-4xl sm:mt-5 sm:text-5xl md:text-6xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Moment of Togetherness
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mb-10 mt-4 sm:mb-14"
        >
          <SprigDivider className="h-4 w-36 opacity-80 sm:w-44" />
        </m.div>

        <m.div
          variants={containerVariants}
          className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8"
        >
          {photos.map((url, index) => (
            <PhotoCard
              key={`photo-${index}`}
              url={url}
              index={index}
              onOpen={openAt}
            />
          ))}
        </m.div>
      </m.div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={photos}
            index={selectedIndex}
            onClose={closeLightbox}
            onNavigate={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default function GallerySection(props: GallerySectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <GallerySectionInner {...props} />
    </LazyMotion>
  );
}
