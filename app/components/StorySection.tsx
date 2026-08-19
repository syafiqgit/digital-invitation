"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";

// KOMPONEN & DATA EKSTERNAL
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import FloatingDecorations from "./FloatingDecorations"; // Menggantikan AmbientLayer

/* -------------------------------------------------------------------------- */
/*                                 INTERFACES                                 */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                           MOTION VARIANTS                                  */
/* -------------------------------------------------------------------------- */
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

const cardVariants: Variants = {
  hidden: (isEven: boolean) => ({
    opacity: 0,
    y: 30,
    x: isEven ? -24 : 24,
    scale: 0.98,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

/* -------------------------------------------------------------------------- */
/*                           STATIC DECORATION DATA                           */
/* -------------------------------------------------------------------------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    origin: "top center",
    endDeg: "0.6deg",
    duration: "7.5s",
    delay: "0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    origin: "top center",
    endDeg: "0.6deg",
    duration: "8s",
    delay: "0.5s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "0.8deg",
    duration: "8.6s",
    delay: "0.2s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "0.8deg",
    duration: "9.2s",
    delay: "0.3s",
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.5deg",
    duration: "6.6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "1.5deg",
    duration: "7.1s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.5deg",
    duration: "6.9s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "1.5deg",
    duration: "7.4s",
    delay: "0.3s",
  },
];

const KEN_BURNS = [
  { origin: "50% 30%", duration: "22s" },
  { origin: "35% 60%", duration: "26s" },
  { origin: "65% 45%", duration: "24s" },
];

/* -------------------------------------------------------------------------- */
/*                            PRESENTATIONAL PIECES                           */
/* -------------------------------------------------------------------------- */
const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  const ANGLES = [0, 72, 144, 216, 288];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      className={className}
      fill="none"
    >
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
MiniBloom.displayName = "MiniBloom";

const SprigDivider = memo(function SprigDivider({
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
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
});
SprigDivider.displayName = "SprigDivider";

const HeartIcon = memo(function HeartIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="var(--burgundy)"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
});
HeartIcon.displayName = "HeartIcon";

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-story-sway"
            style={
              {
                transformOrigin: v.origin,
                "--end-deg": v.endDeg,
                animationDuration: v.duration,
                animationDelay: v.delay,
              } as React.CSSProperties
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        // REFINED: Ukuran diperbesar disamakan dengan Couple & Event Section
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-24 w-24 opacity-90 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 ${c.position}`}
        >
          <div
            className="h-full w-full animate-story-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
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
FrameLayers.displayName = "FrameLayers";

/* -------------------------------------------------------------------------- */
/*                            TIMELINE COMPONENT                              */
/* -------------------------------------------------------------------------- */
const MilestoneCard = memo(function MilestoneCard({
  item,
  isEven,
  index,
}: {
  item: StoryMilestone;
  isEven: boolean;
  index: number;
}) {
  const kb = KEN_BURNS[index % KEN_BURNS.length];

  return (
    <m.div
      variants={cardVariants}
      custom={isEven}
      className={`group relative flex w-full flex-col items-center gap-5 sm:flex-row sm:gap-0 ${isEven ? "sm:flex-row-reverse" : ""}`}
    >
      <div
        className={`ml-14 w-[calc(100%-3.5rem)] rounded-[2rem] border border-mustard/30 bg-white/80 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-shadow duration-500 ease-out hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] sm:ml-0 sm:w-[calc(50%-3rem)] sm:p-7 md:w-[calc(50%-3.5rem)] md:p-8 lg:w-[calc(50%-4rem)] lg:p-9 ${isEven ? "sm:mr-auto" : "sm:ml-auto"}`}
      >
        {item.photoUrl && (
          <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-mustard/20 bg-gray-100">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src={item.photoUrl}
                alt={item.title}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 45vw, 80vw"
                className="animate-story-kenburns object-cover"
                style={
                  {
                    transformOrigin: kb.origin,
                    animationDuration: kb.duration,
                  } as React.CSSProperties
                }
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40"
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

      <div className="absolute left-6 top-8 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-mustard/50 bg-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-burgundy/60 sm:left-1/2 sm:top-1/2 sm:h-12 sm:w-12 sm:-translate-y-1/2 md:h-14 md:w-14">
        <span
          aria-hidden="true"
          className="animate-story-ripple pointer-events-none absolute inset-0 rounded-full border border-burgundy/40"
          style={{ animationDelay: `${index * 0.8}s` }}
        />
        <HeartIcon className="relative z-10 h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </div>
    </m.div>
  );
});
MilestoneCard.displayName = "MilestoneCard";

/* -------------------------------------------------------------------------- */
/*                               STYLES HOISTING                              */
/* -------------------------------------------------------------------------- */
const STORY_STYLES = `
  @keyframes story-sway {
    0%, 100% { transform: rotate(0deg); }
    25%      { transform: rotate(var(--end-deg, 1.5deg)); }
    75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
  }
  .animate-story-sway {
    animation: story-sway ease-in-out infinite;
  }
  @keyframes story-pulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50%      { transform: scale(1.1) rotate(var(--rot, 5deg)); }
  }
  .animate-story-pulse {
    animation: story-pulse ease-in-out infinite;
  }
  @keyframes story-ripple {
    0%        { opacity: 0.55; transform: scale(1); }
    70%, 100% { opacity: 0;    transform: scale(1.75); }
  }
  .animate-story-ripple {
    animation: story-ripple 3.2s ease-out infinite;
  }
  @keyframes story-kenburns {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
  .animate-story-kenburns {
    animation: story-kenburns ease-in-out infinite;
  }
  @keyframes story-beam {
    0%, 100% { opacity: 0.3;  transform: translateX(-50%) rotate(0deg); }
    50%      { opacity: 0.55; transform: translateX(-46%) rotate(3deg); }
  }
  .animate-story-beam {
    animation: story-beam 18s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-story-sway,
    .animate-story-pulse,
    .animate-story-ripple,
    .animate-story-kenburns,
    .animate-story-beam { animation: none; }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                MAIN SECTION                                */
/* -------------------------------------------------------------------------- */
function StorySectionInner({
  milestones = DEFAULT_MILESTONES,
}: StorySectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 85%", "end 55%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <style dangerouslySetInnerHTML={{ __html: STORY_STYLES }} />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <FrameLayers />
      {/* REFINED: AmbientLayer diganti menjadi FloatingDecorations */}
      <FloatingDecorations />

      <div
        aria-hidden="true"
        className="animate-story-beam pointer-events-none absolute -top-1/4 left-1/2 z-[1] hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
        }}
      />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-story-pulse"
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
            className="animate-story-pulse"
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
          <SprigDivider className="h-4 w-40 opacity-80 sm:w-48" />
        </m.div>

        <div
          ref={timelineRef}
          className="relative flex w-full flex-col gap-12 sm:gap-20 md:gap-24"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-6 top-0 w-[2px] -translate-x-1/2 bg-mustard/15 sm:left-1/2"
          />
          <m.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-6 top-0 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-mustard/70 via-mustard to-mustard/70 sm:left-1/2"
          />

          {milestones.map((item, index) => (
            <MilestoneCard
              key={`${item.date}-${item.title}`}
              item={item}
              isEven={index % 2 === 0}
              index={index}
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
