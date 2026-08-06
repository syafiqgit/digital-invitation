"use client";

import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import WreathFrame from "./WreathFrame";

interface ClosingSectionProps {
  guestName?: string;
  groomName?: string;
  brideName?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - viewport once: true -> animasi jalan sekali saat section dibuka,  */
/*    tidak retrigger tiap scroll naik-turun.                          */
/*  - Elemen berat (blur glow, background pattern) dibiarkan statis     */
/*    supaya compositor tidak terbebani saat banyak elemen animasi      */
/*    lain berjalan bersamaan.                                         */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

const glowVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.3, ease: EASE } },
};

const wreathVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE } },
};

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE } },
};

/* taburan kelopak jatuh — jumlah dibatasi & opacity halus supaya jadi   */
/* aksen, bukan elemen dominan yang mengganggu keterbacaan teks.         */
const petals = [
  { left: "8%", size: 7, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "28%", size: 6, duration: 13, delay: 3, color: "var(--coral)" },
  { left: "50%", size: 6, duration: 12, delay: 1.5, color: "var(--mustard)" },
  { left: "72%", size: 7, duration: 14, delay: 4, color: "var(--burgundy)" },
  {
    left: "90%",
    size: 6,
    duration: 12.5,
    delay: 2,
    color: "var(--sage-light)",
  },
];

const stars = [
  { top: "14%", left: "12%" },
  { top: "22%", left: "88%" },
  { top: "70%", left: "10%" },
  { top: "78%", left: "90%" },
];

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--burgundy)">
      <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.4 1.6 6.9 4.4 5.2c2.2-1.3 4.9-.7 6.5 1.3l1.1 1.4 1.1-1.4c1.6-2 4.3-2.6 6.5-1.3 2.8 1.7 3.3 5.2 1.7 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

function OrnateDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 24" className={className} fill="none">
      <line
        x1="0"
        y1="12"
        x2="76"
        y2="12"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="124"
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
}

export default function ClosingSection({
  guestName = "Tamu Undangan",
  groomName = "Regga",
  brideName = "Talitha",
}: ClosingSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-24 lg:py-32">
      {/* dasar dekoratif — konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.25]" />
      </div>
      <div className="pointer-events-none absolute -left-16 -top-10 z-0 h-56 w-56 rounded-full bg-sage-light/25 blur-[95px] lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-52 w-52 rounded-full bg-mustard/20 blur-[90px] lg:h-72 lg:w-72" />

      {/* glow lembut di tengah, di belakang wreath */}
      <motion.div
        variants={glowVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl lg:h-96 lg:w-96"
      />

      {/* vine kiri & kanan tipis, hanya desktop, sebagai aksen tepi */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-10 opacity-35 lg:block lg:w-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralVine orientation="vertical" className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-10 -scale-x-100 opacity-35 lg:block lg:w-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.1 }}
      >
        <FloralVine orientation="vertical" className="h-full w-full" />
      </motion.div>

      {/* corner floral 4 sisi — dari 2 jadi 4 supaya framing lebih utuh */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-[1] h-28 w-28 opacity-85 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-[1] h-24 w-24 opacity-55 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.15 }}
      >
        <FloralCorner className="h-full w-full -scale-x-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-24 w-24 opacity-55 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.25 }}
      >
        <FloralCorner className="h-full w-full -scale-y-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-28 w-28 opacity-85 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.3 }}
      >
        <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
      </motion.div>

      {/* taburan kelopak jatuh — aksen halus, repeat infinite tapi ringan */}
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute top-[-5%] z-[1]"
          style={{ left: p.left, width: p.size, height: p.size }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 16, -10, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.55, 0.55, 0],
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

      {/* sparkle bintang kecil di 4 titik */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-[1]"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0.15, 0.8, 0.15], scale: [0.6, 1.1, 0.6] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <SparkleIcon className="h-3 w-3" />
        </motion.div>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block rounded-full border border-mustard/40 bg-ivory/80 px-4 py-1 text-xs font-bold tracking-[0.35em] text-ink shadow-sm backdrop-blur-sm"
        >
          TERIMA KASIH
        </motion.span>

        {/* pesan penutup dibungkus kartu supaya tidak "mengambang" */}
        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-6 w-full rounded-3xl border border-sage/25 bg-ivory/70 px-6 py-6 shadow-[0_14px_36px_-18px_rgba(58,54,48,0.3)] backdrop-blur-sm sm:px-8"
        >
          <p className="text-sm leading-relaxed text-ink/80 lg:text-base">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
            kami.
          </p>

          <div className="my-5 flex justify-center">
            <OrnateDivider className="h-5 w-40" />
          </div>

          <p className="text-xs font-semibold tracking-[0.15em] text-ink/60">
            KEPADA YTH.
          </p>
          <p className="mt-1 text-lg font-bold text-burgundy">{guestName}</p>
        </motion.div>

        {/* wreath kecil membingkai kalimat salam penutup */}
        <motion.div
          variants={wreathVariant}
          className="relative mt-9 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48"
        >
          <WreathFrame className="absolute inset-0 h-full w-full" />
          <div className="relative z-10 flex flex-col items-center px-6">
            <SparkleIcon className="h-4 w-4" />
            <p className="mt-2 text-[10px] leading-relaxed tracking-[0.15em] text-ink/70">
              WASSALAMU&apos;ALAIKUM
              <br />
              WARAHMATULLAHI
              <br />
              WABARAKATUH
            </p>
          </div>
        </motion.div>

        {/* nama pasangan — signature besar sebagai penutup utama */}
        <motion.div variants={fadeUp} className="mt-9">
          <p className="font-script text-4xl text-ink lg:text-5xl">
            {brideName}
          </p>
          <motion.div
            variants={lineGrow}
            className="mx-auto my-2 h-px w-16 origin-center bg-mustard/40"
          />
          <p className="font-script text-2xl text-burgundy lg:text-3xl">
            &amp;
          </p>
          <motion.div
            variants={lineGrow}
            className="mx-auto my-2 h-px w-16 origin-center bg-mustard/40"
          />
          <p className="font-script text-4xl text-ink lg:text-5xl">
            {groomName}
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-10 flex items-center gap-1.5 text-[10px] tracking-[0.15em] text-ink/40"
        >
          DIBUAT DENGAN
          <HeartIcon className="h-3 w-3" />
          UNTUK HARI BAHAGIA KAMI
        </motion.p>
      </motion.div>
    </section>
  );
}
