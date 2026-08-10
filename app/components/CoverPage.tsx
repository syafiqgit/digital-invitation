"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cornerFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

const vineFade: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.5,
    },
  },
};

const borderFade: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.6,
    },
  },
};

const glowVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.4,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

const wreathVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    rotate: -6,
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 130,
      damping: 16,
    },
  },
};

const textLift = {
  textShadow:
    "0 1px 3px rgba(255,255,255,0.9), 0 1px 14px rgba(255,255,255,0.7)",
} as const;

const nameTextStyle = {
  overflowWrap: "normal",
  wordBreak: "normal",
  whiteSpace: "nowrap",
} as const;

const containerQueryStyle = {
  containerType: "inline-size",
} as const;

const petals = [
  { left: "8%", size: 8, duration: 9, delay: 0, color: "var(--blush-dark)" },
  { left: "38%", size: 7, duration: 10, delay: 4, color: "var(--coral)" },
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

// FIX: definisikan tipe eksplisit dengan path/yPath sebagai number[]
// (bukan readonly tuple) supaya kompatibel dengan tipe animate.x / animate.y
// milik Framer Motion (ValueKeyframesDefinition membutuhkan array mutable).
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

// FIX: tambahkan `sway` per vine — arah & titik tumpu (transformOrigin)
// disesuaikan supaya ayunan terlihat natural (vine vertikal berayun dari
// ujung atas, vine horizontal berayun dari ujung kiri), bukan berputar
// di tengah elemen.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "",
    delay: 0,
    sway: { rotate: [0, 1.4, 0, -1.4, 0], origin: "top center", duration: 7 },
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-8 opacity-90 sm:w-12 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    sway: {
      rotate: [0, -1.4, 0, 1.4, 0],
      origin: "top center",
      duration: 7.6,
    },
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "",
    delay: 0.2,
    sway: {
      rotate: [0, 0.9, 0, -0.9, 0],
      origin: "left center",
      duration: 8.2,
    },
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-8 w-full opacity-90 sm:h-12 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    sway: {
      rotate: [0, -0.9, 0, 0.9, 0],
      origin: "left center",
      duration: 8.8,
    },
  },
];

// FIX: tambahkan `sway` per corner — titik tumpu diarahkan ke sudut
// masing-masing (mis. top-left berayun dari titik "top left") supaya
// motif floral seolah melambai dari akar/pangkalnya di pojok.
const corners = [
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: {
      rotate: [0, 2.2, 0, -2.2, 0],
      origin: "bottom left",
      duration: 6.5,
    },
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: {
      rotate: [0, -2.2, 0, 2.2, 0],
      origin: "bottom right",
      duration: 7,
    },
  },
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: { rotate: [0, 2.2, 0, -2.2, 0], origin: "top left", duration: 6.8 },
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: {
      rotate: [0, -2.2, 0, 2.2, 0],
      origin: "top right",
      duration: 7.3,
    },
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

