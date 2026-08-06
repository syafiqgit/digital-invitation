"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

const lineGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

const fireflies = [
  { left: "8%", top: "20%", duration: 7, delay: 0 },
  { left: "18%", top: "70%", duration: 8.5, delay: 1.5 },
  { left: "88%", top: "24%", duration: 7.5, delay: 3 },
  { left: "92%", top: "68%", duration: 9, delay: 2 },
  { left: "50%", top: "10%", duration: 8, delay: 4.5 },
] as const;

const butterflies = [
  { left: "6%", top: "35%", color: "var(--coral)", duration: 18, delay: 0 },
  { left: "90%", top: "45%", color: "var(--burgundy)", duration: 20, delay: 5 },
] as const;

const floatingPetals = [
  { left: "12%", size: 6, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "80%", size: 7, duration: 13, delay: 4, color: "var(--sage-light)" },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

const bottomFairyLights = [
  { cx: 30, cy: 0 },
  { cx: 70, cy: 14 },
  { cx: 110, cy: 4 },
  { cx: 150, cy: 16 },
  { cx: 190, cy: 4 },
] as const;

const scatterEdges = [
  { top: "3%", left: "3%", type: "bloom", color: "var(--burgundy)" },
  { top: "3%", left: "97%", type: "bloom", color: "var(--coral)" },
  { top: "97%", left: "3%", type: "bloom", color: "var(--coral)" },
  { top: "97%", left: "97%", type: "bloom", color: "var(--burgundy)" },
  { top: "45%", left: "1%", type: "leaf", rot: -20 },
  { top: "45%", left: "99%", type: "leaf", rot: 20 },
] as const;

const extraCornerBlooms = [
  {
    cls: "left-3 top-3 sm:left-5 sm:top-5 lg:left-10 lg:top-10",
    color: "var(--sage-light)",
  },
  {
    cls: "right-3 top-3 sm:right-5 sm:top-5 lg:right-10 lg:top-10",
    color: "var(--coral)",
  },
  {
    cls: "bottom-3 left-3 sm:bottom-5 sm:left-5 lg:bottom-10 lg:left-10",
    color: "var(--coral)",
  },
  {
    cls: "bottom-3 right-3 sm:bottom-5 sm:right-5 lg:bottom-10 lg:right-10",
    color: "var(--sage-light)",
  },
] as const;

const QuoteMark = memo(function QuoteMark({
  className = "",
}: {
  className?: string;
}) {
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
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
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
        {ANGLES_5.map((deg) => (
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
});

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

export default function QuoteSection() {
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

      <motion.svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 w-full opacity-80 lg:h-20"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.1 }}
      >
        {bottomFairyLights.map((f, i) => (
          <g key={`bfl-${i}`}>
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
                duration: 2.4 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5 + i * 0.3,
              }}
            />
          </g>
        ))}
      </motion.svg>

      <div className="hidden sm:contents">
        {scatterEdges.map((item, i) => (
          <div
            key={`scatter-${i}`}
            style={{ top: item.top, left: item.left }}
            className="pointer-events-none absolute z-[1]"
          >
            {item.type === "bloom" ? (
              <MiniBloom
                className="h-6 w-6 opacity-85 lg:h-7 lg:w-7"
                color={item.color}
              />
            ) : (
              <MiniLeaf
                className="h-6 w-6 opacity-80 lg:h-7 lg:w-7"
                rot={item.rot}
              />
            )}
          </div>
        ))}
      </div>

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
        className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-8 opacity-45 sm:block sm:w-10 lg:w-12 lg:opacity-55"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top center" }}
          className="h-full w-full"
        >
          <FloralVine orientation="vertical" className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-8 -scale-x-100 opacity-40 sm:block sm:w-10 lg:w-12 lg:opacity-50"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, -1.5, 0, 1.5, 0] }}
          transition={{
            duration: 6.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          style={{ transformOrigin: "top center" }}
          className="h-full w-full"
        >
          <FloralVine orientation="vertical" className="h-full w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-32 w-32 opacity-60 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-32 w-32 opacity-60 sm:block lg:h-44 lg:w-44"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{
            duration: 6.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -left-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-36 lg:w-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
        transition={{ delay: 0.25 }}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{
            duration: 6.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-y-100" />
        </motion.div>
      </motion.div>

      {extraCornerBlooms.map((c, i) => (
        <motion.div
          key={`ecb-${i}`}
          className={`pointer-events-none absolute z-[2] hidden h-5 w-5 opacity-85 sm:block sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${c.cls}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeOnly}
          transition={{ delay: 0.3 + i * 0.05 }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              duration: 3.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="h-full w-full"
          >
            <MiniBloom className="h-full w-full" color={c.color} />
          </motion.div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-sage/25 sm:inset-6 lg:inset-10" />
      <div className="pointer-events-none absolute inset-7 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block lg:inset-12" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
      >
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

        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-6 w-full rounded-3xl border border-mustard/30 bg-ivory/90 px-5 py-7 shadow-[0_10px_35px_-15px_rgba(58,54,48,0.3)] backdrop-blur-sm sm:px-8 sm:py-9 lg:px-12 lg:py-11"
        >
          <p
            dir="rtl"
            lang="ar"
            className="text-2xl font-medium leading-loose text-ink lg:text-3xl"
          >
            وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا
            لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً
            ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ
          </p>

          <motion.span
            variants={lineGrow}
            style={{ willChange: "transform, opacity" }}
            className="mx-auto my-4 block h-px w-20 origin-center bg-mustard/50 lg:my-5 lg:w-24"
          />

          <p className="text-xs font-medium italic tracking-wide text-ink/70 lg:text-sm">
            &ldquo;Wa min āyātihī an khalaqa lakum min anfusikum azwājal
            litaskunū ilaihā wa ja&apos;ala bainakum mawaddataw wa raḥmah, inna
            fī żālika la&apos;āyātil liqaumiy yatafakkarụn&rdquo;
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
        >
          <OrnateDivider className="my-6 h-5 w-40 lg:my-7 lg:w-52" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="max-w-lg text-sm font-medium leading-relaxed text-ink/90 lg:text-base"
        >
          &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
          terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.&rdquo;
        </motion.p>

        <motion.span
          variants={fadeUp}
          style={{ willChange: "transform, opacity" }}
          className="mt-5 inline-block rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-xs font-bold tracking-[0.25em] text-burgundy lg:mt-6"
        >
          QS. AR-RUM : 21
        </motion.span>
      </motion.div>
    </section>
  );
}
