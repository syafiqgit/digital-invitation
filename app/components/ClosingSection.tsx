"use client";

import { memo } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import AmbientLayer from "./AmbientLayer";

interface ClosingSectionProps {
  groomName?: string;
  brideName?: string;
  couplePhotoUrl?: string;
}

const DEFAULT_COUPLE_PHOTO = "https://picsum.photos/id/1025/800/1000";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

/* ---------- Framer Motion variants (Entrance Only) ---------- */
// NOTE: willChange manual permanen dihapus di seluruh file ini — animasi
// entrance cuma sekali (viewport once: true), Framer Motion sudah handle
// will-change otomatis selama animasi aktif.

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

// Foto pasangan: entrance sedikit lebih dramatis dari elemen lain karena
// ini titik fokus visual penutup — scale dari 0.94 dengan durasi lebih
// panjang, bukan fadeUp seragam.
const photoVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.95, ease: EASE },
  },
};

const textLift = {
  textShadow:
    "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data ---------- */
//
// endDeg vertikal 0.9deg dengan durasi 6.5s — sama seperti Gallery, RSVP,
// dan DigitalEnvelope. Section ini tingginya stabil (foto + kartu nama),
// jadi simpangan ujung vine aman terhadap lebar strip.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    origin: "top center",
    endDeg: "0.9deg",
    duration: "6.5s",
    delay: "0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className:
      "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    origin: "top center",
    endDeg: "0.9deg",
    duration: "7s",
    delay: "0.4s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className:
      "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "1deg",
    duration: "7.4s",
    delay: "0.2s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className:
      "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "1deg",
    duration: "7.9s",
    delay: "0.3s",
  },
];

// endDeg positif semua. Pada keyframe dua-arah, tanda minus cuma membalik
// fase (mulai ke kiri dulu), bukan mengubah amplitudo — variasi antar-sudut
// sudah dihasilkan oleh delay yang berbeda.
const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "1.8deg",
    duration: "6.4s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.2s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "1.8deg",
    duration: "6.7s",
    delay: "0.3s",
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

// Dipakai di Names Card (dua sudut). Berbeda dari DigitalEnvelope, di sini
// komponen ini memang terpakai — jangan ikut dihapus.
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

const HeartIcon = memo(function HeartIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
});

