"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import AmbientLayer from "./AmbientLayer";

/* =========================================================================
   TYPE ALIASES

   Union di-alias supaya generic tetap satu kata. Formatter yang memproses
   .tsx sebagai JavaScript membaca "<" pada useState<...> sebagai operator
   perbandingan dan memotong ekspresinya jadi statement rusak — pernah
   terjadi di RsvpWishSection. Generic pendek jauh lebih sulit dirusak.
   ========================================================================= */
type TimeoutId = ReturnType<typeof setTimeout>;

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
}

interface GiftAddress {
  recipient: string;
  phone: string;
  address: string;
}

interface DigitalEnvelopeSectionProps {
  accounts?: BankAccount[];
  giftAddress?: GiftAddress;
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

const DEFAULT_GIFT_ADDRESS: GiftAddress = {
  recipient: "Amelia & Alexander",
  phone: "+62 812-3456-7890",
  address:
    "45 Mawar Indah Street, RT 03/RW 05, Gardenia Sub-district, South Jakarta 12550",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;
const COPY_RESET_MS = 2500;

/* ---------- Framer Motion variants (Entrance Only) ---------- */
// NOTE: GPU_HINT (willChange permanen) dihapus dari elemen entrance.
// viewport once: true berarti animasinya jalan sekali; menahan compositor
// layer selamanya setelah itu cuma buang GPU memory. Framer Motion sudah
// toggle will-change otomatis selama animasi aktif.
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

// Kartu rekening masuk dari sisi kolomnya masing-masing.
const cardVariants: Variants = {
  hidden: (fromLeft: boolean) => ({
    opacity: 0,
    y: 24,
    x: fromLeft ? -20 : 20,
    scale: 0.98,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE },
  },
};

const textLift = {
  textShadow:
    "0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data ---------- */
//
// endDeg vertikal 0.9deg dengan durasi 6.5s — sama seperti Gallery & RSVP.
// Section ini tingginya stabil (dua kartu rekening + satu kartu alamat),
// jadi simpangan ujung vine masih aman terhadap lebar strip.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className:
      "absolute left-0 top-0 h-full w-5 opacity-70 xs:w-6 sm:w-10 lg:w-14",
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
      "absolute right-0 top-0 h-full w-5 opacity-70 xs:w-6 sm:w-10 lg:w-14",
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
      "absolute left-0 top-0 h-5 w-full opacity-70 xs:h-6 sm:h-10 lg:h-14",
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
      "absolute bottom-0 left-0 h-5 w-full opacity-70 xs:h-6 sm:h-10 lg:h-14",
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

const CopyIcon = memo(function CopyIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
});

const CheckIcon = memo(function CheckIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
});

const HomeIcon = memo(function HomeIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="var(--burgundy)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.8" />
      <path d="M9.5 21v-6h5v6" />
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
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl xs:h-[340px] xs:w-[340px] sm:h-[420px] sm:w-[420px] lg:h-[620px] lg:w-[620px]"
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
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-envelope-sway"
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
          className={`pointer-events-none absolute z-[3] h-12 w-12 opacity-90 xs:h-16 xs:w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-envelope-sway"
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

      <div className="pointer-events-none absolute inset-2.5 z-[1] rounded-[1.5rem] border border-sage/25 xs:inset-3 sm:inset-5 sm:rounded-[2rem] lg:inset-8" />
    </>
  );
});

// Aksen sudut emas untuk kartu — muncul saat hover, murni opacity.
const CardCornerAccents = memo(function CardCornerAccents() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 rounded-tl-lg border-l border-t border-mustard opacity-0 transition-opacity duration-500 group-hover:opacity-70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3.5 right-3.5 h-5 w-5 rounded-br-lg border-b border-r border-mustard opacity-0 transition-opacity duration-500 group-hover:opacity-70"
      />
    </>
  );
});

/* ---------- Copy button (shared) ---------- */
const CopyButton = memo(function CopyButton({
  copied,
  onClick,
  labelIdle,
  labelCopied,
  className = "",
  shineDelay = "0s",
}: {
  copied: boolean;
  onClick: () => void;
  labelIdle: string;
  labelCopied: string;
  className?: string;
  shineDelay?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-full border py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        copied
          ? "border-sage bg-sage/10 text-sage-dark shadow-inner"
          : "border-mustard/60 bg-white/90 text-burgundy shadow-sm hover:border-transparent hover:bg-[#6B2A36] hover:text-white hover:shadow-md"
      } ${className}`}
    >
      {/* Shine dimatikan saat state copied supaya konfirmasi terbaca tenang */}
      {!copied && (
        <span
          aria-hidden
          className="animate-envelope-shine pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.22),transparent)]"
          style={{ animationDelay: shineDelay }}
        />
      )}
      {copied ? (
        <CheckIcon className="animate-envelope-check relative z-10 h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="relative z-10 h-3.5 w-3.5" />
      )}
      <span className="relative z-10">{copied ? labelCopied : labelIdle}</span>
    </button>
  );
});

