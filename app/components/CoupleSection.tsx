"use client";

import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import Image from "next/image";
import { memo } from "react";
import BackgroundPattern from "./BackgroundPattern";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";
import { AmbientDecor } from "./Ambientdecor";
import { AmbientKeyframes } from "./AmbientKeyFrames";
import { Sparkle } from "./CoverDecorations";
import {
  GrassSilhouette,
  StaticWreathBand,
  MiniBloom,
  SprigDivider,
  Monogram,
  MiniLeaf,
} from "./DecorPieces";
import { AmbientGlow, FairyLights } from "./FairyLights";
import { FrameLayers } from "./FrameLayers";

interface CoupleSectionProps {
  groomName?: string;
  groomFullName?: string;
  groomParents?: string;
  brideName?: string;
  brideFullName?: string;
  brideParents?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
}

interface ArchPortraitProps {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
  floatDelay?: number;
  priority?: boolean;
}

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Transisi murni fade (tanpa pergerakan y) untuk elemen yang berat
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

const textLift = {
  strong: {
    textShadow:
      "0 1px 4px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.85)",
  },
  soft: {
    textShadow:
      "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
  },
} as const;

/* ---------- EFEK VISUAL ---------- */
const couplePetals = [
  { left: "6%", size: 14, duration: 10, delay: 0, drift: 16 },
  { left: "24%", size: 11, duration: 13, delay: 3, drift: -12 },
  { left: "78%", size: 15, duration: 11, delay: 1.5, drift: 14 },
  { left: "92%", size: 12, duration: 14, delay: 5, drift: -18 },
];

