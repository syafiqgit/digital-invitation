"use client";

import { memo, useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import AmbientLayer from "./AmbientLayer";

// --- INTERFACES ---
interface EventSectionProps {
  targetDate?: string;
  akadTime?: string;
  akadVenue?: string;
  akadAddress?: string;
  resepsiTime?: string;
  resepsiVenue?: string;
  resepsiAddress?: string;
  mapsUrl?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventBlockProps {
  title: string;
  time: string;
  venue?: string;
  address?: string;
}

// --- CONSTANTS ---
const DEFAULT_TARGET_DATE = "2026-12-12T08:00:00+07:00";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- FRAMER MOTION VARIANTS (Only for 1-time entrance) ---
// NOTE: willChange permanen dihapus dari semua elemen statis di bawah ini.
// Framer Motion sudah otomatis mengelola will-change selama animasi aktif
// (initial -> whileInView berjalan sekali), jadi override manual permanen
// cuma memaksa browser menahan compositor layer tanpa batas waktu meski
// animasi entrance sudah lama selesai.
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// --- STATIC DECORATION DATA ---
// Nilai sway diselaraskan dengan CoverDecorations: vertikal ±1.2deg,
// horizontal ±1deg, corner ±1.5deg. Durasi & delay di-stagger per elemen
// supaya tidak bergerak serentak seperti mesin.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    origin: "top center",
    endDeg: "1.2deg",
    duration: "7s",
    delay: "0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    origin: "top center",
    endDeg: "1.2deg",
    duration: "7.6s",
    delay: "0.4s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "1deg",
    duration: "8.2s",
    delay: "0.8s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "1deg",
    duration: "8.8s",
    delay: "1.2s",
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.2s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.3s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "1.5deg",
    duration: "6s",
    delay: "0.1s",
  },
];

const countdownUnits = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

// --- PRESENTATIONAL COMPONENTS ---
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
        x2="90"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <line
        x1="130"
        y1="14"
        x2="220"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
});

// Watermark bunga untuk latar card. Sengaja didefinisikan lokal, bukan
// import MiniFlower dari CoverDecorations — file itu ikut menyeret
// BackgroundPattern/FloralCorner/FloralVine + seluruh variant Framer ke
// dalam import graph, dan tree-shaking pada modul "use client" dengan
// side-effect tidak bisa diandalkan. 12 baris SVG lebih murah.
const FlowerWatermark = memo(function FlowerWatermark({
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
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="3" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

const CalendarIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="var(--burgundy)"
      strokeWidth="1.5"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="var(--burgundy)"
      strokeWidth="1.5"
    />
  </svg>
));

const PinIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
    <path
      d="M12 22c4-4.5 7-8.3 7-12a7 7 0 0 0-14 0c0 3.7 3 7.5 7 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
));

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-event-sway"
            style={
              {
                transformOrigin: v.origin,
                "--end-deg": v.endDeg,
                animationDuration: v.duration,
                animationDelay: v.delay,
                // ✅ FIX: willChange permanen dihapus. Browser modern sudah
                // otomatis promote layer selama animation aktif; memaksa
                // willChange statis di 8 elemen (vines+corners) sekaligus
                // bikin compositor menahan 8 GPU layer terus-menerus tanpa
                // henti, dan itu yang bikin sendat pas content-visibility
                // toggle section ini render/skip saat scroll naik-turun.
              } as React.CSSProperties
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-event-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
                // ✅ FIX: sama seperti vines di atas
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5 md:inset-6" />
    </>
  );
});

/* ---------- COUNTDOWN (diisolasi supaya tick per detik tidak
   me-re-render seluruh EventSection, cuma sub-tree ini) ---------- */
