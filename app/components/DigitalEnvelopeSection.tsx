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

/* ---------- Framer Motion variants (Entrance Only) ---------- */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
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

/* ---------- Static decoration data (Decluttered for performance) ---------- */

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-5 opacity-70 xs:w-6 sm:w-10 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className:
      "absolute right-0 top-0 h-full w-5 opacity-70 xs:w-6 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className:
      "absolute left-0 top-0 h-5 w-full opacity-70 xs:h-6 sm:h-10 lg:h-14",
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
    className:
      "absolute bottom-0 left-0 h-5 w-full opacity-70 xs:h-6 sm:h-10 lg:h-14",
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
    fadeDelay: 0,
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
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

/* Statis menggantikan MajesticRay yang membebani GPU */
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-2xl xs:h-[340px] xs:w-[340px] sm:h-[420px] sm:w-[420px] lg:h-[620px] lg:w-[620px]"
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

/* ---------- Frame Layers (Optimized CSS Keyframes) ---------- */

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
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

      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
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
          className={`pointer-events-none absolute z-[3] h-12 w-12 opacity-90 xs:h-16 xs:w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.fadeDelay ? `${c.fadeDelay}s` : "0s",
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-2.5 z-[1] rounded-[1.5rem] border border-sage/25 xs:inset-3 sm:inset-5 sm:rounded-[2rem] lg:inset-8" />
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
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-3 py-16 xs:px-4 sm:px-6 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <AmbientGlow />
      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 text-center xs:px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="flex items-center gap-2 xs:gap-3"
        >
          <div
            className="animate-gentle-pulse shrink-0"
            style={
              {
                "--rot": "6deg",
                animationDuration: "3.4s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-3.5 w-3.5 opacity-70 xs:h-4 xs:w-4"
              color="var(--sage-light)"
            />
          </div>

          <span className="inline-block whitespace-nowrap rounded-full border border-mustard/40 bg-white/80 px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-burgundy shadow-sm backdrop-blur-sm xs:px-4 xs:text-[10px] xs:tracking-[0.25em] sm:text-xs">
            WEDDING GIFT
          </span>

          <div
            className="animate-gentle-pulse shrink-0"
            style={
              {
                "--rot": "-6deg",
                animationDuration: "3.7s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-3.5 w-3.5 opacity-70 xs:h-4 xs:w-4"
              color="var(--sage-light)"
            />
          </div>
        </m.div>

        <m.p
          variants={fadeUp}
          className="font-script mt-4 text-[2rem] leading-tight font-semibold text-ink xs:mt-5 xs:text-4xl sm:text-5xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Digital Envelope &amp; Gifts
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mt-5 mb-8 xs:mt-6 sm:mb-12"
        >
          <SprigDivider className="h-3 w-32 xs:w-36 sm:w-44 opacity-70" />
        </m.div>

        <m.p
          variants={fadeUp}
          className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-ink/80 sm:mb-10 sm:text-base"
        >
          Your prayers and presence are the greatest gifts of all. However, if
          you wish to send a token of love via cashless transfer or physical
          gift, please use the information below:
        </m.p>

        <m.div
          variants={containerVariants}
          className="mb-6 grid w-full grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6"
        >
          {accounts.map((acc) => (
            <m.div
              variants={fadeUp}
              key={acc.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-mustard/30 bg-white/85 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] xs:p-6 sm:rounded-[2rem]"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-serif text-lg font-bold tracking-wide text-burgundy xs:text-xl">
                    {acc.bankName}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mustard/10 transition-colors group-hover:bg-mustard/20 xs:h-10 xs:w-10">
                    <GiftIcon className="h-4.5 w-4.5 xs:h-5 xs:w-5" />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 xs:text-[11px]">
                    Account Number
                  </p>
                  <p className="break-all font-mono text-lg font-bold tracking-wider text-ink xs:text-xl sm:text-2xl">
                    {acc.accountNumber}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink/80">
                    a.n. {acc.accountHolder}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumber, acc.id)}
                className={`relative w-full rounded-full border py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  copiedId === acc.id
                    ? "border-sage bg-sage/10 text-sage-dark shadow-inner"
                    : "border-mustard/60 bg-white/90 text-burgundy shadow-sm hover:border-transparent hover:bg-[#6B2A36] hover:text-white hover:shadow-md"
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
          className="group relative w-full rounded-3xl border border-mustard/30 bg-white/85 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] xs:p-6 sm:rounded-[2rem] sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex-1 min-w-0">
              <h4 className="mb-3 font-serif text-base font-bold text-ink transition-colors group-hover:text-burgundy xs:text-lg">
                Send a Physical Gift
              </h4>
              <p className="text-sm leading-relaxed text-ink/80">
                <span className="text-sm font-semibold text-ink xs:text-base">
                  {giftAddress.recipient}
                </span>
                <br />
                <span className="mb-1 mt-1 inline-block opacity-70">
                  Phone: {giftAddress.phone}
                </span>
                <br />
                {giftAddress.address}
              </p>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={`relative w-full rounded-full border px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 sm:w-auto ${
                  copiedAddress
                    ? "border-sage bg-sage/10 text-sage-dark shadow-inner"
                    : "border-mustard/60 bg-white/90 text-burgundy shadow-sm hover:border-transparent hover:bg-[#6B2A36] hover:text-white hover:shadow-md"
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
