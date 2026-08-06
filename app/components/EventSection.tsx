"use client";

import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface EventSectionProps {
  venueName?: string;
  venueAddress?: string;
  mapsUrl?: string;
  akadTime?: string;
  resepsiTime?: string;
  date?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - `type: spring` diganti custom duration+ease supaya waktu selesai   */
/*    tiap elemen bisa diprediksi & selaras dengan stagger (spring bisa  */
/*    overshoot & durasinya tidak pasti, rawan terasa "lompat").         */
/*  - viewport once: true -> animasi jalan sekali saat section dibuka.   */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.55, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function MiniFlower({ className = "" }: { className?: string }) {
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
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5.2l3.6 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
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
/*  Sub-card acara: dipakai untuk Akad & Resepsi, supaya dua bagian     */
/*  jelas terpisah secara visual (bukan sekadar teks bertumpuk).        */
/* ------------------------------------------------------------------ */

function AgendaCard({ title, time }: { title: string; time: string }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{ willChange: "transform, opacity" }}
      className="flex flex-1 flex-col items-center rounded-2xl border border-sage/25 bg-blush/10 px-4 py-5"
    >
      <p className="font-script text-2xl text-burgundy lg:text-3xl">{title}</p>
      <div className="mt-2 flex items-center gap-1.5 text-ink/70">
        <ClockIcon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium sm:text-sm">{time}</span>
      </div>
    </motion.div>
  );
}

export default function EventSection({
  venueName = "Grand Hyatt Jakarta",
  venueAddress = "Jl. M.H. Thamrin Kav. 28-30, Menteng, Jakarta Pusat 10350",
  mapsUrl = "https://maps.google.com/?q=Grand+Hyatt+Jakarta",
  akadTime = "08:00 - 10:00 WIB",
  resepsiTime = "11:00 - 14:00 WIB",
  date = "Sabtu, 12 Desember 2026",
}: EventSectionProps) {
  return (
    <section className="relative overflow-hidden bg-blush/20 px-6 py-20 lg:py-28">
      {/* dasar dekoratif — konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>
      <div className="pointer-events-none absolute -left-16 top-10 z-0 h-56 w-56 rounded-full bg-sage-light/30 blur-[95px] lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 z-0 h-52 w-52 rounded-full bg-mustard/20 blur-[90px] lg:h-72 lg:w-72" />

      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-32 w-32 opacity-55 sm:block lg:h-44 lg:w-44"
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
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 mx-auto flex max-w-md flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1 text-xs font-bold tracking-[0.3em] text-burgundy"
        >
          WAKTU &amp; TEMPAT
        </motion.span>

        <motion.div variants={fadeUp} className="mt-4 flex items-center gap-3">
          <MiniFlower className="h-5 w-5" />
          <p className="text-sm font-semibold tracking-[0.1em] text-ink">
            {date}
          </p>
          <MiniFlower className="h-5 w-5" />
        </motion.div>

        {/* kartu utama acara */}
        <motion.div
          variants={cardPop}
          style={{ willChange: "transform, opacity" }}
          className="mt-9 w-full rounded-3xl border border-sage/30 bg-ivory px-5 py-8 shadow-[0_16px_40px_-18px_rgba(58,54,48,0.35)] sm:px-8"
        >
          {/* dua agenda dipisah jadi kartu berdampingan supaya jelas   */}
          {/* dan mudah dipindai mata, bukan teks bertumpuk vertikal.   */}
          <motion.div
            variants={container}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <AgendaCard title="Akad Nikah" time={akadTime} />
            <AgendaCard title="Resepsi" time={resepsiTime} />
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center">
            <OrnateDivider className="my-6 h-4 w-40" />
          </motion.div>

          {/* info venue dengan ikon pin, bukan teks polos */}
          <motion.div
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            className="flex flex-col items-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
              <PinIcon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-base font-bold text-ink">{venueName}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink/60">
              {venueAddress}
            </p>
          </motion.div>

          <motion.a
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blush-dark px-8 py-3 text-xs font-bold tracking-[0.2em] text-white shadow-md transition hover:scale-105"
          >
            <PinIcon className="h-3.5 w-3.5" />
            LIHAT LOKASI
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