function useCountdown(target: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      const total = Math.floor(diff / 1000);
      setTimeLeft({
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

const CountdownDigit = memo(function CountdownDigit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* min-w + px: box melar sendiri kalau digit bertambah jadi 3 angka
          (hari > 99), tapi tetap seragam saat 2 angka. w-16 fixed sebelumnya
          bikin "118" mepet ke tepi border. */}
      <div className="relative flex h-16 min-w-16 items-center justify-center overflow-hidden rounded-2xl border border-mustard/40 bg-white/60 px-3 shadow-sm backdrop-blur-sm sm:h-20 sm:min-w-20 md:h-24 md:min-w-24">
        {/* key={value} memaksa React remount span tiap nilai berubah, sehingga
            animasi CSS restart otomatis tanpa perlu state tambahan. Karena
            CountdownDigit di-memo, praktis cuma 1 digit yang re-render per
            detik — bukan keempatnya. */}
        <span
          key={value}
          className="font-serif animate-digit-tick relative z-10 text-2xl font-semibold tabular-nums text-burgundy sm:text-3xl md:text-4xl"
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
});

// Sub-tree terisolasi: hanya bagian ini yang re-render tiap detik,
// bukan seluruh EventSectionInner (yang berisi banyak decoration m.div).
const CountdownTimer = memo(function CountdownTimer({
  targetDate,
}: {
  targetDate: string;
}) {
  const timeLeft = useCountdown(targetDate);
  return (
    <div className="flex justify-center gap-3 sm:gap-5 md:gap-6">
      {countdownUnits.map((u) => (
        <CountdownDigit key={u.key} value={timeLeft[u.key]} label={u.label} />
      ))}
    </div>
  );
});

/* ---------- EVENT BLOCK ---------- */
const EventBlock = memo(function EventBlock({
  title,
  time,
  venue,
  address,
}: EventBlockProps) {
  return (
    <div className="relative flex flex-col items-center gap-3 px-6 py-8 text-center md:px-8 md:py-9">
      <span className="rounded-full border border-mustard/50 bg-white/50 px-5 py-1.5 text-[10px] font-bold tracking-[0.2em] text-burgundy sm:text-xs">
        {title}
      </span>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink sm:text-base">
        <CalendarIcon />
        <span>{time}</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-xs text-ink/70 sm:text-sm">
        <span className="font-semibold text-ink">{venue}</span>
        <span className="leading-relaxed">{address}</span>
      </div>
    </div>
  );
});

/* ---------- MAIN SECTION ---------- */
function EventSectionInner({
  targetDate = DEFAULT_TARGET_DATE,
  ...props
}: EventSectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-20 sm:px-6">
      {/*
        ENGINEERING NOTE: seluruh animasi di section ini pakai CSS keyframes
        murni (bukan Framer Motion) supaya tidak menahan animation loop di JS
        thread selama section ter-mount. Semua hanya menyentuh transform &
        opacity — dua properti yang bisa dijalankan compositor tanpa layout
        atau paint ulang.

        Nama keyframe di-prefix supaya tidak bentrok: @keyframes bersifat
        global, jadi kalau section lain mendaftarkan nama yang sama, definisi
        terakhir yang mount akan diam-diam menimpa yang ini.

        JANGAN menganimasikan filter, box-shadow, atau backdrop-blur di sini —
        ketiganya memaksa repaint tiap frame dan akan langsung terasa di HP
        mid-range dengan 21 elemen beranimasi seperti sekarang.
      */}
      <style>{`
        @keyframes event-sway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(var(--end-deg, 1.5deg)); }
          75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
        }
        .animate-event-sway {
          animation: event-sway ease-in-out infinite;
        }

        @keyframes digit-tick {
          0%   { opacity: 0; transform: translateY(-40%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-digit-tick {
          animation: digit-tick 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes btn-shine {
          0%        { transform: translateX(-150%) skewX(-20deg); }
          55%, 100% { transform: translateX(400%) skewX(-20deg); }
        }
        .animate-btn-shine {
          animation: btn-shine 4.5s ease-in-out infinite;
        }

        @keyframes garden-beam {
          0%, 100% { opacity: 0.35; transform: translateX(-50%) rotate(0deg); }
          50%      { opacity: 0.6;  transform: translateX(-46%) rotate(3deg); }
        }
        .animate-garden-beam {
          animation: garden-beam 16s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-event-sway,
          .animate-digit-tick,
          .animate-btn-shine,
          .animate-garden-beam { animation: none; }
        }
      `}</style>

      {/* Background Decor (Static) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <FrameLayers />

      {/*
        Sinar matahari lembut. hidden sm:block disengaja — blur 35px pada
        elemen sebesar ini biayanya ada di rasterisasi awal, dan di HP low-end
        itu terasa saat scroll masuk. Efeknya subtil, mobile tidak kehilangan
        banyak.
      */}
      <div
        aria-hidden
        className="animate-garden-beam pointer-events-none absolute -top-1/4 left-1/2 z-[1] hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
          // ✅ FIX: willChange permanen dihapus. Kombinasi filter:blur() +
          // willChange statis adalah yang paling mahal untuk di-rasterize
          // pertama kali browser toggle section ini in/out lewat
          // content-visibility, dan itu yang paling terasa di boundary scroll.
        }}
      />

      {/* Petals, butterflies, sparkles — z-[4]: di atas vine (z-2) & corner
          (z-3), di bawah konten utama (z-10) */}
      <AmbientLayer />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Title */}
        <m.div variants={fadeUp}>
          <span className="inline-block rounded-full border border-mustard/40 bg-white/60 px-5 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy backdrop-blur-sm sm:px-6 sm:text-xs">
            SAVE THE DATE
          </span>
        </m.div>

        <m.h2
          variants={fadeUp}
          className="font-script mt-6 text-4xl font-medium text-ink sm:text-5xl md:text-6xl"
        >
          Saturday, December 12, 2026
        </m.h2>

        <m.div variants={fadeUp} className="my-7">
          <SprigDivider className="h-5 w-44 opacity-90 sm:w-52" />
        </m.div>

        {/* Countdown Timer */}
        <m.div variants={fadeUp}>
          <CountdownTimer targetDate={targetDate} />
        </m.div>

        {/* Event Card Container */}
        <m.div
          variants={fadeUp}
          className="relative mt-12 flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-mustard/30 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
          {/* Garis emas tipis di bibir atas card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--mustard),transparent)] opacity-60"
          />

          {/* Watermark bunga — statis, nol biaya animasi */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-[0.05]"
          >
            <FlowerWatermark className="h-full w-full" />
          </div>

          <EventBlock
            title="HOLY MATRIMONY"
            time={props.akadTime || "08:00 AM - 10:00 AM"}
            venue={props.akadVenue}
            address={props.akadAddress}
          />

          <div className="flex w-full justify-center opacity-50">
            <SprigDivider className="h-3 w-32" />
          </div>

          <EventBlock
            title="RECEPTION"
            time={props.resepsiTime || "11:00 AM - 02:00 PM"}
            venue={props.resepsiVenue}
            address={props.resepsiAddress}
          />
        </m.div>

        {/* Action Button */}
        <m.a
          variants={fadeUp}
          href={props.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#6B2A36] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-transform"
        >
          <span
            aria-hidden
            className="animate-btn-shine pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]"
          />
          <PinIcon />
          Open Location
        </m.a>
      </m.div>
    </section>
  );
}

export default function EventSection(props: EventSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <EventSectionInner {...props} />
    </LazyMotion>
  );
}
