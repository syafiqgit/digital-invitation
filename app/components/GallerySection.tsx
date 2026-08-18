"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";
import AmbientLayer from "./AmbientLayer";

interface GallerySectionProps {
  photos?: string[];
}

const DEFAULT_PHOTOS = [
  "https://picsum.photos/id/1015/800/1000",
  "https://picsum.photos/id/1016/800/600",
  "https://picsum.photos/id/1018/800/1000",
  "https://picsum.photos/id/1025/800/800",
  "https://picsum.photos/id/1041/800/1000",
  "https://picsum.photos/id/1062/800/600",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer Motion variants (Entrance Only) ---------- */
// NOTE: willChange manual permanen dihapus dari seluruh file ini (termasuk
// yang sebelumnya dipasang per-PhotoCard — kalikan jumlah foto di galeri,
// itu banyak compositor layer yang ditahan browser tanpa batas waktu
// padahal animasinya cuma sekali, once: true). Framer Motion sudah
// mengelola will-change otomatis selama animasi berjalan.
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

// Foto masuk berselang-seling dari kiri/kanan mengikuti kolomnya, bukan
// semuanya dari bawah — terbaca lebih hidup pada grid.
const photoVariants: Variants = {
  hidden: (isLeftCol: boolean) => ({
    opacity: 0,
    y: 28,
    x: isLeftCol ? -18 : 18,
    scale: 0.94,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE },
  },
};

// FIX: fungsi dinamis berbasis `custom` HANYA bisa hidup di dalam objek
// Variants, bukan langsung di prop initial/animate/exit. Prop tersebut
// bertipe TargetAndTransition | VariantLabels — memberi fungsi ke sana
// gagal saat build (lolos di dev karena runtime tetap jalan).
// Arah geser diambil dari `custom` yang di-pass ke AnimatePresence + m.div.
const lightboxSlide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -40,
    transition: { duration: 0.32, ease: EASE },
  }),
};

/* ---------- Static decoration data (Optimized for CSS Animations) ---------- */
//
// endDeg vertikal 0.9deg (Cover/Event pakai 1.2deg). GallerySection tumbuh
// mengikuti jumlah foto: 6 foto di mobile = 3 baris, tinggi total ~1300px.
// Simpangan ujung vine = tinggi x tan(sudut) — pada 0.9deg itu ~20px, masih
// di dalam lebar strip 24px. Durasi 6.5s/7s dijaga pendek supaya kecepatan
// sudutnya ~80% dari Event, bukan terasa lamban seperti Story.
//
// KALAU MENAMBAH FOTO: 6-8 foto aman di 0.9deg. Di atas 12 foto turunkan
// ke 0.6deg. Gejala kalau kelewatan: scroll ke bawah, muncul celah putih
// antara vine dan tepi layar.
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    origin: "top center",
    endDeg: "0.9deg",
    duration: "6.5s",
    delay: "0s",
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    origin: "top center",
    endDeg: "0.9deg",
    duration: "7s",
    delay: "0.4s",
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "1deg",
    duration: "7.4s",
    delay: "0.2s",
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
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

/* ---------- Small presentational pieces ---------- */
const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  const ANGLES = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES.map((deg) => (
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
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
});

