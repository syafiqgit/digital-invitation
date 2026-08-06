"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

interface GallerySectionProps {
  photos?: string[];
}

const SAMPLE_PHOTOS = [
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/e416b6b6-ce84-52a0-bcc0-01d3038ad6e5/eb564097-eeed-5348-b070-987d451fed27.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/32ca7a2e-dd01-5493-b439-063094614a71/d1d3938e-c060-561f-b224-1e83e6d54654.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/d5d9fbc4-805e-5e29-a42c-2877e164d835/caefe677-3671-51a3-9e93-cc30b03e6bec.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/274f63ea-91ed-5210-9f19-1b961a9139bd/0dc282b4-26ba-5ef9-bd96-e14f7e8512e4.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/ce40bed0-c9a9-5972-ac6d-e75e02a87b3c/3fba9e44-e644-569f-8c63-b371c7a50aae.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/b4fade35-f203-5bdd-a5b9-f8db39510728/58f1bf46-970a-5ded-a50c-0ec15974a70d.jpg",
  "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/d872ee9f-8336-5222-9b24-232c70141e25/9b623346-d832-5115-83bf-2536a8f63d59.jpg",
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;

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

const fireflies = [
  { left: "8%", top: "18%", duration: 7, delay: 0 },
  { left: "19%", top: "70%", duration: 8.5, delay: 1.5 },
  { left: "88%", top: "20%", duration: 7.5, delay: 3 },
  { left: "92%", top: "68%", duration: 9, delay: 2 },
  { left: "50%", top: "10%", duration: 8, delay: 4.5 },
] as const;

const butterflies = [
  { left: "6%", top: "36%", color: "var(--coral)", duration: 18, delay: 0 },
  { left: "90%", top: "46%", color: "var(--burgundy)", duration: 20, delay: 5 },
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

const placeholderSpans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
] as const;

const CameraIcon = memo(function CameraIcon({
  className = "",
}: {
  className?: string;
}) {
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
});

const ZoomIcon = memo(function ZoomIcon({
  className = "",
}: {
  className?: string;
}) {
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
});

const ChevronIcon = memo(function ChevronIcon({
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
});

const CloseIcon = memo(function CloseIcon({
  className = "",
}: {
  className?: string;
}) {
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
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
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
        {ANGLES_5.map((deg) => (
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

const PlaceholderTile = memo(function PlaceholderTile({
  span,
}: {
  span: string;
}) {
  return (
    <motion.div
      variants={itemPop}
      className={`${span} flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-sage/50 bg-gradient-to-br from-blush/40 to-sage-light/30 p-4`}
    >
      <CameraIcon className="h-7 w-7 opacity-70" />
      <span className="text-center text-[10px] font-semibold tracking-wide text-ink/70">
        Foto segera hadir
      </span>
    </motion.div>
  );
});

const PhotoTile = memo(function PhotoTile({
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
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ivory/90 text-burgundy opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
        <ZoomIcon className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  );
});

export default function GallerySection({
  photos = [...SAMPLE_PHOTOS],
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
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
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
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
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

      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-sage/25 sm:inset-6 lg:inset-10" />
      <div className="pointer-events-none absolute inset-7 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block lg:inset-12" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <motion.span
          variants={fadeUp}
          className="mx-auto block w-fit rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-center text-xs font-bold tracking-[0.35em] text-burgundy"
        >
          GALERI KAMI
        </motion.span>
        <motion.p
          variants={fadeUp}
          className="font-script mt-3 text-center text-2xl font-semibold text-ink lg:text-3xl"
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
            className="mt-6 text-center text-[11px] font-semibold tracking-[0.15em] text-ink/60"
          >
            KETUK FOTO UNTUK MEMPERBESAR
          </motion.p>
        )}
      </motion.div>

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
                  referrerPolicy="no-referrer"
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
