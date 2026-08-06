"use client";

import { useState } from "react";
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

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - `type: spring` diganti duration+ease custom, konsisten dgn         */
/*    section lain, supaya waktu selesai tiap kartu terprediksi.        */
/*  - viewport once: true -> animasi masuk section jalan sekali saja.   */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

/* Ilustrasi amplop: flap atas berputar terbuka (rotateX) saat status    */
/* `isOpen` true, dan kartu isi kecil bergeser naik + fade-in di          */
/* belakangnya. Semua hanya transform + opacity -> GPU-friendly.         */
function EnvelopeIllustration({
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
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

function BankIcon({ className = "" }: { className?: string }) {
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
}

function GiftIcon({ className = "" }: { className?: string }) {
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
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7.13 11.34 7.43 11.6a.9.9 0 0 0 1.14 0C12.87 21.34 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

function OrnateDivider({ className = "" }: { className?: string }) {
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
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

/* ------------------------------------------------------------------ */
/*  Copy button dengan feedback icon check, bukan hanya ganti teks       */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border border-mustard/60 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] text-burgundy transition hover:bg-mustard/10"
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
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                <path
                  d="M5 12.5 9.5 17 19 6.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              TERSALIN
            </>
          ) : (
            "SALIN"
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  AccountCard — sekarang dengan badge ikon bank di kiri, bukan hanya   */
/*  teks polos, supaya kartu terasa lebih "berisi" dan mudah dipindai.   */
/* ------------------------------------------------------------------ */

function AccountCard({ account }: { account: GiftAccount }) {
  return (
    <motion.div
      variants={cardPop}
      style={{ willChange: "transform, opacity" }}
      whileHover={{ y: -2 }}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-sage/30 bg-ivory px-4 py-4 text-left shadow-[0_10px_28px_-14px_rgba(58,54,48,0.3)] sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
        <BankIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-[0.15em] text-ink/55">
          {account.bankName}
        </p>
        <p className="mt-0.5 truncate text-base font-bold text-ink sm:text-lg">
          {account.accountNumber}
        </p>
        <p className="mt-0.5 text-xs text-ink/55">
          a.n. {account.accountHolder}
        </p>
      </div>
      <CopyButton text={account.accountNumber} />
    </motion.div>
  );
}

/* kartu alamat pengiriman kado fisik — elemen tambahan supaya section   */
/* terasa lebih "rame"/lengkap, bukan cuma amplop digital.               */
function AddressCard({ address }: { address: string }) {
  return (
    <motion.div
      variants={cardPop}
      style={{ willChange: "transform, opacity" }}
      className="flex w-full items-start gap-3.5 rounded-2xl border border-sage/30 bg-ivory px-4 py-4 text-left shadow-[0_10px_28px_-14px_rgba(58,54,48,0.3)] sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/12 text-sage">
        <MapPinIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-[0.15em] text-ink/55">
          KIRIM KADO
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink/75 sm:text-sm">
          {address}
        </p>
      </div>
    </motion.div>
  );
}

const placeholderAccounts: GiftAccount[] = [
  {
    bankName: "BCA",
    accountNumber: "9999-8888-7777",
    accountHolder: "Talitha",
  },
  {
    bankName: "Mandiri",
    accountNumber: "1234-5678-9012",
    accountHolder: "Regga",
  },
];

export default function GiftSection({
  accounts = placeholderAccounts,
  address = "Alamat pengiriman kado akan diinformasikan melalui kontak panitia.",
}: GiftSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-blush/20 px-6 py-20 lg:py-28">
      {/* dasar dekoratif — konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>
      <div className="pointer-events-none absolute -left-16 -top-10 z-0 h-56 w-56 rounded-full bg-mustard/20 blur-[95px] lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-52 w-52 rounded-full bg-sage-light/30 blur-[90px] lg:h-72 lg:w-72" />

      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-y-100" />
      </motion.div>

      {/* frame kartu tipis */}
      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-mustard/20 sm:inset-6 lg:inset-10" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
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
          className="mt-5 max-w-xs text-sm leading-relaxed text-ink/70"
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
            onClick={() => setOpen((v) => !v)}
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