// UI Icons (Simplified SVG wrappers)
const CloseIcon = memo(({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));

const ChevronIcon = memo(
  ({
    className = "",
    direction = "left",
  }: {
    className?: string;
    direction?: "left" | "right";
  }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
      />
    </svg>
  ),
);

const ZoomIcon = memo(({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
));

// CATATAN: AmbientGlow dan blur sage-light sebelumnya adalah dua radial
// gradient besar yang ditumpuk di titik yang sama persis — keduanya kena
// blur berat (blur-2xl + blur-[100px]) dan biaya rasterisasinya nyata di
// HP low-end. Digabung jadi satu elemen dengan dua gradient stop.
const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl md:h-[520px] md:w-[520px] lg:h-[620px] lg:w-[620px]"
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
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className="h-full w-full animate-gallery-sway"
            style={
              {
                transformOrigin: v.origin,
                "--end-deg": v.endDeg,
                animationDuration: v.duration,
                animationDelay: v.delay,
                // ✅ FIX: willChange permanen dihapus — pola sama seperti
                // Event/StorySection. Section ini juga dibungkus
                // content-visibility di MainContent; 8 layer permanen +
                // toggle render/skip saat scroll adalah sumber sendat.
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
            className="h-full w-full animate-gallery-sway"
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
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- Photo grid ---------- */
const PhotoCard = memo(function PhotoCard({
  url,
  index,
  onOpen,
}: {
  url: string;
  index: number;
  onOpen: (index: number) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <m.button
      type="button"
      variants={photoVariants}
      custom={index % 2 === 0}
      onClick={() => onOpen(index)}
      aria-label={`Buka foto galeri ${index + 1}`}
      className={`group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-mustard/30 bg-white/80 p-2 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 ease-out hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] sm:rounded-[2rem] sm:p-3 ${
        index % 2 !== 0 ? "sm:mt-8 md:mt-4" : ""
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-mustard/20 bg-blush/10">
        {/* Shimmer placeholder — berhenti total begitu foto selesai dimuat,
            jadi tidak ada animasi yang menggantung setelah load. */}
        {!isLoaded && (
          <div
            aria-hidden
            className="animate-gallery-shimmer absolute inset-0 bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.65)_50%,transparent_70%)]"
          />
        )}

        <Image
          src={url}
          alt={`Galeri ${index + 1}`}
          fill
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Inner ring putih tipis — memberi kesan matting/passe-partout */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/35"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-burgundy/70 via-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex translate-y-3 flex-col items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ZoomIcon className="h-5 w-5 text-white opacity-95" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white sm:text-[10px]">
              Lihat
            </span>
          </div>
        </div>
      </div>

      {/* Aksen sudut emas — muncul saat hover, murni opacity */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l border-t border-mustard opacity-0 transition-opacity duration-300 group-hover:opacity-80 sm:left-4 sm:top-4"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b border-r border-mustard opacity-0 transition-opacity duration-300 group-hover:opacity-80 sm:bottom-4 sm:right-4"
      />
    </m.button>
  );
});

/* ---------- Lightbox ---------- */
function Lightbox({
  photos,
  index,
  direction,
  onClose,
  onNavigate,
}: {
  photos: string[];
  index: number;
  direction: number;
  onClose: () => void;
  onNavigate: (index: number, direction: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length, 1),
    [index, photos.length, onNavigate],
  );
  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length, -1),
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, onClose]);

  // Swipe pakai touch event manual, BUKAN prop `drag` milik Framer Motion.
  // LazyMotion dengan `domAnimation` sengaja tidak memuat fitur drag —
  // memakai `drag` di sini akan gagal diam-diam (tidak error, cuma tidak
  // jalan) kecuali diganti ke `domMax`, yang menambah bundle cukup besar
  // hanya demi satu gestur. Dua listener ringan ini jauh lebih murah.
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-3 backdrop-blur-md sm:p-5"
    >
      <m.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-h-[90dvh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-mustard/30 bg-ivory p-2 shadow-2xl sm:p-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative mx-auto aspect-[3/4] max-h-[72dvh] w-full max-w-3xl sm:aspect-[4/5] md:aspect-auto md:h-[68dvh]">
          {/* mode="wait" supaya hanya satu foto ter-mount pada satu waktu —
              menghindari dua bitmap besar hidup bersamaan saat transisi.
              custom={direction} diteruskan ke variants lightboxSlide. */}
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={index}
              custom={direction}
              variants={lightboxSlide}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={photos[index]}
                alt={`Foto galeri ${index + 1} dari ${photos.length}`}
                fill
                sizes="100vw"
                className="rounded-xl object-contain"
                priority
              />
            </m.div>
          </AnimatePresence>
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink shadow-lg backdrop-blur-md transition-colors hover:bg-burgundy hover:text-white sm:left-6"
            >
              <ChevronIcon direction="left" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink shadow-lg backdrop-blur-md transition-colors hover:bg-burgundy hover:text-white sm:right-6"
            >
              <ChevronIcon direction="right" className="h-6 w-6" />
            </button>

            {/* Strip thumbnail — navigasi langsung + konteks posisi */}
            <div className="mt-2 flex items-center justify-center gap-2 overflow-x-auto px-2 pb-1 sm:mt-3 sm:gap-2.5">
              {photos.map((thumb, i) => (
                <button
                  key={`thumb-${thumb}`}
                  type="button"
                  onClick={() => onNavigate(i, i > index ? 1 : -1)}
                  aria-label={`Ke foto ${i + 1}`}
                  aria-current={i === index}
                  className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 sm:h-14 sm:w-14 ${
                    i === index
                      ? "scale-105 border-burgundy opacity-100"
                      : "border-mustard/30 opacity-50 hover:opacity-85"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup pratinjau"
          className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink shadow-lg backdrop-blur-md transition-colors hover:bg-burgundy hover:text-white sm:right-6 sm:top-6"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </m.div>
    </m.div>
  );
}

/* ---------- Main component ---------- */
function GallerySectionInner({ photos = DEFAULT_PHOTOS }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const openAt = useCallback((index: number) => {
    setDirection(1);
    setSelectedIndex(index);
  }, []);
  const closeLightbox = useCallback(() => setSelectedIndex(null), []);
  const navigate = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setSelectedIndex(index);
  }, []);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      {/*
        Nama keyframe di-prefix "gallery-" karena @keyframes bersifat global.
        Sebelumnya file ini mendaftarkan "sway" dan "gentle-pulse" — nama yang
        sama persis dipakai section lain, dan definisi terakhir yang mount
        akan diam-diam menimpa semuanya tanpa error apa pun.

        Keyframe sway sekarang dua arah (0 -> +deg -> 0 -> -deg -> 0), identik
        dengan CoverDecorations. Versi lama satu arah saja, jadi ornamen
        terlihat mendorong ke satu sisi lalu balik, bukan berayun.

        JANGAN menganimasikan filter, box-shadow, atau backdrop-blur di sini.
      */}
      <style>{`
        @keyframes gallery-sway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(var(--end-deg, 1.5deg)); }
          75%      { transform: rotate(calc(var(--end-deg, 1.5deg) * -1)); }
        }
        .animate-gallery-sway {
          animation: gallery-sway ease-in-out infinite;
        }

        @keyframes gallery-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.1) rotate(var(--rot, 5deg)); }
        }
        .animate-gallery-pulse {
          animation: gallery-pulse ease-in-out infinite;
        }

        @keyframes gallery-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gallery-shimmer {
          animation: gallery-shimmer 1.6s ease-in-out infinite;
        }

        @keyframes gallery-beam {
          0%, 100% { opacity: 0.3;  transform: translateX(-50%) rotate(0deg); }
          50%      { opacity: 0.55; transform: translateX(-46%) rotate(3deg); }
        }
        .animate-gallery-beam {
          animation: gallery-beam 17s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-gallery-sway,
          .animate-gallery-pulse,
          .animate-gallery-shimmer,
          .animate-gallery-beam { animation: none; }
        }
      `}</style>

      {/* Background Decor */}
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
        className="animate-gallery-beam pointer-events-none absolute -top-1/4 left-1/2 z-[1] hidden h-[150%] w-3/5 -translate-x-1/2 sm:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 42%, rgba(255,242,208,0.5) 50%, transparent 58%)",
          filter: "blur(35px)",
          // ✅ FIX: willChange permanen dihapus — sama alasan seperti
          // Event/StorySection.
        }}
      />

      {/* Petals, butterflies, sparkles — z-[4]: di atas vine (z-2) & corner
          (z-3), di bawah konten utama (z-10) */}
      <AmbientLayer fallDistance="160vh" />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-gallery-pulse"
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
            OUR GALLERY
          </span>

          <div
            className="animate-gallery-pulse"
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

        <m.h2
          variants={fadeUp}
          className="font-script mt-5 text-4xl font-semibold text-ink sm:text-5xl md:text-6xl"
        >
          Moment of Togetherness
        </m.h2>

        <m.p
          variants={fadeUp}
          className="mt-3 text-xs italic text-ink/55 sm:text-sm"
        >
          {photos.length} momen yang kami simpan
        </m.p>

        <m.div variants={fadeUp} className="mb-12 mt-6 sm:mb-16 md:mb-20">
          <SprigDivider className="h-4 w-40 opacity-80 sm:w-48" />
        </m.div>

        {/* Gallery Grid — xl:grid-cols-4 supaya di desktop besar foto tidak
            membesar tanpa kontrol saat container melebar ke xl */}
        <m.div
          variants={containerVariants}
          className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-7 lg:gap-8 xl:grid-cols-4"
        >
          {photos.map((url, index) => (
            <PhotoCard
              // FIX: key sebelumnya `photo-${index}` — kalau daftar foto
              // nanti diurutkan ulang atau ada yang dihapus, React akan
              // mencocokkan DOM ke foto yang salah dan state isLoaded
              // ikut tertukar. URL stabil per foto.
              key={url}
              url={url}
              index={index}
              onOpen={openAt}
            />
          ))}
        </m.div>
      </m.div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            photos={photos}
            index={selectedIndex}
            direction={direction}
            onClose={closeLightbox}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default function GallerySection(props: GallerySectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <GallerySectionInner {...props} />
    </LazyMotion>
  );
}
