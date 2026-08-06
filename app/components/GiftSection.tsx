"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface GiftAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface GiftSectionProps {
  accounts?: GiftAccount[];
  address?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

const fireflies = [
  { left: "9%", top: "18%", duration: 7, delay: 0 },
  { left: "20%", top: "72%", duration: 8.5, delay: 1.5 },
  { left: "87%", top: "22%", duration: 7.5, delay: 3 },
  { left: "91%", top: "68%", duration: 9, delay: 2 },
  { left: "50%", top: "10%", duration: 8, delay: 4.5 },
] as const;

const butterflies = [
  { left: "7%", top: "38%", color: "var(--coral)", duration: 18, delay: 0 },
  { left: "89%", top: "48%", color: "var(--burgundy)", duration: 20, delay: 5 },
] as const;

const floatingPetals = [
  { left: "13%", size: 6, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "79%", size: 7, duration: 13, delay: 4, color: "var(--sage-light)" },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

const placeholderAccounts: GiftAccount[] = [
  { bankName: "BCA", accountNumber: "9999-8888-7777", accountHolder: "Amelia" },
  {
    bankName: "Mandiri",
    accountNumber: "1234-5678-9012",
    accountHolder: "Alexander",
  },
];

const EnvelopeIllustration = memo(function EnvelopeIllustration({
  className = "",
  isOpen,
}: {
  className?: string;
  isOpen: boolean;
}) {
  return (
    <svg viewBox="0 0 96 76" className={className} fill="none">
      <rect
        x="4"
        y="14"
        width="88"
        height="58"
        rx="6"
        fill="var(--blush)"
        stroke="var(--burgundy)"
        strokeWidth="1.4"
      />
      <motion.rect
        x="20"
        y="10"
        width="56"
        height="38"
        rx="4"
        fill="var(--ivory)"
        stroke="var(--mustard)"
        strokeWidth="1"
        initial={false}
        animate={{ y: isOpen ? -10 : 6, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ willChange: "transform, opacity" }}
      />
      <path
        d="M4 20 L48 52 L92 20"
        stroke="var(--burgundy)"
        strokeWidth="1.4"
        fill="var(--blush)"
        opacity="0.95"
      />
      <motion.g
        initial={false}
        animate={{ rotateX: isOpen ? 150 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          originX: "48px",
          originY: "16px",
          transformOrigin: "48px 16px",
          willChange: "transform",
        }}
      >
        <path
          d="M4 16 L48 44 L92 16 Z"
          fill="var(--blush-dark)"
          stroke="var(--burgundy)"
          strokeWidth="1.4"
        />
      </motion.g>
      <g transform="translate(48, 62)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-4.4"
            rx="2.8"
            ry="5.4"
            fill="var(--burgundy)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.8" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

const BankIcon = memo(function BankIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M3 10 12 4l9 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9M3 21h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
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
        y="9"
        width="18"
        height="11"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 13h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 9v11" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 9c-1.6 0-4-1-4-3.2S9.6 3 11 4.2c1 .8 1 2.8 1 4.8Zm0 0c1.6 0 4-1 4-3.2S14.4 3 13 4.2c-1 .8-1 2.8-1 4.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const MapPinIcon = memo(function MapPinIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.13 11.34 7.43 11.6a.9.9 0 0 0 1.14 0C12.87 21.34 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 160 20" className={className} fill="none">
      <line
        x1="0"
        y1="10"
        x2="62"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="98"
        y1="10"
        x2="160"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(80, 10)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-4.4"
            rx="2.8"
            ry="5.4"
            fill="var(--burgundy)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.8" fill="var(--mustard)" />
      </g>
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
        opacity="0.5"
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

const CheckIcon = memo(function CheckIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5 12.5 9.5 17 19 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const CopyButton = memo(function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border border-mustard/70 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] text-burgundy transition hover:bg-mustard/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3 w-3" />
              TERSALIN
            </>
          ) : (
            "SALIN"
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
});

const AccountCard = memo(function AccountCard({
  account,
}: {
  account: GiftAccount;
}) {
  return (
    <motion.div
      variants={cardPop}
      style={{ willChange: "transform, opacity" }}
      whileHover={{ y: -2 }}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-sage/40 bg-ivory px-4 py-4 text-left shadow-[0_10px_28px_-14px_rgba(58,54,48,0.3)] sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/15 text-burgundy">
        <BankIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold tracking-[0.15em] text-ink/70">
          {account.bankName}
        </p>
        <p className="mt-0.5 truncate text-base font-bold text-ink sm:text-lg">
          {account.accountNumber}
        </p>
        <p className="mt-0.5 text-xs font-medium text-ink/70">
          a.n. {account.accountHolder}
        </p>
      </div>
      <CopyButton text={account.accountNumber} />
    </motion.div>
  );
});

const AddressCard = memo(function AddressCard({
  address,
}: {
  address: string;
}) {
  return (
    <motion.div
      variants={cardPop}
      style={{ willChange: "transform, opacity" }}
      className="flex w-full items-start gap-3.5 rounded-2xl border border-sage/40 bg-ivory px-4 py-4 text-left shadow-[0_10px_28px_-14px_rgba(58,54,48,0.3)] sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/20 text-sage">
        <MapPinIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold tracking-[0.15em] text-ink/70">
          KIRIM KADO
        </p>
        <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink/90 sm:text-sm">
          {address}
        </p>
      </div>
    </motion.div>
  );
});

export default function GiftSection({
  accounts = placeholderAccounts,
  address = "Alamat pengiriman kado akan diinformasikan melalui kontak panitia.",
}: GiftSectionProps) {
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => setOpen((v) => !v), []);

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-mustard/15 blur-[70px] lg:h-56 lg:w-56" />

      <motion.svg
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 w-full opacity-80 lg:h-20"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        {fairyLights.map((f, i) => (
          <g key={`fl-${i}`}>
            <circle
              cx={f.cx}
              cy={f.cy}
              r="4.5"
              fill="var(--mustard)"
              opacity="0.18"
            />
            <motion.circle
              cx={f.cx}
              cy={f.cy}
              r="2.2"
              fill="var(--mustard)"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 2.2 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </g>
        ))}
      </motion.svg>

      <div className="hidden sm:contents">
        {floatingPetals.map((p, i) => (
          <motion.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-6%] z-[1]"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "112vh"],
              x: [0, 14, -8, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.5, 0.5, 0],
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
                opacity="0.65"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:contents">
        {butterflies.map((b, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="pointer-events-none absolute z-[1] h-4 w-5 lg:h-6 lg:w-8"
            style={{ left: b.left, top: b.top }}
            animate={{
              x: [0, 30, -14, 40, 0],
              y: [0, -20, -4, -28, 0],
              rotate: [0, 6, -5, 4, 0],
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
            style={{ left: f.left, top: f.top }}
            animate={{
              y: [0, -30, -8, -40, 0],
              x: [0, 10, -6, 8, 0],
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

      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-y-100" />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-sage/25 sm:inset-6 lg:inset-10" />
      <div className="pointer-events-none absolute inset-7 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block lg:inset-12" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
        >
          <GiftIcon className="h-3.5 w-3.5" />
          AMPLOP DIGITAL
        </motion.span>

        <motion.div variants={fadeUp} className="mt-6">
          <EnvelopeIllustration
            className="h-20 w-24 sm:h-24 sm:w-28"
            isOpen={open}
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-xs text-sm font-medium leading-relaxed text-ink/90"
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun
          jika ingin memberi tanda kasih, kami dengan senang hati menerimanya
          secara digital melalui:
        </motion.p>

        <motion.div variants={fadeUp} className="mt-4">
          <OrnateDivider className="h-4 w-32" />
        </motion.div>

        <motion.div variants={fadeUp} className="relative mt-5">
          {!open && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full bg-blush-dark/40"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: EASE }}
            />
          )}
          <motion.button
            type="button"
            onClick={toggleOpen}
            whileTap={{ scale: 0.96 }}
            className="relative rounded-full bg-blush-dark px-9 py-3 text-xs font-bold tracking-[0.2em] text-white shadow-md transition hover:scale-105"
          >
            {open ? "TUTUP AMPLOP" : "BUKA AMPLOP"}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-full overflow-hidden"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-7 flex w-full flex-col items-center gap-3"
              >
                {accounts.map((acc, i) => (
                  <AccountCard key={i} account={acc} />
                ))}
                <AddressCard address={address} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
