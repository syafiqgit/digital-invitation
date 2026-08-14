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

/* ---------- Static decoration data (Optimized for CSS Animations) ---------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "0.7deg",
    duration: "8.6s",
    delay: "0.2s",
    isAnimated: true,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "-0.7deg",
    duration: "9.2s",
    delay: "0.3s",
    isAnimated: true,
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
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

const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-2xl md:h-[520px] md:w-[520px] lg:h-[620px] lg:w-[620px]"
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
            className={`h-full w-full ${v.isAnimated ? "animate-sway" : ""}`}
            style={
              v.isAnimated
                ? ({
                    transformOrigin: v.origin,
                    "--end-deg": v.endDeg,
                    animationDuration: v.duration,
                    animationDelay: v.delay,
                    willChange: "transform",
                  } as React.CSSProperties)
                : undefined
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
            className="h-full w-full animate-sway"
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
  return (
    <m.button
      type="button"
      variants={fadeUp}
      onClick={() => onOpen(index)}
      aria-label={`Buka foto galeri ${index + 1}`}
      className={`group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-mustard/30 bg-white/80 p-2 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 ease-out hover:border-mustard/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] sm:rounded-[2rem] sm:p-3 ${
        index % 2 !== 0 ? "sm:mt-8 md:mt-4" : ""
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-mustard/20 bg-gray-100">
        <Image
          src={url}
          alt={`Galeri ${index + 1}`}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
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
    </m.button>
  );
});

/* ---------- Lightbox ---------- */
function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, photos.length, onClose, onNavigate]);

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
      >
        <div className="relative mx-auto aspect-[3/4] max-h-[80dvh] w-full max-w-3xl sm:aspect-[4/5] md:aspect-auto md:h-[75dvh]">
          <Image
            src={photos[index]}
            alt={`Foto galeri ${index + 1} dari ${photos.length}`}
            fill
            sizes="100vw"
            className="rounded-xl object-contain"
            priority
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onNavigate((index - 1 + photos.length) % photos.length)
              }
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink shadow-lg backdrop-blur-md transition-colors hover:bg-burgundy hover:text-white sm:left-6"
            >
              <ChevronIcon direction="left" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % photos.length)}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink shadow-lg backdrop-blur-md transition-colors hover:bg-burgundy hover:text-white sm:right-6"
            >
              <ChevronIcon direction="right" className="h-6 w-6" />
            </button>
            <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink/60 px-4 py-1.5 text-xs font-medium tracking-widest text-white backdrop-blur-sm">
              {index + 1} / {photos.length}
            </span>
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

  const openAt = useCallback((index: number) => setSelectedIndex(index), []);
  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(var(--end-deg, 2deg)) translate3d(0,0,0); }
        }
        .animate-sway { animation: sway ease-in-out infinite; }
        
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg) translate3d(0,0,0); }
          50% { transform: scale(1.1) rotate(var(--rot, 5deg)) translate3d(0,0,0); }
        }
        .animate-gentle-pulse { animation: gentle-pulse ease-in-out infinite; }
      `}</style>

      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/20 blur-[100px] sm:h-80 sm:w-80" />

      <AmbientGlow />
      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-gentle-pulse"
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
            className="animate-gentle-pulse"
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

        <m.div variants={fadeUp} className="mb-12 mt-6 sm:mb-16 md:mb-20">
          <SprigDivider className="h-3 w-36 opacity-70 sm:w-44" />
        </m.div>

        {/* Gallery Grid — ditambah xl:grid-cols-4 supaya di desktop besar
            foto tidak membesar tanpa kontrol saat container melebar ke xl */}
        <m.div
          variants={containerVariants}
          className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-7 lg:gap-8 xl:grid-cols-4"
        >
          {photos.map((url, index) => (
            <PhotoCard
              key={`photo-${index}`}
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
            onClose={closeLightbox}
            onNavigate={setSelectedIndex}
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
