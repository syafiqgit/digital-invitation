"use client";

import { memo, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  type Transition,
  type Variants,
} from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
}

interface DigitalEnvelopeSectionProps {
  accounts?: BankAccount[];
  giftAddress?: {
    recipient: string;
    phone: string;
    address: string;
  };
}

const DEFAULT_ACCOUNTS: BankAccount[] = [
  {
    id: "bca",
    bankName: "BCA",
    accountNumber: "1234567890",
    accountHolder: "Amelia",
    logoText: "BCA",
  },
  {
    id: "mandiri",
    bankName: "Mandiri",
    accountNumber: "0987654321",
    accountHolder: "Alexander",
    logoText: "MANDIRI",
  },
];

const DEFAULT_GIFT_ADDRESS = {
  recipient: "Amelia & Alexander",
  phone: "+62 812-3456-7890",
  address:
    "45 Mawar Indah Street, RT 03/RW 05, Gardenia Sub-district, South Jakarta 12550",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GPU_HINT = { willChange: "transform, opacity" } as const;
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
  hidden: { opacity: 0, y: 30, scale: 0.96 },
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

/* ---------- Static decoration data ---------- */

const scatterItems = [
  { top: "8%", left: "8%", type: "bloom", color: "var(--burgundy)" },
  { top: "15%", left: "90%", type: "leaf", rot: 25 },
  { top: "35%", left: "5%", type: "bloom", color: "var(--coral)" },
  { top: "45%", left: "95%", type: "leaf", rot: -20 },
  { top: "60%", left: "10%", type: "leaf", rot: 45 },
  { top: "72%", left: "88%", type: "bloom", color: "var(--blush-dark)" },
  { top: "85%", left: "5%", type: "bloom", color: "var(--sage-light)" },
  { top: "92%", left: "92%", type: "bloom", color: "var(--burgundy)" },
] as const;

const sparkles = [
  { top: "12%", left: "20%" },
  { top: "28%", left: "78%" },
  { top: "45%", left: "15%" },
  { top: "60%", left: "85%" },
  { top: "80%", left: "25%" },
].map((s) => ({ ...s, style: { top: s.top, left: s.left, ...GPU_HINT } }));

const fireflies = [
  { left: "18%", bottom: "20%", duration: 7, delay: 0 },
  { left: "82%", bottom: "35%", duration: 8.5, delay: 1.5 },
  { left: "12%", bottom: "60%", duration: 7.5, delay: 3 },
  { left: "88%", bottom: "75%", duration: 9, delay: 2 },
].map((f) => ({
  ...f,
  style: { left: f.left, bottom: f.bottom, ...GPU_HINT },
}));

const petals = [
  { left: "15%", size: 6, duration: 12, delay: 1, color: "var(--sage-light)" },
  { left: "45%", size: 12, duration: 15, delay: 5, color: "var(--coral)" },
  {
    left: "85%",
    size: 7,
    duration: 10.5,
    delay: 3,
    color: "var(--blush-dark)",
  },
].map((p) => ({
  ...p,
  style: { left: p.left, width: p.size, height: p.size, ...GPU_HINT },
}));

const goldDusts = [
  { left: "12%", bottom: "10%", size: 4, duration: 14, delay: 0 },
  { left: "50%", bottom: "25%", size: 6, duration: 17, delay: 2 },
  { left: "85%", bottom: "5%", size: 5, duration: 15, delay: 1 },
];

const butterflies = [
  { left: "10%", top: "22%", color: "var(--coral)", duration: 16, delay: 0 },
  { left: "88%", top: "68%", color: "var(--burgundy)", duration: 18, delay: 3 },
].map((b) => ({ ...b, style: { left: b.left, top: b.top, ...GPU_HINT } }));

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
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.6, 0.4),
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(3.9, 0.9),
  },
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "rotate-90",
    pulse: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
    transition: loop(3.3, 1.4),
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "-rotate-90",
    pulse: { scale: [1, 1.1, 1], rotate: [0, -5, 0] },
    transition: loop(4.1, 0.2),
  },
];

/* ---------- Small Presentational Pieces ---------- */

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
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] -translate-x-1/2 -translate-y-1/2 opacity-50"
      animate={{ rotate: 360 }}
      transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
    >
      <div className="h-[600px] w-[600px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.06)_60deg,transparent_120deg,rgba(212,175,55,0.06)_180deg,transparent_240deg,rgba(212,175,55,0.06)_300deg,transparent_360deg)] blur-3xl lg:h-[800px] lg:w-[800px]" />
    </m.div>
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

const GiftIcon = memo(function GiftIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect
        x="3"
        y="8"
        width="18"
        height="13"
        rx="2"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
        fill="var(--mustard)"
        fillOpacity="0.2"
      />
      <path d="M3 12h18" stroke="var(--burgundy)" strokeWidth="1.5" />
      <path d="M12 8v13" stroke="var(--burgundy)" strokeWidth="1.5" />
      <path
        d="M12 8c0-2-2-4-4-3s-2 3 0 3h4Z"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
      />
      <path
        d="M12 8c0-2 2-4 4-3s2 3 0 3h-4Z"
        stroke="var(--burgundy)"
        strokeWidth="1.5"
      />
      <path
        d="M18 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"
        fill="var(--mustard)"
        opacity="0.8"
      />
    </svg>
  );
});

/* ---------- Ambient Decor & Frames ---------- */