const Butterfly = memo(function Butterfly({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <motion.svg
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
    </motion.svg>
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
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <BackgroundPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.12]" />

        {/* FIX: efek Ken Burns — background perlahan zoom in/out tanpa
            henti supaya suasana taman terasa hidup, bukan foto statis. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/assets/garden-scatter-bg.webp"
            alt=""
            fill
            priority
            quality={100}
            sizes="100vw"
            className="pointer-events-none object-cover opacity-100"
            style={{
              filter: "saturate(1.35) contrast(1.15) brightness(1.05)",
            }}
          />
        </motion.div>

        <motion.div
          variants={borderFade}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute inset-3 z-[2] rounded-sm border border-sage/30 sm:inset-6"
        />

        {/* FIX: setiap vine sekarang punya motion.div bertingkat —
            wrapper luar tetap menjalankan fade-in masuk (vineFade),
            wrapper dalam menjalankan ayunan halus tak berhenti
            (rotate kecil bolak-balik) dengan transformOrigin di
            pangkal vine supaya efeknya seperti tertiup angin. */}
        {vines.map((v) => (
          <motion.div
            key={v.key}
            variants={vineFade}
            initial="hidden"
            animate="show"
            transition={{ delay: v.delay }}
            className={`pointer-events-none z-[2] ${v.className} ${v.flip}`}
          >
            <motion.div
              animate={{ rotate: v.sway.rotate }}
              transition={{
                duration: v.sway.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: v.delay + 0.6,
              }}
              style={{ transformOrigin: v.sway.origin }}
              className="h-full w-full"
            >
              <FloralVine
                orientation={v.orientation}
                className="h-full w-full"
                tileSize={360}
              />
            </motion.div>
          </motion.div>
        ))}

        {/* FIX: glow di belakang wreath sekarang "bernapas" — pulsing
            opacity & scale tak berhenti, mulai setelah entrance selesai. */}
        <motion.div
          variants={glowVariant}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl sm:h-72 sm:w-72 lg:h-[28rem] lg:w-[28rem]"
        >
          <motion.div
            className="h-full w-full rounded-full bg-blush/40 blur-3xl"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.92, 1.05, 0.92] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.7,
            }}
          />
        </motion.div>

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

        {butterflies.map((b, i) => (
          <motion.div
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
          </motion.div>
        ))}

        {/* FIX: setiap corner sekarang punya motion.div bertingkat —
            wrapper luar tetap menjalankan fade-in masuk (cornerFade),
            wrapper dalam menjalankan ayunan halus dengan transformOrigin
            diarahkan ke titik sudutnya sendiri supaya terlihat seperti
            melambai dari pangkalnya, bukan berputar di tengah kotak. */}
        {corners.map((c) => (
          <motion.div
            key={c.key}
            variants={cornerFade}
            initial="hidden"
            animate="show"
            transition={{ delay: c.fadeDelay }}
            className={`pointer-events-none absolute z-20 h-24 w-24 sm:h-36 sm:w-36 lg:h-48 lg:w-48 ${c.position}`}
          >
            <motion.div
              animate={{ rotate: c.sway.rotate }}
              transition={{
                duration: c.sway.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: c.fadeDelay + 0.6,
              }}
              style={{ transformOrigin: c.sway.origin }}
              className="h-full w-full"
            >
              <FloralCorner className="h-full w-full" flip={c.flip} />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={containerQueryStyle}
          className="relative z-20 flex w-full max-w-sm flex-col items-center px-6 text-center sm:max-w-md sm:px-8 lg:max-w-[640px]"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full border border-mustard/60 bg-ivory px-4 py-1.5 text-[0.65rem] font-bold tracking-[0.25em] text-burgundy shadow-sm sm:px-5 sm:text-xs sm:tracking-[0.3em]"
          >
            UNDANGAN PERNIKAHAN
          </motion.span>

          <motion.div
            variants={wreathVariant}
            className="relative mt-4 w-[clamp(270px,92cqw,610px)] sm:mt-5"
          >
            <WreathFrame className="w-full" />

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

              {/* FIX: ampersand diberi heartbeat pulse halus tak
                  berhenti supaya jadi titik fokus yang terasa hidup. */}
              <motion.p
                className="my-1 font-script font-semibold leading-none text-burgundy"
                style={{
                  ...textLift,
                  fontSize: "clamp(0.8rem, 2.7cqw, 1.25rem)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                &amp;
              </motion.p>

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
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 rounded-2xl border border-mustard/40 bg-ivory px-4 py-3 shadow-sm sm:mt-4 sm:gap-x-3 sm:px-5"
          >
            {/* FIX: MiniFlower kiri & kanan diberi mekar-berdenyut halus
                (scale + rotate kecil) dengan durasi & delay berbeda
                supaya terasa organik, bukan seragam. */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="shrink-0"
            >
              <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
            <span className="text-[0.65rem] font-bold tracking-[0.12em] text-ink sm:text-xs sm:tracking-[0.15em]">
              SABTU
            </span>
            <span className="font-script text-2xl font-bold text-burgundy sm:text-3xl">
              12
            </span>
            <span className="text-[0.65rem] font-bold tracking-[0.12em] text-ink sm:text-xs sm:tracking-[0.15em]">
              DESEMBER 2026
            </span>
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
              transition={{
                duration: 3.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.6,
              }}
              className="shrink-0"
            >
              <MiniFlower className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 w-32 sm:mt-6 sm:w-40">
            <FlourishDivider className="h-4 w-full" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-5 w-full rounded-2xl border border-sage/30 bg-ivory px-4 py-4 shadow-sm sm:mt-6 sm:px-5"
          >
            <p className="text-[0.7rem] font-semibold tracking-[0.06em] text-ink/70 sm:text-xs sm:tracking-[0.08em]">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="mt-1.5 wrap-break-word text-lg font-bold leading-snug text-ink sm:text-xl">
              {guestName}
            </p>
          </motion.div>

          {!isOpening && (
            <motion.div variants={fadeUp} className="mt-6 sm:mt-8">
              {/* FIX: tombol CTA diberi pulsing glow halus tak berhenti
                  untuk mengundang tamu menekan, hover scale tetap ada. */}
              <motion.button
                type="button"
                onClick={handleOpen}
                className="min-h-11 rounded-full bg-blush-dark px-8 py-3.5 text-[0.65rem] font-bold tracking-[0.2em] text-white sm:px-10 sm:text-xs sm:tracking-[0.25em]"
                animate={{
                  boxShadow: [
                    "0 4px 14px rgba(150,60,70,0.25)",
                    "0 4px 22px rgba(150,60,70,0.5)",
                    "0 4px 14px rgba(150,60,70,0.25)",
                  ],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                BUKA UNDANGAN
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
