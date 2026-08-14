"use client";

import { memo } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

// --- INTERFACES ---
interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  photoUrl?: string;
}

interface StorySectionProps {
  milestones?: StoryMilestone[];
}

const DEFAULT_MILESTONES: StoryMilestone[] = [
  {
    date: "December 2022",
    title: "First Met",
    description:
      "Destiny brought us together through a small gathering in the same city. A simple conversation that blossomed into a meaningful smile.",
    photoUrl: "https://picsum.photos/id/1011/600/800",
  },
  {
    date: "June 2024",
    title: "Making Our Commitment",
    description:
      "After sharing countless laughs, stories, and mutual support, we decided to walk hand in hand into a serious commitment.",
    photoUrl: "https://picsum.photos/id/1025/600/800",
  },
  {
    date: "December 2025",
    title: "Heading to the Altar",
    description:
      "With the blessing of our parents and pure intentions, we pledged to embark on a new chapter as lifelong companions.",
    photoUrl: "https://picsum.photos/id/338/600/800",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- FRAMER MOTION VARIANTS (Entrance Only) ---
// NOTE: willChange permanen dihapus. viewport={{ once: true }} berarti
// animasi ini hanya jalan sekali; menahan compositor layer selamanya
// setelah itu (via willChange manual) cuma buang-buang GPU memory.
// Framer Motion sudah otomatis toggle will-change selama animasi aktif.
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

// --- STATIC DECORATION DATA (Optimized for CSS Animations) ---
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "0.7deg",
    duration: "8.6s",
    delay: "0.2s",
    isAnimated: true,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "-0.7deg",
    duration: "9.2s",
    delay: "0.3s",
    isAnimated: true,
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
    delay: "0.3s",
  },
];

// --- PRESENTATIONAL PIECES ---
const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  const ANGLES = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES.map((deg) => (
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
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
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
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className={`h-full w-full ${v.isAnimated ? "animate-sway" : ""}`}
            style={
              v.isAnimated
                ? ({
                    transformOrigin: v.origin,
                    "--end-deg": v.endDeg,
                    animationDuration: v.duration,
                    animationDelay: v.delay,
                    willChange: "transform",
                  } as React.CSSProperties)
                : undefined
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- TIMELINE COMPONENT ---------- */
const MilestoneCard = memo(function MilestoneCard({
  item,
  isEven,
}: {
  item: StoryMilestone;
  isEven: boolean;
}) {
  return (
    <m.div
      variants={fadeUp}
      className={`group relative flex w-full flex-col items-center gap-5 sm:flex-row sm:gap-0 ${
        isEven ? "sm:flex-row-reverse" : ""
      }`}
    >
      <div
        className={`ml-14 w-[calc(100%-3.5rem)] rounded-[2rem] border border-mustard/30 bg-white/80 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-shadow duration-500 ease-out hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] sm:ml-0 sm:w-[calc(50%-3rem)] sm:p-7 md:w-[calc(50%-3.5rem)] md:p-8 lg:w-[calc(50%-4rem)] lg:p-9 ${
          isEven ? "sm:mr-auto" : "sm:ml-auto"
        }`}
      >
        {item.photoUrl && (
          <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-mustard/20 bg-gray-100">
            <Image
              src={item.photoUrl}
              alt={item.title}
              fill
              loading="lazy"
              sizes="(min-width: 640px) 45vw, 80vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <span className="mb-3 inline-block rounded-full border border-mustard/50 bg-white px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-burgundy shadow-sm sm:text-xs">
          {item.date}
        </span>
        <h3 className="font-serif text-xl font-bold text-ink transition-colors duration-300 group-hover:text-burgundy sm:text-2xl md:text-[1.7rem]">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75 sm:text-base md:text-[1.05rem]">
          {item.description}
        </p>
      </div>

      <div className="absolute left-6 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-mustard/50 bg-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-burgundy/60 sm:left-1/2 sm:h-12 sm:w-12 md:h-14 md:w-14">
        <HeartIcon className="relative z-10 h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </div>
    </m.div>
  );
});

/* ---------- MAIN SECTION ---------- */
function StorySectionInner({
  milestones = DEFAULT_MILESTONES,
}: StorySectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(var(--end-deg, 2deg)) translate3d(0,0,0); }
        }
        .animate-sway { animation: sway ease-in-out infinite; }
        
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg) translate3d(0,0,0); }
          50% { transform: scale(1.1) rotate(var(--rot, 5deg)) translate3d(0,0,0); }
        }
        .animate-gentle-pulse { animation: gentle-pulse ease-in-out infinite; }
      `}</style>

      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "6deg",
                animationDuration: "3.4s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>

          <span className="inline-block rounded-full border border-mustard/40 bg-white/80 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy shadow-sm backdrop-blur-sm sm:text-xs">
            OUR LOVE STORY
          </span>

          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "-6deg",
                animationDuration: "3.7s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>
        </m.div>

        <m.h2
          variants={fadeUp}
          className="font-script mt-5 text-4xl font-semibold text-ink sm:text-5xl md:text-6xl"
        >
          Our Journey to Forever
        </m.h2>

        <m.div variants={fadeUp} className="mb-12 mt-6 sm:mb-16 md:mb-20">
          <SprigDivider className="h-3 w-36 opacity-70 sm:w-44" />
        </m.div>

        <div className="relative flex w-full flex-col gap-12 sm:gap-20 md:gap-24">
          {/* Garis vertikal timeline */}
          <div className="absolute bottom-6 left-6 top-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-mustard/10 via-mustard/50 to-mustard/10 sm:left-1/2" />

          {milestones.map((item, index) => (
            <MilestoneCard
              // FIX: key sebelumnya pakai index murni — rapuh kalau
              // milestones nanti di-fetch dinamis (urutan bisa berubah,
              // React salah reconcile DOM). date+title lebih stabil
              // selama tidak ada dua milestone dengan kombinasi sama persis.
              key={`${item.date}-${item.title}`}
              item={item}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </m.div>
    </section>
  );
}

export default function StorySection(props: StorySectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <StorySectionInner {...props} />
    </LazyMotion>
  );
}
