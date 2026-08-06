"use client";

import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface CoupleSectionProps {
  groomName?: string;
  groomFullName?: string;
  groomParents?: string;
  brideName?: string;
  brideFullName?: string;
  brideParents?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
  openingAnimation?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Hanya opacity + transform (translate/scale/rotate) -> GPU only,   */
/*    tidak memicu layout/paint reflow -> tidak patah-patah.            */
/*  - Easing custom easeOutExpo-like biar berhenti mulus, tidak         */
/*    overshoot / bouncy yang bisa terasa kasar di device low-end.      */
/*  - viewport once: true -> animasi cuma jalan 1x saat section dibuka, */
/*    tidak retrigger tiap scroll naik-turun (mencegah jank berulang).  */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

/* PENTING: slide-in mempelai TIDAK memakai `scale` sama sekali lagi.  */
/* Sebelumnya ada scale: 0.97 -> 1 yang membuat foto terlihat sedikit  */
/* mengecil di awal animasi. Sekarang murni translate X + opacity saja */
/* supaya ukuran foto konsisten dari frame pertama hingga akhir.       */
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.35 },
  },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/*  Small visual pieces (SVG) — tidak berubah, tetap komponen statis    */
/* ------------------------------------------------------------------ */

function Monogram({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush via-blush-dark/70 to-burgundy/55">
      <span className="font-script text-3xl text-white drop-shadow-md sm:text-4xl lg:text-6xl">
        {initial}
      </span>
    </div>
  );
}

function PetalBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <circle
        cx="20"
        cy="20"
        r="18.5"
        fill="var(--ivory)"
        stroke="var(--mustard)"
        strokeWidth="1"
      />
      <g transform="translate(20, 20)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6.5"
            rx="4.4"
            ry="8.6"
            fill="var(--burgundy)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.8" fill="var(--mustard)" />
      </g>
    </svg>
  );
}