// Satu elemen dengan dua gradient stop — bukan dua radial gradient besar
// yang ditumpuk, karena masing-masing kena blur berat dan biaya
// rasterisasinya nyata di HP low-end.
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl md:h-130 md:w-130 lg:h-155 lg:w-155"
      style={{
        background:
          "radial-gradient(circle, rgba(212,175,55,0.10) 0%, rgba(168,181,160,0.08) 45%, transparent 72%)",
      }}
    />
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-2 ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-closing-sway"
            style={
              {
                transformOrigin: v.origin,
                "--end-deg": v.endDeg,
                animationDuration: v.duration,
                animationDelay: v.delay,
                willChange: "transform",
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
          className={`pointer-events-none absolute z-3 h-16 w-16 opacity-90 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-closing-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-1 rounded-4xl border border-sage/25 sm:inset-5 lg:inset-8" />
      <div className="pointer-events-none absolute inset-4 z-1 rounded-[1.8rem] border border-mustard/10 sm:inset-6 lg:inset-10" />
    </>
  );
});

/* ---------- Main Component ---------- */

function ClosingSectionInner({
  groomName = "Alexander",
  brideName = "Amelia",
  couplePhotoUrl = DEFAULT_COUPLE_PHOTO,
}: ClosingSectionProps) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 text-center xs:px-5 sm:px-8 sm:py-24 md:py-28">
      {/*
        Nama keyframe di-prefix "closing-" karena @keyframes bersifat global.
        Sebelumnya file ini mendaftarkan "sway" dan "gentle-pulse" — nama yang
        sama persis dipakai section lain, dan definisi terakhir yang mount
        akan diam-diam menimpa semuanya tanpa error apa pun.

        Blok <style> juga dipindah keluar dari FrameLayers ke sini, sejajar
        dengan section lain: menaruh definisi keyframe di dalam komponen
        dekorasi membuat aturan CSS ikut mati kalau komponen itu suatu saat
        di-unmount atau dipakai bersyarat.

        JANGAN menganimasikan filter, box-shadow, atau backdrop-blur di sini.
      */}
      <style>{`
        @keyframes closing-sway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(var(--end-deg, 1.5deg)); }
          75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
        }
        .animate-closing-sway {
          animation: closing-sway ease-in-out infinite;
        }

        @keyframes closing-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.1) rotate(var(--rot, 5deg)); }
        }
        .animate-closing-pulse {
          animation: closing-pulse ease-in-out infinite;
        }

        @keyframes closing-kenburns {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        .animate-closing-kenburns {
          animation: closing-kenburns 24s ease-in-out infinite;
        }

        @keyframes closing-heartbeat {
          0%, 100%   { transform: scale(1); }
          14%        { transform: scale(1.18); }
          28%        { transform: scale(1); }
          42%        { transform: scale(1.12); }
          56%        { transform: scale(1); }
        }
        .animate-closing-heartbeat {
          animation: closing-heartbeat 3.6s ease-in-out infinite;
        }

        @keyframes closing-beam {
          0%, 100% { opacity: 0.3;  transform: translateX(-50%) rotate(0deg); }
          50%      { opacity: 0.55; transform: translateX(-46%) rotate(3deg); }
        }
        .animate-closing-beam {
          animation: closing-beam 21s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-closing-sway,
          .animate-closing-pulse,
          .animate-closing-kenburns,
          .animate-closing-heartbeat,
          .animate-closing-beam { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <AmbientGlow />
      <FrameLayers />

      {/* Sinar matahari lembut. hidden sm:block disengaja — blur 35px pada
          elemen sebesar ini biayanya di rasterisasi awal, terasa di HP
          low-end saat scroll masuk. */}
      <div
        aria-hidden
        className="animate-closing-beam pointer-events-none absolute -top-1/4 left-1/2 z-1 hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
          willChange: "transform, opacity",
        }}
      />

      {/*
        AmbientLayer versi PENUH di sini — kebalikan dari RsvpWishSection
        dan DigitalEnvelope yang dipangkas. Section ini murni seremonial:
        tidak ada form, tidak ada angka yang harus dibaca teliti, tidak ada
        tombol yang harus ditekan. Kupu-kupu dan kelopak justru memperkuat
        kesan penutup, dan kalau melintas di depan teks pun tidak ada yang
        dirugikan.
      */}
      <AmbientLayer fallDistance="140vh" />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-1 xs:max-w-md sm:max-w-xl sm:px-2 md:max-w-2xl lg:max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Badge */}
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-closing-pulse"
            style={
              {
                "--rot": "6deg",
                animationDuration: "3.4s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>

          <span className="inline-block rounded-full border border-mustard/40 bg-white/80 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy shadow-sm backdrop-blur-sm sm:text-xs">
            THANK YOU
          </span>

          <div
            className="animate-closing-pulse"
            style={
              {
                "--rot": "-6deg",
                animationDuration: "3.7s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>
        </m.div>

        {/* Heading */}
        <m.p
          variants={fadeUp}
          className="font-script mt-5 px-2 text-[2.1rem] font-semibold leading-tight text-ink xs:text-4xl sm:mt-6 sm:text-5xl md:text-[3.4rem]"
          style={textLift}
        >
          It Is an Honor
        </m.p>

        <m.div variants={fadeUp} className="mb-7 mt-3 sm:mb-9 sm:mt-4">
          <SprigDivider className="h-4 w-36 opacity-80 xs:w-44 sm:w-52" />
        </m.div>

        {/* Gorgeous Arch Photo Showcase */}
        <m.div variants={photoVariants} className="group relative mb-7 sm:mb-9">
          <div className="pointer-events-none absolute -inset-3 rounded-b-[2.2rem] rounded-t-[11rem] bg-linear-to-b from-mustard/20 via-transparent to-blush/20 blur-xl sm:-inset-4" />
          <div className="relative aspect-4/5 w-44 overflow-hidden rounded-b-3xl rounded-t-[9rem] border-[3px] border-mustard/60 bg-white/90 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.06)] xs:w-52 sm:w-60 md:w-64 lg:w-72">
            <div className="pointer-events-none absolute inset-1.5 z-10 rounded-b-[1.4rem] rounded-t-[8.4rem] border border-mustard/30" />
            <div className="relative h-full w-full overflow-hidden rounded-b-2xl rounded-t-[8.6rem] bg-gray-100">
              {/*
                FIX (dipertahankan): <img> native diganti next/image. <img>
                murni tidak menghasilkan srcset otomatis, jadi foto ini
                di-load ukuran penuh yang sama untuk semua device. Kalau
                couplePhotoUrl berasal dari domain eksternal baru, tambahkan
                ke images.remotePatterns di next.config.js — jangan revert.

                Wrapper hover dipisah dari <Image>: kalau scale hover dan
                animasi Ken Burns berada di elemen yang sama, animation akan
                menang atas transition dan hover jadi mati total.
              */}
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src={couplePhotoUrl}
                  alt="Couple"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 288px, (min-width: 768px) 256px, (min-width: 640px) 240px, 208px"
                  className="animate-closing-kenburns object-cover"
                  style={{ transformOrigin: "50% 35%" }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/10 via-transparent to-transparent" />
            </div>
          </div>
        </m.div>

        {/* Message */}
        <m.p
          variants={fadeUp}
          className="mx-auto mb-8 max-w-xs px-1 text-sm leading-relaxed text-ink/80 xs:max-w-sm sm:mb-10 sm:max-w-md sm:text-base"
        >
          It is an honor and a joy for us if you would grace us with your
          presence and bestow your blessings upon the newlyweds.
        </m.p>

        {/* Names Card */}
        <m.div
          variants={fadeUp}
          className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-mustard/30 bg-white/85 px-6 py-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md sm:max-w-md sm:rounded-4xl sm:px-10 sm:py-12 md:max-w-lg lg:max-w-xl lg:px-12 lg:py-14"
        >
          {/* Garis emas tipis di bibir atas kartu */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--mustard),transparent)] opacity-60"
          />

          <div className="pointer-events-none absolute inset-2.5 rounded-[1.4rem] border border-mustard/20 sm:inset-3.5 sm:rounded-[1.6rem]" />

          <CornerFlourish className="pointer-events-none absolute left-2 top-2 h-8 w-8 opacity-60 sm:left-3 sm:top-3 sm:h-10 sm:w-10" />
          <CornerFlourish className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 rotate-180 opacity-60 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10" />

          <p
            className="font-script text-3xl font-semibold text-ink sm:text-[2.7rem] lg:text-[3.1rem]"
            style={textLift}
          >
            {brideName}
          </p>
          <div className="my-2 flex items-center justify-center gap-3 sm:my-3">
            <span className="h-px w-8 bg-sage/40 sm:w-12" />
            <span className="font-script text-xl text-burgundy sm:text-2xl">
              &amp;
            </span>
            <span className="h-px w-8 bg-sage/40 sm:w-12" />
          </div>
          <p
            className="font-script text-3xl font-semibold text-ink sm:text-[2.7rem] lg:text-[3.1rem]"
            style={textLift}
          >
            {groomName}
          </p>

          {/* Hati berdetak — satu elemen, transform murni. Penutup yang
              hangat tanpa menambah beban berarti. */}
          <div className="mt-5 flex justify-center sm:mt-6">
            <HeartIcon className="animate-closing-heartbeat h-4 w-4 text-burgundy/50 sm:h-5 sm:w-5" />
          </div>
        </m.div>

        {/* Footer */}
        <m.div
          variants={fadeUp}
          className="mt-9 flex items-center gap-3 text-[10px] uppercase tracking-widest text-ink/50 sm:mt-12 sm:text-xs"
        >
          <span className="h-px w-5 bg-ink/20 sm:w-8" />
          <span>&copy; 2026 Wedding Garden Invitation</span>
          <span className="h-px w-5 bg-ink/20 sm:w-8" />
        </m.div>
      </m.div>
    </section>
  );
}

export default function ClosingSection(props: ClosingSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <ClosingSectionInner {...props} />
    </LazyMotion>
  );
}
