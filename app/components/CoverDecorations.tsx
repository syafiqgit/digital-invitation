"use client";

import { memo } from "react";
import { m, type Transition, type Variants } from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

export const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease,
});

/* ---------- VARIANTS (Optimized Entrance) ---------- */
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.2 },
  },
};

const borderFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.3 },
  },
};

const glowVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.1 },
  },
};

export const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -2 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 22 },
  },
};

/* ---------- DATA STATIS ORNAMEN ---------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    swayOrigin: "top",
    swayRange: 1.2,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className:
      "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    swayOrigin: "top",
    swayRange: 1.2,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className:
      "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "",
    swayOrigin: "left",
    swayRange: 1,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className:
      "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    swayOrigin: "left",
    swayRange: 1,
  },
];

const corners = [
  {
    key: "bl",
    position: "bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4",
    flip: "",
    fadeDelay: 0,
    swayOrigin: "bottom left",
  },
  {
    key: "br",
    position: "bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.05,
    swayOrigin: "bottom right",
  },
  {
    key: "tl",
    position: "top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.1,
    swayOrigin: "top left",
  },
  {
    key: "tr",
    position: "top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.15,
    swayOrigin: "top right",
  },
];

const sparkles = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "88%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "12%" },
  { top: "88%", left: "82%" },
];

const butterflies = [
  {
    key: "bf-1",
    src: "/assets/butterfly-1.png",
    top: "22%",
    left: "16%",
    size: 26,
    duration: 9,
    delay: 0,
    xRange: [0, 14, -6, 0],
    yRange: [0, -10, -4, 0],
    rotateRange: [0, 6, -4, 0],
  },
  {
    key: "bf-2",
    src: "/assets/butterfly-2.png",
    top: "70%",
    left: "82%",
    size: 22,
    duration: 11,
    delay: 1.5,
    xRange: [0, -12, 8, 0],
    yRange: [0, -8, 6, 0],
    rotateRange: [0, -5, 5, 0],
  },
];

// Kelopak jatuh: posisi horizontal & timing di-variasikan per item supaya
// tidak terlihat serentak/mekanis. Animasi tetap CSS keyframes murni (bukan
// Framer Motion), cuma elemen visual di dalamnya sekarang <Image>.
const petals = [
  { left: "8%", size: 16, duration: 9, delay: 0, drift: 18 },
  { left: "30%", size: 13, duration: 11, delay: 2.5, drift: -14 },
  { left: "68%", size: 17, duration: 10, delay: 1, drift: 12 },
  { left: "90%", size: 14, duration: 12, delay: 4, drift: -20 },
];

/* ---------- SVGs (Shared) ---------- */
export const Sparkle = memo(({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
  </svg>
));

export const MiniFlower = memo(({ className = "" }: { className?: string }) => (
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
));

export const FlourishDivider = memo(
  ({ className = "" }: { className?: string }) => (
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
  ),
);

/* ---------- EXPORTED COMPOSITIONS ---------- */
export const CoverBackground = memo(function CoverBackground() {
  return (
    <>
      <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.16]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.035]"
      >
        <span className="font-script text-[16rem] leading-none text-ink sm:text-[19rem] md:text-[22rem]">
          A
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
        <Image
          src="/assets/garden-scatter-bg.webp"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="pointer-events-none object-cover"
          style={{ filter: "saturate(1.15) contrast(1.06)" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-3 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_72%)] blur-2xl sm:h-90 sm:w-90 md:h-105 md:w-105"
      />
    </>
  );
});