function SprigDivider({ className = "" }: { className?: string }) {
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
        {[0, 60, 120, 180, 240, 300].map((deg) => (
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
      <ellipse
        cx="94"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(-25 94 14)"
      />
      <ellipse
        cx="126"
        cy="14"
        rx="3"
        ry="5.4"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(25 126 14)"
      />
    </svg>
  );
}

function CornerFlourish({ className = "" }: { className?: string }) {
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
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {[0, 72, 144, 216, 288].map((deg) => (
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
}

function MiniLeaf({
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
}

function StaticWreathBand({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const blooms = [
    { x: 40, y: 14, s: 1, color: "var(--burgundy)" },
    { x: 95, y: 6, s: 0.8, color: "var(--coral)" },
    { x: 150, y: 16, s: 0.9, color: "var(--blush-dark)" },
    { x: 205, y: 5, s: 0.75, color: "var(--coral)" },
    { x: 260, y: 15, s: 1, color: "var(--burgundy)" },
  ];
  const leaves = [
    { x: 65, y: 12, rot: -20 },
    { x: 120, y: 4, rot: 15 },
    { x: 178, y: 12, rot: -12 },
    { x: 232, y: 4, rot: 18 },
  ];
  return (
    <svg
      viewBox="0 0 300 28"
      className={className}
      fill="none"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <line
        x1="0"
        y1="20"
        x2="300"
        y2="20"
        stroke="var(--sage)"
        strokeWidth="0.6"
        opacity="0.35"
        strokeDasharray="1 5"
      />
      {leaves.map((l, i) => (
        <ellipse
          key={`wl-${i}`}
          cx={l.x}
          cy={l.y}
          rx="3.4"
          ry="6.4"
          fill="var(--sage-light)"
          stroke="var(--sage)"
          strokeWidth="0.5"
          opacity="0.75"
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
        />
      ))}
      {blooms.map((b, i) => (
        <g
          key={`wb-${i}`}
          transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}
        >
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-5"
              rx="3.2"
              ry="6.2"
              fill={b.color}
              opacity="0.9"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2" fill="var(--mustard)" />
        </g>
      ))}
    </svg>
  );
}

/* dekorasi tersebar — statis, tetap tanpa animasi (biar ringan) */
const scatterItems = [
  { top: "5%", left: "8%", type: "bloom", color: "var(--burgundy)" },
  { top: "6%", left: "20%", type: "leaf", rot: -25 },
  { top: "4%", left: "80%", type: "leaf", rot: 25 },
  { top: "6%", left: "92%", type: "bloom", color: "var(--coral)" },
  { top: "80%", left: "3%", type: "bloom", color: "var(--coral)" },
  { top: "80%", left: "97%", type: "bloom", color: "var(--blush-dark)" },
  { top: "92%", left: "20%", type: "leaf", rot: 30 },
  { top: "92%", left: "80%", type: "leaf", rot: -30 },
  { top: "94%", left: "8%", type: "bloom", color: "var(--burgundy)" },
  { top: "94%", left: "92%", type: "bloom", color: "var(--coral)" },
] as const;

/* ------------------------------------------------------------------ */
/*  ArchPortrait — shell statis, dibungkus motion.div di pemanggil.     */
/*  Ukuran (w-full max-w-...) TETAP didefinisikan di sini seperti      */
/*  aslinya, dan wrapper motion.div di pemanggil juga diberi kelas      */
/*  ukuran yang identik supaya tidak ada ambiguitas lebar di dalam      */
/*  flex container (ini yang tadi menyebabkan foto terlihat mengecil).  */
/* ------------------------------------------------------------------ */

function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
}: {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
}) {
  return (
    <div className="relative flex w-full max-w-[8.5rem] flex-col items-center text-center sm:max-w-[10rem] lg:max-w-[16rem]">
      <div className="relative w-full">
        <div className="absolute -inset-[6px] rounded-t-[3.5rem] rounded-b-xl border border-mustard/35 sm:-inset-2 sm:rounded-t-[4.2rem] lg:-inset-[10px] lg:rounded-t-[6.5rem] lg:rounded-b-3xl" />
        <div className="relative h-[30vh] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_14px_30px_-10px_rgba(58,54,48,0.35)] ring-1 ring-white/60 sm:h-[34vh] sm:rounded-t-[4.2rem] lg:h-[22rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/40 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>
        <div
          className={`absolute h-6 w-6 sm:h-8 sm:w-8 lg:h-11 lg:w-11 ${
            align === "left"
              ? "-right-1.5 -bottom-1.5 sm:-right-2 sm:-bottom-2"
              : "-left-1.5 -bottom-1.5 sm:-left-2 sm:-bottom-2"
          }`}
        >
          <PetalBadge className="h-full w-full" />
        </div>
      </div>

      <p
        className="font-script mt-2 text-xl leading-none text-ink sm:mt-3 sm:text-3xl lg:mt-6 lg:text-5xl"
        style={{
          textShadow:
            "0 1px 10px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
        }}
      >
        {displayName}
      </p>
      <span className="mt-1 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-ink lg:mt-2 lg:text-[11px]"
        style={{ textShadow: "0 1px 6px rgba(255,255,255,0.8)" }}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[10px] leading-relaxed text-ink/80 lg:mt-2.5 lg:text-[11px]"
        style={{ textShadow: "0 1px 6px rgba(255,255,255,0.8)" }}
      >
        {align === "left" ? "Putri dari" : "Putra dari"}
        <br />
        {parents}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export default function CoupleSection({
  groomName = "Regga",
  groomFullName = "Regga",
  groomParents = "Bapak ... & Ibu ...",
  brideName = "Talitha",
  brideFullName = "Talitha",
  brideParents = "Bapak ... & Ibu ...",
  groomPhotoUrl,
  bridePhotoUrl,
  openingAnimation = true,
}: CoupleSectionProps) {
  return (
    <section className="relative flex h-dvh min-h-[36rem] w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 sm:px-6">
      {/* dasar: pattern + 2 glow warna — TETAP STATIS (blur berat, jangan */}
      {/* dianimasikan biar compositor tidak berat & tidak jank)          */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />

      {/* cincin dekoratif, diam */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-burgundy/40 opacity-[0.14]" />

      {/* garis flourish — fade tipis saja, opacity only (murah) */}
      <motion.svg
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-70"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <path
          d="M20 40 Q 120 10, 200 40 Q 280 10, 380 40"
          stroke="var(--sage)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M20 760 Q 120 790, 200 760 Q 280 790, 380 760"
          stroke="var(--sage)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </motion.svg>

      {/* bunga & daun 4 pojok, statis (biar tidak terlalu banyak elemen */}
      {/* animasi berjalan bersamaan -> mencegah drop frame)              */}
      <div className="hidden sm:contents">
        {scatterItems.map((item, i) => (
          <div
            key={`scatter-${i}`}
            style={{ top: item.top, left: item.left }}
            className="pointer-events-none absolute z-[1]"
          >
            {item.type === "bloom" ? (
              <MiniBloom className="opacity-85" color={item.color} />
            ) : (
              <MiniLeaf className="opacity-80" rot={item.rot} />
            )}
          </div>
        ))}
      </div>

      {/* kartu undangan: frame utuh, statis */}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />

      {/* vine kiri & kanan, hanya desktop — fade in halus */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-10 opacity-70 lg:block"
        style={{ willChange: "opacity" }}
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cornerFade}
      >
        <FloralVine orientation="vertical" className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-10 -scale-x-100 opacity-60 lg:block"
        style={{ willChange: "opacity" }}
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cornerFade}
        transition={{ delay: 0.1 }}
      >
        <FloralVine orientation="vertical" className="h-full w-full" />
      </motion.div>

      {/* corner ornament kecil — fade + scale ringan */}
      {[
        {
          cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
          rotate: "",
        },
        {
          cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
          rotate: "rotate-180",
        },
        {
          cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
          rotate: "rotate-90",
        },
        {
          cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
          rotate: "-rotate-90",
        },
      ].map((c, i) => (
        <motion.div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
          style={{ willChange: "transform, opacity" }}
          initial={openingAnimation ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cornerFade}
          transition={{ delay: 0.15 + i * 0.06 }}
        >
          <CornerFlourish className="h-full w-full" />
        </motion.div>
      ))}

      {/* corner floral besar, desktop only — fade halus */}
      <motion.div
        className="pointer-events-none absolute -bottom-6 -right-6 z-0 hidden h-28 w-28 opacity-75 sm:block lg:h-40 lg:w-40"
        style={{ willChange: "opacity" }}
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -top-6 -left-6 z-0 hidden h-28 w-28 opacity-70 sm:block lg:h-40 lg:w-40"
        style={{ willChange: "opacity" }}
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full" />
      </motion.div>

      {/* ------------------------------------------------------------ */}
      {/*  Konten utama — di sinilah animasi "buka" paling terasa.       */}
      {/*  Parent = orchestrator (stagger). Children cukup punya         */}
      {/*  `variants` saja, tanpa initial/whileInView sendiri, sehingga  */}
      {/*  otomatis mengikuti state parent — kunci transisi terasa satu  */}
      {/*  kesatuan yang mulus, bukan tersendat sepotong-sepotong.       */}
      {/* ------------------------------------------------------------ */}
      <motion.div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
        initial={openingAnimation ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <motion.div
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
            >
              <StaticWreathBand className="mb-1 h-4 w-40 opacity-70 sm:h-5 sm:w-56 lg:h-6 lg:w-72" />
            </motion.div>

            <motion.span
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
              className="inline-block rounded-full border border-mustard/50 bg-ivory/85 px-3 py-0.5 text-[8px] font-bold tracking-[0.3em] text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:py-1 sm:text-[10px] sm:tracking-[0.35em]"
            >
              MEMPELAI
            </motion.span>

            <motion.p
              variants={fadeUp}
              className="font-script mt-2 max-w-[18rem] rounded-2xl bg-ivory/55 px-3 py-1 text-base text-ink backdrop-blur-[2px] sm:max-w-md sm:text-xl lg:mt-3 lg:text-3xl"
              style={{
                textShadow: "0 1px 8px rgba(255,255,255,0.7)",
                willChange: "transform, opacity",
              }}
            >
              Dengan penuh syukur, kami mengundang Anda
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{ willChange: "transform, opacity" }}
            >
              <SprigDivider className="mt-1 h-4 w-32 sm:block lg:mt-2 lg:h-5 lg:w-44" />
            </motion.div>
          </div>

          {/* ------------------------------------------------------ */}
          {/*  FIX UTAMA: wrapper motion.div di sini SEKARANG diberi   */}
          {/*  kelas ukuran yang identik dengan ArchPortrait aslinya   */}
          {/*  ("w-full max-w-[8.5rem] sm:max-w-[10rem] lg:max-w-      */}
          {/*  [16rem]" + "flex-1"), supaya sebagai flex item ukurannya */}
          {/*  tidak lagi jatuh ke min-content (yang membuat foto      */}
          {/*  terlihat mengecil). Animasi (slideFromLeft/Right) tetap */}
          {/*  jalan normal karena hanya pakai opacity + x, tanpa      */}
          {/*  scale, jadi ukuran foto konsisten dari awal ke akhir.   */}
          {/* ------------------------------------------------------ */}
          <div className="relative mt-4 flex w-full flex-row items-end justify-center gap-3 sm:mt-6 sm:gap-5 lg:mt-10 lg:gap-8">
            <motion.div
              variants={slideFromLeft}
              style={{ willChange: "transform, opacity" }}
              className="flex w-full max-w-[8.5rem] shrink-0 sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={brideName}
                fullName={brideFullName}
                parents={brideParents}
                photoUrl={bridePhotoUrl}
                align="left"
              />
            </motion.div>

            <motion.div
              variants={popIn}
              style={{ willChange: "transform, opacity" }}
              className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-mustard bg-ivory shadow-lg sm:h-16 sm:w-16 lg:h-28 lg:w-28 lg:-translate-y-8"
            >
              <span className="absolute -inset-1 rounded-full border border-mustard/60" />
              <span className="absolute inset-[2px] rounded-full border border-sage/30 sm:inset-[3px]" />
              <span className="font-script text-lg text-burgundy sm:text-2xl lg:text-4xl">
                &amp;
              </span>
            </motion.div>

            <motion.div
              variants={slideFromRight}
              style={{ willChange: "transform, opacity" }}
              className="flex w-full max-w-[8.5rem] shrink-0 sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={groomName}
                fullName={groomFullName}
                parents={groomParents}
                photoUrl={groomPhotoUrl}
                align="right"
              />
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            style={{ willChange: "transform, opacity" }}
            className="mt-3 sm:mt-5 lg:mt-8"
          >
            <StaticWreathBand
              flip
              className="h-4 w-40 opacity-70 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
