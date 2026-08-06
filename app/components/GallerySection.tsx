"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface GallerySectionProps {
  photos?: string[];
}

/* ------------------------------------------------------------------ */
/*  Contoh URL foto — pengguna bisa mengganti array `photos` ini dengan  */
/*  URL foto pre-wedding asli mereka sendiri lewat prop `photos`.        */
/*  Sumber contoh diambil dari galeri publik pre-wedding/engagement.     */
/* ------------------------------------------------------------------ */
const SAMPLE_PHOTOS = [
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/e416b6b6-ce84-52a0-bcc0-01d3038ad6e5/eb564097-eeed-5348-b070-987d451fed27.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/32ca7a2e-dd01-5493-b439-063094614a71/d1d3938e-c060-561f-b224-1e83e6d54654.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/d5d9fbc4-805e-5e29-a42c-2877e164d835/caefe677-3671-51a3-9e93-cc30b03e6bec.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/274f63ea-91ed-5210-9f19-1b961a9139bd/0dc282b4-26ba-5ef9-bd96-e14f7e8512e4.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ce40bed0-c9a9-5972-ac6d-e75e02a87b3c/3fba9e44-e644-569f-8c63-b371c7a50aae.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/b4fade35-f203-5bdd-a5b9-f8db39510728/58f1bf46-970a-5ded-a50c-0ec15974a70d.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/d872ee9f-8336-5222-9b24-232c70141e25/9b623346-d832-5115-83bf-2536a8f63d59.jpg",
];

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - `type: spring` diganti duration+ease custom (konsisten dgn section */
/*    lain) supaya waktu selesai tiap tile terprediksi, tidak overshoot. */
/*  - viewport once: true -> animasi grid jalan sekali saat scroll masuk.*/
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const itemPop: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

/* Arah slide untuk transisi antar-foto di lightbox: dipakai supaya      */
/* pergantian foto terasa terarah (kanan->kiri saat next, sebaliknya     */
/* saat prev), bukan sekadar crossfade datar.                            */
const lightboxVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -60 : 60,
    scale: 0.97,
    transition: { duration: 0.3, ease: EASE },
  }),
};

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 8h2.5l1-2h9l1 2H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
        stroke="var(--sage)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="3.4" stroke="var(--sage)" strokeWidth="1.4" />
    </svg>
  );
}

function ZoomIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 8v6M8 11h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

/* pola span masonry — dibuat lebih variatif & "ramai" dibanding versi   */
/* lama (6 slot seragam), sekarang 7 slot dengan ritme besar-kecil yang  */
/* lebih dinamis mengisi grid 4 kolom.                                   */
const placeholderSpans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
];

function PlaceholderTile({ span }: { span: string }) {
  return (
    <motion.div
      variants={itemPop}
      className={`${span} flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-sage/40 bg-gradient-to-br from-blush/40 to-sage-light/30 p-4`}
    >
      <CameraIcon className="h-7 w-7 opacity-70" />
      <span className="text-center text-[10px] font-medium tracking-wide text-ink/50">
        Foto segera hadir
      </span>
    </motion.div>
  );
}

function PhotoTile({
  src,
  span,
  onClick,
}: {
  src: string;
  span: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={itemPop}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ willChange: "transform, opacity" }}
      className={`${span} group relative overflow-hidden rounded-xl ring-1 ring-mustard/20`}
    >
      <img
        src={src}
        alt="Galeri pre-wedding"
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
      />
      {/* overlay gradient + ikon zoom saat hover, murah karena hanya   */}
      {/* opacity yang berubah (tidak ikut memicu layout).              */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ivory/90 text-burgundy opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
        <ZoomIcon className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  );
}

export default function GallerySection({
  photos = SAMPLE_PHOTOS,
}: GallerySectionProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const hasPhotos = photos.length > 0;
  const total = photos.length;
  const slots = hasPhotos ? photos.slice(0, 7) : new Array(7).fill(null);

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((prev) => {
        if (prev === null) return prev;
        return (prev + delta + total) % total;
      });
    },
    [total],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, go]);

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:py-28">
      {/* dasar dekoratif — konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.25]" />
      </div>
      <div className="pointer-events-none absolute -right-16 top-8 z-0 h-56 w-56 rounded-full bg-blush/30 blur-[95px] lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-52 w-52 rounded-full bg-sage-light/30 blur-[90px] lg:h-72 lg:w-72" />

      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <motion.span
          variants={fadeUp}
          className="mx-auto block w-fit rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1 text-center text-xs font-bold tracking-[0.35em] text-burgundy"
        >
          GALERI KAMI
        </motion.span>
        <motion.p
          variants={fadeUp}
          className="font-script mt-3 text-center text-2xl text-ink lg:text-3xl"
        >
          Momen Kami Berdua
        </motion.p>
        <motion.div variants={fadeUp} className="mt-3 flex justify-center">
          <OrnateDivider className="h-4 w-40" />
        </motion.div>

        <div className="mt-9 grid auto-rows-[100px] grid-cols-3 gap-2.5 sm:auto-rows-[120px] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[140px]">
          {slots.map((photo, i) =>
            hasPhotos ? (
              <PhotoTile
                key={i}
                src={photo as string}
                span={placeholderSpans[i % placeholderSpans.length]}
                onClick={() => {
                  setDirection(0);
                  setIndex(i);
                }}
              />
            ) : (
              <PlaceholderTile
                key={i}
                span={placeholderSpans[i % placeholderSpans.length]}
              />
            ),
          )}
        </div>

        {hasPhotos && (
          <motion.p
            variants={fadeUp}
            className="mt-6 text-center text-[11px] tracking-[0.15em] text-ink/45"
          >
            KETUK FOTO UNTUK MEMPERBESAR
          </motion.p>
        )}
      </motion.div>

      {/* --------------------------------------------------------- */}
      {/*  Lightbox — full navigasi (prev/next/close/counter), animasi */}
      {/*  slide terarah antar-foto, hanya opacity+transform.          */}
      {/* --------------------------------------------------------- */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/15 text-ivory transition hover:bg-ivory/25 sm:right-6 sm:top-6"
              aria-label="Tutup"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/15 text-ivory transition hover:bg-ivory/25 sm:left-5"
                  aria-label="Sebelumnya"
                >
                  <ChevronIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/15 text-ivory transition hover:bg-ivory/25 sm:right-5"
                  aria-label="Berikutnya"
                >
                  <ChevronIcon className="h-5 w-5" flip />
                </button>
              </>
            )}

            <div
              className="relative flex max-h-[85vh] max-w-full items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.img
                  key={index}
                  custom={direction}
                  variants={lightboxVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={photos[index]}
                  alt={`Galeri ${index + 1}`}
                  className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {total > 1 && (
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ivory/15 px-3 py-1 text-xs font-medium tracking-wide text-ivory">
                {index + 1} / {total}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