const AmbientDecor = memo(function AmbientDecor() {
  return (
    <>
      <div className="hidden sm:contents">
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
          <m.div
            key={`sparkle-${i}`}
            className="pointer-events-none absolute z-[1]"
            style={s.style}
            animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.6, 1.1, 0.6] }}
            transition={loop(3 + (i % 3), i * 0.4)}
          >
            <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
          </m.div>
        ))}

        {petals.map((p, i) => (
          <m.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-5%] z-[1]"
            style={p.style}
            animate={{
              y: ["0vh", "115vh"],
              x: [0, -20, 15, 0],
              rotate: [0, -180, -360],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={loop(p.duration, p.delay, "linear")}
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
          </m.div>
        ))}

        {butterflies.map((b, i) => (
          <m.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[2] h-5 w-6 lg:h-7 lg:w-9"
            style={b.style}
            animate={{
              x: [0, 30, -15, 40, 0],
              y: [0, -20, -5, -30, 0],
              rotate: [0, 6, -5, 4, 0],
            }}
            transition={loop(b.duration, b.delay)}
          >
            <Butterfly className="h-full w-full" color={b.color} />
          </m.div>
        ))}

        {goldDusts.map((g, i) => (
          <m.div
            key={`gd-${i}`}
            className="pointer-events-none absolute z-[15]"
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
      </div>

      <div className="contents">
        {fireflies.map((f, i) => (
          <m.div
            key={`firefly-${i}`}
            className="pointer-events-none absolute z-[1] h-1.5 w-1.5 lg:h-2 lg:w-2"
            style={f.style}
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
      </div>
    </>
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
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
        >
          <m.div
            animate={c.pulse}
            transition={c.transition}
            style={GPU_HINT}
            className="h-full w-full"
          >
            <CornerFlourish className="h-full w-full" />
          </m.div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- Main Component ---------- */

function DigitalEnvelopeSectionInner({
  accounts = DEFAULT_ACCOUNTS,
  giftAddress = DEFAULT_GIFT_ADDRESS,
}: DigitalEnvelopeSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAddress = () => {
    const fullText = `Recipient: ${giftAddress.recipient}\nPhone: ${giftAddress.phone}\nAddress: ${giftAddress.address}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-20 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <m.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT}
      />

      <MajesticRay />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-2 text-center"
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
            WEDDING GIFT
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
          className="font-script mt-4 text-4xl font-semibold text-ink sm:mt-5 sm:text-5xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Digital Envelope &amp; Gifts
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mt-4 mb-8 sm:mb-10"
        >
          <SprigDivider className="h-4 w-36 sm:w-44 opacity-80" />
        </m.div>

        <m.p
          variants={fadeUp}
          className="text-xs text-ink/80 max-w-lg mx-auto mb-10 leading-relaxed sm:text-sm"
        >
          Your prayers and presence are the greatest gifts of all. However, if
          you wish to send a token of love via cashless transfer or physical
          gift, please use the information below:
        </m.p>

        <m.div
          variants={containerVariants}
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"
        >
          {accounts.map((acc) => (
            <m.div
              variants={fadeUp}
              key={acc.id}
              className="group relative flex flex-col justify-between rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-br from-ivory/95 to-white/90 p-6 shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md text-left transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-mustard/70 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-xl text-burgundy tracking-wide">
                    {acc.bankName}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mustard/10 group-hover:bg-mustard/20 transition-colors">
                    <GiftIcon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
                    Account Number
                  </p>
                  <p className="font-mono text-xl font-bold text-ink sm:text-2xl tracking-[0.1em]">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs font-semibold text-ink/80 mt-1">
                    a.n. {acc.accountHolder}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumber, acc.id)}
                className={`relative w-full rounded-full border py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  copiedId === acc.id
                    ? "border-sage bg-sage/10 text-sage-dark shadow-inner"
                    : "border-mustard/60 bg-white/80 text-burgundy shadow-sm hover:bg-gradient-to-r hover:from-burgundy hover:to-[#5e1927] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(94,25,39,0.3)]"
                }`}
              >
                {copiedId === acc.id
                  ? "Successfully Copied ✓"
                  : "Copy Account Number"}
              </button>
            </m.div>
          ))}
        </m.div>

        <m.div
          variants={fadeUp}
          className="group relative w-full rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-b from-white/90 to-ivory/95 p-6 sm:p-8 shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md text-left transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:border-mustard/70"
        >
          <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex-1">
              <h4 className="font-serif text-lg font-bold text-ink mb-3 group-hover:text-burgundy transition-colors">
                Send a Physical Gift
              </h4>
              <p className="text-xs text-ink/80 leading-relaxed">
                <span className="font-semibold text-ink text-sm">
                  {giftAddress.recipient}
                </span>
                <br />
                <span className="inline-block mt-1 mb-1 opacity-70">
                  Phone: {giftAddress.phone}
                </span>
                <br />
                {giftAddress.address}
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={`relative w-full sm:w-auto rounded-full border px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  copiedAddress
                    ? "border-sage bg-sage/10 text-sage-dark shadow-inner"
                    : "border-mustard/60 bg-white/80 text-burgundy shadow-sm hover:bg-gradient-to-r hover:from-burgundy hover:to-[#5e1927] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(94,25,39,0.3)]"
                }`}
              >
                {copiedAddress ? "Address Copied ✓" : "Copy Address"}
              </button>
            </div>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}

export default function DigitalEnvelopeSection(
  props: DigitalEnvelopeSectionProps,
) {
  return (
    <LazyMotion features={domAnimation}>
      <DigitalEnvelopeSectionInner {...props} />
    </LazyMotion>
  );
}