function CoupleAmbientExtras() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {couplePetals.map((p, i) => (
          <div
            key={`couple-petal-${i}`}
            className="pointer-events-none absolute top-0"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                animation: `couple-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
                ["--petal-drift" as string]: `${p.drift}px`,
              } as React.CSSProperties
            }
          >
            <Image
              src="/assets/flower-petal.png"
              alt=""
              fill
              sizes={`${p.size}px`}
              className="pointer-events-none select-none object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- KOMPONEN PORTRAIT ---------- */
export const ArchPortrait = memo(function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
  floatDelay = 0,
  priority = false,
}: ArchPortraitProps) {
  return (
    <div className="relative flex w-full flex-col items-center text-center">
      {/* ✅ FIX: Menghapus translateZ(0) dan backfaceVisibility. 
        Murni menggunakan layout standar agar tidak glitch saat di-scroll di iOS/Safari.
      */}
      <div
        className="relative w-full"
        style={
          {
            animation: `couple-portrait-float 5s ease-in-out ${floatDelay}s infinite`,
          } as React.CSSProperties
        }
      >
        <div className="absolute -inset-[7px] rounded-t-[3.6rem] rounded-b-xl border-[1.5px] border-mustard shadow-[0_0_15px_rgba(212,175,55,0.3)] sm:-inset-2.5 sm:rounded-t-[4.3rem] lg:-inset-3 lg:rounded-t-[6.6rem] lg:rounded-b-3xl" />
        <div className="absolute -inset-[3px] rounded-t-[3.4rem] rounded-b-lg border border-mustard/70 sm:-inset-1 sm:rounded-t-[4rem] lg:-inset-1.5 lg:rounded-t-[6.3rem] lg:rounded-b-2xl" />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(58,54,48,0.4)] ring-1 ring-white/70 sm:rounded-t-[4.2rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={displayName}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 16rem, (min-width: 640px) 10rem, 38vw"
              className="object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/50 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>

        <div className="pointer-events-none absolute -bottom-[18%] left-1/2 z-20 w-[130%] -translate-x-1/2 sm:-bottom-[22%] lg:-bottom-[24%]">
          <Image
            src="/assets/garland.png"
            alt=""
            width={900}
            height={529}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <div
          className={`pointer-events-none absolute -top-2 z-30 h-5 w-5 opacity-90 sm:-top-3 sm:h-6 sm:w-6 lg:-top-4 lg:h-8 lg:w-8 ${
            align === "left" ? "-left-1 sm:-left-2" : "-right-1 sm:-right-2"
          }`}
        >
          <MiniLeaf
            rot={align === "left" ? -30 : 30}
            className="h-full w-full drop-shadow-sm"
          />
        </div>
      </div>

      <p
        className="font-script mt-12 text-2xl font-semibold leading-none text-balance break-words text-ink sm:mt-16 sm:text-4xl lg:mt-20 lg:text-5xl"
        style={textLift.strong}
      >
        {displayName}
      </p>
      <span className="mt-1.5 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-balance text-ink lg:mt-2 lg:text-[13px]"
        style={textLift.soft}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[11px] font-medium leading-relaxed text-balance text-ink/90 lg:mt-2.5 lg:text-[12px]"
        style={textLift.soft}
      >
        {align === "left" ? "Daughter of" : "Son of"}
        <br />
        {parents}
      </p>
    </div>
  );
});

/* ---------- MAIN SECTION ---------- */
function CoupleSectionInner({
  groomName = "Alexander",
  groomFullName = "Alexander",
  groomParents = "Mr. ... & Mrs. ...",
  brideName = "Amelia",
  brideFullName = "Amelia",
  brideParents = "Mr. ... & Mrs. ...",
  groomPhotoUrl = DEFAULT_GROOM_PHOTO,
  bridePhotoUrl = DEFAULT_BRIDE_PHOTO,
}: CoupleSectionProps) {
  return (
    // ✅ FIX: Menggunakan Block Layout dengan Padding tetap (pt-28 pb-24).
    // Menghapus `min-h-dvh`, `flex-col`, `justify-center`.
    <section className="relative w-full overflow-hidden bg-ivory px-4 pt-28 pb-24 xs:px-5 sm:px-6 sm:pt-36 sm:pb-32 md:pt-40 md:pb-36">
      <AmbientKeyframes />

      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>

      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] opacity-70 lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] opacity-70 lg:h-72 lg:w-72" />

      <AmbientGlow />
      <FrameLayers />
      <AmbientDecor />
      <FairyLights />
      <CoupleAmbientExtras />

      <div className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-6 w-full opacity-90 sm:block sm:h-8 lg:h-10">
        <GrassSilhouette className="h-full w-full" />
      </div>

      {/* Pembungkus Konten Ditengah */}
      <m.div
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center xs:max-w-md sm:max-w-2xl md:max-w-3xl xl:max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* BLOK 1: Header */}
        <m.div
          variants={fadeOnly}
          className="flex flex-col items-center gap-1 text-center"
        >
          <StaticWreathBand
            animated
            className="mb-1 h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              style={{
                animation: "couple-badge-spin-l 3.4s ease-in-out infinite",
                transformOrigin: "center",
              }}
            >
              <MiniBloom
                className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
            </div>
            <span className="relative inline-block overflow-hidden rounded-full border border-mustard/60 bg-gradient-to-b from-ivory to-ivory/85 px-3.5 py-1 text-[9px] font-extrabold tracking-[0.3em] text-burgundy shadow-[0_2px_10px_rgba(58,54,48,0.08)] backdrop-blur-sm sm:px-5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.34em]">
              THE BRIDE &amp; GROOM
            </span>
            <div
              style={{
                animation: "couple-badge-spin-r 3.7s ease-in-out infinite",
                transformOrigin: "center",
              }}
            >
              <MiniBloom
                className="h-3 w-3 opacity-80 sm:h-4 sm:w-4"
                color="var(--sage-light)"
              />
            </div>
          </div>

          <p
            className="font-script mt-3 max-w-[16rem] rounded-2xl bg-ivory/80 px-3 py-1.5 text-base font-semibold leading-snug text-ink backdrop-blur-[2px] xs:max-w-[18rem] xs:text-lg sm:mt-4 sm:max-w-md sm:text-2xl lg:mt-5 lg:text-3xl"
            style={{ textShadow: "0 1px 6px rgba(255,255,255,0.9)" }}
          >
            With joyful hearts, we warmly invite you
          </p>

          <SprigDivider className="mt-2 h-4 w-28 xs:w-32 sm:mt-3 sm:w-40 lg:mt-4 lg:h-5 lg:w-44" />
        </m.div>

        {/* BLOK 2: Area Foto (Dipisah agar tidak menggeser sumbu Y saat animasi masuk) */}
        <m.div
          variants={fadeOnly}
          className="relative mt-5 flex w-full flex-row items-end justify-center gap-2 sm:mt-8 sm:gap-4 md:mt-10 md:gap-5 lg:gap-6"
          style={{ paddingInline: "clamp(0.75rem, 6vw, 3rem)" }}
        >
          <div className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] md:max-w-[13rem] lg:max-w-[16rem]">
            <ArchPortrait
              displayName={brideName}
              fullName={brideFullName}
              parents={brideParents}
              photoUrl={bridePhotoUrl}
              align="left"
              floatDelay={0}
              priority
            />
          </div>

          <div className="relative z-20 mb-6 w-14 shrink-0 sm:mb-10 sm:w-24 md:mb-11 md:w-32 lg:mb-12 lg:w-40">
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 opacity-70 blur-xl" />
            <WreathFrame className="relative z-10 w-full" />

            <div
              className="absolute z-10 flex items-center justify-center"
              style={{
                left: `${WREATH_HOLE.centerLeftPct}%`,
                top: `${WREATH_HOLE.centerTopPct}%`,
                width: `${WREATH_HOLE.widthPct - 20}%`,
                height: `${WREATH_HOLE.heightPct - 20}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="font-script block text-sm font-semibold leading-none text-burgundy sm:text-2xl lg:text-4xl"
                  style={{
                    textShadow: "0 2px 10px rgba(255,255,255,0.8)",
                    display: "inline-block",
                    animation: "couple-amp-scale 3s ease-in-out infinite",
                  }}
                >
                  &amp;
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] md:max-w-[13rem] lg:max-w-[16rem]">
            <ArchPortrait
              displayName={groomName}
              fullName={groomFullName}
              parents={groomParents}
              photoUrl={groomPhotoUrl}
              align="right"
              floatDelay={-2.5}
            />
          </div>
        </m.div>

        {/* BLOK 3: Pembatas Bawah */}
        <m.div variants={fadeOnly} className="mt-9 sm:mt-12 lg:mt-16">
          <StaticWreathBand
            flip
            animated
            className="h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
          />
        </m.div>
      </m.div>

      {/* STYLES */}
      <style>{`
        @keyframes couple-portrait-float {
          0%, 100% { transform: translateY(-3px); }
          50% { transform: translateY(3px); }
        }
        @keyframes couple-petal-fall {
          0% { opacity: 0; transform: translateY(-10%) rotate(0deg); }
          10% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { opacity: 0; transform: translate(var(--petal-drift), 115vh) rotate(320deg); }
        }
        @keyframes couple-badge-spin-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes couple-badge-spin-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes couple-amp-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .couple-anim-float { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

export default function CoupleSection(props: CoupleSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <CoupleSectionInner {...props} />
    </LazyMotion>
  );
}