export const CoverOrnaments = memo(function CoverOrnaments() {
  return (
    <>
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-3 z-2 rounded-2xl border border-mustard/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] sm:inset-5 md:inset-6"
      />
      <m.div
        variants={borderFade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="pointer-events-none absolute inset-5 z-2 hidden rounded-[1.4rem] border border-dashed border-mustard/20 sm:block sm:inset-7 md:inset-8"
      />
      <m.div
        variants={glowVariant}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute left-1/2 top-1/2 z-2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl xs:h-64 xs:w-64 sm:h-72 sm:w-72 md:h-88 md:w-88 lg:h-104 lg:w-104"
      >
        <div className="h-full w-full rounded-full bg-blush/40" />
      </m.div>

      {vines.map((v, i) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          animate="show"
          className={`pointer-events-none z-2 ${v.className} ${v.flip}`}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: v.swayOrigin }}
            animate={{ rotate: [0, v.swayRange, 0, -v.swayRange, 0] }}
            transition={loop(7 + i * 0.6, i * 0.4)}
          >
            <FloralVine
              orientation={v.orientation}
              className="h-full w-full"
              tileSize={360}
            />
          </m.div>
        </m.div>
      ))}

      {corners.map((c) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          animate="show"
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 ${c.position}`}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: c.swayOrigin }}
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={loop(6, c.fadeDelay * 2)}
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {/* Kupu-kupu: posisi absolute di titik awal, gerak lewat translate+rotate
          keyframes pada m.div wrapper. Sekarang pakai <Image> statis (bukan
          SVG dengan flap animation terpisah) — lihat catatan di bawah soal
          kenapa flap dihilangkan. z-4: di atas vine/corner, di bawah konten
          utama (z-20). */}
      {butterflies.map((b) => (
        <m.div
          key={b.key}
          className="pointer-events-none absolute z-4"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            x: b.xRange,
            y: b.yRange,
            rotate: b.rotateRange,
          }}
          transition={loop(b.duration, b.delay)}
        >
          {/* Wrapper terpisah khusus untuk flap sayap (scaleY), supaya tidak
              bentrok dengan animate x/y/rotate di wrapper luar (posisi
              terbang). transformOrigin di tengah supaya scaleY terlihat
              seperti "mengepak" dari badan, bukan menyusut dari salah satu
              sisi. Ini simulasi kasar (bukan flap sayap kiri/kanan
              independen) — lihat catatan di respons sebelumnya soal
              trade-off vs sprite sheet. */}
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: "center" }}
            animate={{ scaleY: [1, 0.55, 1] }}
            transition={loop(0.5, b.delay * 0.3)}
          >
            <Image
              src={b.src}
              alt=""
              fill
              sizes={`${b.size}px`}
              className="pointer-events-none select-none object-contain"
              draggable={false}
            />
          </m.div>
        </m.div>
      ))}

      {/* Kelopak jatuh: CSS keyframes murni (bukan Framer Motion) — sama pola
          seperti sparkle, supaya tidak nambah beban JS thread. Sekarang pakai
          <Image> statis, animasi transform/opacity tidak berubah. */}
      {petals.map((p, i) => (
        <div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-0 z-4"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `cover-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
            ["--petal-drift" as string]: `${p.drift}px`,
          }}
        >
          <Image
            src="/assets/flower-petal.png"
            alt=""
            fill
            sizes={`${p.size}px`}
            className="pointer-events-none select-none object-contain"
            draggable={false}
          />
        </div>
      ))}

      {/* Sparkles statis dengan keyframes CSS murni agar GPU tidak terbebani loop JS */}
      {sparkles.map((s, i) => (
        <div
          key={`sp-${i}`}
          className="pointer-events-none absolute z-10"
          style={{
            top: s.top,
            left: s.left,
            animation: `cover-twinkle ${2.6 + (i % 3) * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          <Sparkle className="h-3 w-3 opacity-90 sm:h-4 sm:w-4" />
        </div>
      ))}
      <style>{`
        @keyframes cover-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes cover-petal-fall {
          0% { opacity: 0; transform: translate(0, -10%) rotate(0deg); }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { opacity: 0; transform: translate(var(--petal-drift), 115vh) rotate(340deg); }
        }
      `}</style>
    </>
  );
});
