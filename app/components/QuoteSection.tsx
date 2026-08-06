"use client";

import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Hanya opacity + transform (y/scale) -> GPU-only, mulus di semua   */
/*    device, tidak memicu reflow/layout thrash.                       */
/*  - viewport once: true -> animasi jalan sekali saat section dibuka,  */
/*    tidak retrigger tiap scroll naik-turun.                          */
/*  - Easing custom easeOutExpo-like biar berhenti halus tanpa bounce.  */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none">
      <path
        d="M18 0C8 6 2 16 2 26c0 10 7 18 16 18 7 0 12-5 12-12S25 20 19 20c-1 0-2 0-3 .2C17 12 21 6 27 2Z"
        fill="var(--mustard)"
      />
      <path
        d="M50 0c-10 6-16 16-16 26 0 10 7 18 16 18 7 0 12-5 12-12s-5-12-11-12c-1 0-2 0-3 .2C49 12 53 6 59 2Z"
        fill="var(--mustard)"
      />
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
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <line
        x1="124"
        y1="12"
        x2="200"
        y2="12"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <g transform="translate(100, 12)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.4"
            ry="6.6"
            fill="var(--burgundy)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.2" fill="var(--mustard)" />
      </g>
      <circle cx="86" cy="12" r="1.6" fill="var(--sage)" opacity="0.7" />
      <circle cx="114" cy="12" r="1.6" fill="var(--sage)" opacity="0.7" />
    </svg>
  );
}

export default function QuoteSection() {
  return (
    <section className="relative overflow-hidden bg-blush/20 px-6 py-20 lg:py-28">
      {/* dasar dekoratif: pattern + glow lembut — statis, tidak dianimasikan */}
      {/* (elemen blur berat, animasi transform/opacity di sini bisa bikin   */}
      {/* jank kalau berjalan bersamaan dengan animasi konten utama)         */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-mustard/20 blur-[100px] lg:h-96 lg:w-96" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 z-0 h-52 w-52 rounded-full bg-sage-light/30 blur-[90px] lg:h-72 lg:w-72" />

      {/* corner floral, fade halus, desktop only */}
      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-32 w-32 opacity-60 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-32 w-32 opacity-60 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
      </motion.div>

      {/* frame kartu tipis, statis */}
      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-mustard/20 sm:inset-6 lg:inset-10" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        {/* watermark tanda kutip besar di belakang teks arab */}
        <motion.div
          variants={scaleIn}
          style={{ willChange: "transform, opacity" }}
          className="relative flex flex-col items-center"
        >
          <QuoteMark className="pointer-events-none absolute -top-6 left-1/2 h-8 w-11 -translate-x-1/2 opacity-40 lg:-top-8 lg:h-10 lg:w-14" />
          <span className="font-script text-3xl text-burgundy lg:text-4xl">
            ﷽
          </span>
        </motion.div>

        {/* kartu ayat: rounded, soft border, subtle shadow */}
        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-6 w-full rounded-3xl border border-mustard/25 bg-ivory/70 px-5 py-7 shadow-[0_10px_35px_-15px_rgba(58,54,48,0.25)] backdrop-blur-sm sm:px-8 sm:py-9 lg:px-12 lg:py-11"
        >
          <p
            dir="rtl"
            lang="ar"
            className="text-2xl leading-loose text-ink lg:text-3xl"
          >
            وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا
            لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ
          </p>

          <motion.span
            variants={lineGrow}
            style={{ willChange: "transform, opacity" }}
            className="mx-auto my-4 block h-px w-20 origin-center bg-mustard/40 lg:my-5 lg:w-24"
          />

          <p className="text-xs italic tracking-wide text-ink/55 lg:text-sm">
            &ldquo;Wa min āyātihī an khalaqa lakum min anfusikum azwājal
            litaskunū ilaihā wa ja&apos;ala bainakum mawaddataw wa raḥmah, inna
            fī żālika la&apos;āyātil liqaumiy yatafakkarụn&rdquo;
          </p>
        </motion.div>

        {/* ornamen pembatas antara teks arab dan terjemahan */}
        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
        >
          <OrnateDivider className="my-6 h-5 w-40 lg:my-7 lg:w-52" />
        </motion.div>

        {/* terjemahan */}
        <motion.p
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="max-w-lg text-sm leading-relaxed text-ink/80 lg:text-base"
        >
          &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
          terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.&rdquo;
        </motion.p>

        {/* label surat, dengan badge kecil supaya lebih menonjol */}
        <motion.span
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-5 inline-block rounded-full border border-burgundy/30 bg-burgundy/5 px-4 py-1 text-xs font-semibold tracking-[0.25em] text-burgundy lg:mt-6"
        >
          QS. AR-RUM : 21
        </motion.span>
      </motion.div>
    </section>
  );
}