/* ---------- Main Component ---------- */

function DigitalEnvelopeSectionInner({
  accounts = DEFAULT_ACCOUNTS,
  giftAddress = DEFAULT_GIFT_ADDRESS,
}: DigitalEnvelopeSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // FIX: sebelumnya kedua handler memanggil setTimeout tanpa cleanup —
  // kalau tamu menekan copy lalu meninggalkan halaman sebelum 2.5 detik,
  // timer tetap jalan dan setState dipanggil pada komponen yang sudah
  // unmount. Ref + cleanup di useEffect menutup keduanya. Satu ref cukup
  // karena hanya satu konfirmasi yang aktif pada satu waktu.
  const resetTimerRef = useRef<TimeoutId | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const scheduleReset = useCallback((fn: () => void) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(fn, COPY_RESET_MS);
  }, []);

  // navigator.clipboard butuh secure context (HTTPS/localhost) dan bisa
  // ditolak. Sebelumnya hasilnya tidak diperiksa sama sekali — kalau gagal,
  // tombol tetap menampilkan "Successfully Copied" padahal tidak ada apa pun
  // di clipboard tamu.
  const copyText = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // jatuh ke fallback di bawah
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }, []);

  const handleCopy = useCallback(
    async (text: string, id: string) => {
      const ok = await copyText(text);
      if (!ok) return;
      setCopiedAddress(false);
      setCopiedId(id);
      scheduleReset(() => setCopiedId(null));
    },
    [copyText, scheduleReset],
  );

  const handleCopyAddress = useCallback(async () => {
    const fullText = `Recipient: ${giftAddress.recipient}\nPhone: ${giftAddress.phone}\nAddress: ${giftAddress.address}`;
    const ok = await copyText(fullText);
    if (!ok) return;
    setCopiedId(null);
    setCopiedAddress(true);
    scheduleReset(() => setCopiedAddress(false));
  }, [copyText, giftAddress, scheduleReset]);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-3 py-16 xs:px-4 sm:px-6 sm:py-24 lg:py-28">
      {/*
        Nama keyframe di-prefix "envelope-" karena @keyframes bersifat global.
        Sebelumnya file ini mendaftarkan "sway" dan "gentle-pulse" — nama yang
        sama persis dipakai section lain, dan definisi terakhir yang mount
        akan diam-diam menimpa semuanya tanpa error apa pun.

        Blok <style> juga dipindah keluar dari FrameLayers ke sini, sejajar
        dengan section lain: menaruh definisi keyframe di dalam komponen
        dekorasi membuat aturan CSS ikut mati kalau komponen itu suatu saat
        di-unmount atau dipakai bersyarat.

        Keyframe sway sekarang dua arah, identik dengan CoverDecorations.
        JANGAN menganimasikan filter, box-shadow, atau backdrop-blur di sini.
      */}
      <style>{`
        @keyframes envelope-sway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(var(--end-deg, 1.5deg)); }
          75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
        }
        .animate-envelope-sway {
          animation: envelope-sway ease-in-out infinite;
        }

        @keyframes envelope-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.1) rotate(var(--rot, 5deg)); }
        }
        .animate-envelope-pulse {
          animation: envelope-pulse ease-in-out infinite;
        }

        @keyframes envelope-shine {
          0%        { transform: translateX(-150%) skewX(-20deg); }
          55%, 100% { transform: translateX(400%) skewX(-20deg); }
        }
        .animate-envelope-shine {
          animation: envelope-shine 5s ease-in-out infinite;
        }

        @keyframes envelope-check {
          0%   { opacity: 0; transform: scale(0.4); }
          60%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-envelope-check {
          animation: envelope-check 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes envelope-beam {
          0%, 100% { opacity: 0.3;  transform: translateX(-50%) rotate(0deg); }
          50%      { opacity: 0.55; transform: translateX(-46%) rotate(3deg); }
        }
        .animate-envelope-beam {
          animation: envelope-beam 20s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-envelope-sway,
          .animate-envelope-pulse,
          .animate-envelope-shine,
          .animate-envelope-check,
          .animate-envelope-beam { animation: none; }
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
        className="animate-envelope-beam pointer-events-none absolute -top-1/4 left-1/2 z-[1] hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
          willChange: "transform, opacity",
        }}
      />

      {/*
        AmbientLayer dipangkas seperti di RsvpWishSection, bukan versi penuh
        Gallery. Alasannya sama: ini section transaksional — tamu sedang
        membaca nomor rekening digit per digit lalu menekan tombol copy.
        Kupu-kupu yang melintas di depan angka mengganggu ketelitian itu.
        Petal disisakan 2 di tepi jauh dari kartu, sparkle dibiarkan.
      */}
      <AmbientLayer
        butterflies={[]}
        petals={[
          { left: "5%", size: 13, duration: 12, delay: 0.5, drift: 14 },
          { left: "93%", size: 12, duration: 14, delay: 4, drift: -12 },
        ]}
        fallDistance="150vh"
      />

      <m.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-3 text-center xs:px-4 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-2 xs:gap-3">
          <div
            className="animate-envelope-pulse shrink-0"
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
            className="animate-envelope-pulse shrink-0"
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
          className="font-script mt-4 text-[2rem] font-semibold leading-tight text-ink xs:mt-5 xs:text-4xl sm:text-5xl"
          style={textLift}
        >
          Digital Envelope &amp; Gifts
        </m.p>

        <m.div variants={fadeUp} className="mb-8 mt-5 xs:mt-6 sm:mb-12">
          <SprigDivider className="h-4 w-36 opacity-80 xs:w-40 sm:w-48" />
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
          {accounts.map((acc, i) => (
            <m.div
              variants={cardVariants}
              custom={i % 2 === 0}
              key={acc.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-mustard/30 bg-white/85 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] xs:p-6 sm:rounded-[2rem]"
            >
              {/* Garis emas tipis di bibir atas kartu */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--mustard),transparent)] opacity-60"
              />
              <CardCornerAccents />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-serif text-lg font-bold tracking-wide text-burgundy xs:text-xl">
                    {acc.bankName}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mustard/10 transition-colors group-hover:bg-mustard/20 xs:h-10 xs:w-10">
                    <GiftIcon className="h-[18px] w-[18px] xs:h-5 xs:w-5" />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 xs:text-[11px]">
                    Account Number
                  </p>
                  {/* tabular-nums: digit selebar sama supaya nomor rekening
                      tidak "bergoyang" lebarnya antar-kartu */}
                  <p className="break-all font-mono text-lg font-bold tabular-nums tracking-wider text-ink xs:text-xl sm:text-2xl">
                    {acc.accountNumber}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink/80">
                    a.n. {acc.accountHolder}
                  </p>
                </div>
              </div>

              <CopyButton
                copied={copiedId === acc.id}
                onClick={() => handleCopy(acc.accountNumber, acc.id)}
                labelIdle="Copy Account Number"
                labelCopied="Successfully Copied"
                className="relative w-full"
                shineDelay={`${i * 1.6}s`}
              />
            </m.div>
          ))}
        </m.div>

        <m.div
          variants={fadeUp}
          className="group relative w-full overflow-hidden rounded-3xl border border-mustard/30 bg-white/85 p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] xs:p-6 sm:rounded-[2rem] sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--mustard),transparent)] opacity-60"
          />
          <CardCornerAccents />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <h4 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-ink transition-colors group-hover:text-burgundy xs:text-lg">
                <HomeIcon className="h-4 w-4 shrink-0" />
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
              <CopyButton
                copied={copiedAddress}
                onClick={handleCopyAddress}
                labelIdle="Copy Address"
                labelCopied="Address Copied"
                className="w-full px-8 sm:w-auto"
                shineDelay="3.2s"
              />
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
