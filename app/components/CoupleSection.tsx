"use client";

import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import Image from "next/image";
import BackgroundPattern from "./BackgroundPattern";
import WreathFrame, { WREATH_HOLE } from "./WreathFrame";
import { AmbientDecor } from "./Ambientdecor";
import { AmbientKeyframes } from "./AmbientKeyFrames";
import { ArchPortrait } from "./Archportrait";
import { Sparkle } from "./CoverDecorations";
import {
  GrassSilhouette,
  StaticWreathBand,
  MiniBloom,
  SprigDivider,
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

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const blockFadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/* ---------- DATA: Falling Petals, Butterflies, Sparkles ---------- */
const couplePetals = [
  { left: "6%", size: 14, duration: 10, delay: 0, drift: 16 },
  { left: "24%", size: 11, duration: 13, delay: 3, drift: -12 },
  { left: "78%", size: 15, duration: 11, delay: 1.5, drift: 14 },
  { left: "92%", size: 12, duration: 14, delay: 5, drift: -18 },
];

const coupleButterflies = [
  {
    key: "cb-1",
    src: "/assets/butterfly-1.png",
    top: "16%",
    left: "10%",
    size: 22,
    duration: 10,
    delay: 0.5,
    xRange: [0, 12, -5, 0],
    yRange: [0, -8, -3, 0],
    rotateRange: [0, 5, -3, 0],
  },
  {
    key: "cb-2",
    src: "/assets/butterfly-2.png",
    top: "78%",
    left: "88%",
    size: 20,
    duration: 12,
    delay: 2,
    xRange: [0, -10, 6, 0],
    yRange: [0, -6, 5, 0],
    rotateRange: [0, -4, 4, 0],
  },
];

const coupleSparkles = [
  { top: "8%", left: "8%" },
  { top: "14%", left: "92%" },
  { top: "86%", left: "10%" },
  { top: "92%", left: "90%" },
];

/* Falling petals, butterflies, dan sparkles tambahan — ditampilkan di SEMUA
   ukuran layar (tidak ada `hidden` lagi), karena device seperti iPhone
   16 Pro Max (~430px) masih di bawah breakpoint `sm` (640px) dan akan
   ketutup hidden kalau dibatasi ke sm ke atas. */
function CoupleAmbientExtras() {
  return (
    <>
      {/* Falling petals — pure CSS keyframes, tidak pakai Framer Motion */}
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
                willChange: "transform, opacity",
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

      {/* Butterflies — Framer Motion, dibatasi 2 saja karena paling mahal */}
      {coupleButterflies.map((b) => (
        <m.div
          key={b.key}
          className="pointer-events-none absolute z-[1]"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.85, 0.85, 0],
            x: b.xRange,
            y: b.yRange,
            rotate: b.rotateRange,
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <m.div
            className="h-full w-full"
            style={{ transformOrigin: "center" }}
            animate={{ scaleY: [1, 0.55, 1] }}
            transition={{
              duration: 0.5,
              delay: b.delay * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={b.src}
              alt=""
              fill
              sizes={`${b.size}px`}
              className="pointer-events-none select-none object-contain"
              draggable={false}
            />
          </m.div>
        </m.div>
      ))}

      {/* Sparkles tambahan — pure CSS keyframes, keyframes `couple-twinkle`
          didefinisikan di AmbientKeyframes.tsx (dipakai juga AmbientDecor) */}
      {coupleSparkles.map((s, i) => (
        <div
          key={`couple-sparkle-${i}`}
          className="pointer-events-none absolute z-[1]"
          style={{
            top: s.top,
            left: s.left,
            animation: `couple-twinkle ${2.6 + (i % 3) * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          <Sparkle className="h-2.5 w-2.5 opacity-90 sm:h-3 sm:w-3" />
        </div>
      ))}

      <style>{`
        @keyframes couple-petal-fall {
          0% { opacity: 0; transform: translate(0, -10%) rotate(0deg); }
          10% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { opacity: 0; transform: translate(var(--petal-drift), 115vh) rotate(320deg); }
        }
      `}</style>
    </>
  );
}

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
    <section
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28"
      // ✅ FIX SCROLL JANK: section ini punya belasan animasi infinite (petal,
      // butterfly, sparkle, badge spin/shimmer, twinkle-pop, dll) + beberapa
      // blur besar yang terus di-composite meski section sudah keluar
      // viewport. content-visibility: auto membuat browser skip total
      // layout/paint/composite untuk section ini begitu tidak terlihat lagi,
      // sehingga scroll transisi ke EventSection tidak lagi tersendat.
      // containIntrinsicSize dipakai sebagai estimasi tinggi agar tidak ada
      // layout shift saat browser belum pernah render section ini.
      style={{
        containIntrinsicSize: "1px 900px",
      }}
    >
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

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center xs:max-w-md sm:max-w-2xl md:max-w-3xl xl:max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      >
        <div className="flex w-full flex-col items-center">
          {/* BLOK 1: Header & Teks Sambutan */}
          <m.div
            variants={blockFadeUp}
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
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 20%, rgba(212,175,55,0.35) 45%, rgba(255,255,255,0.6) 50%, rgba(212,175,55,0.35) 55%, transparent 80%)",
                    backgroundSize: "200% 100%",
                    animation:
                      "couple-badge-shimmer 3.5s ease-in-out 1s infinite",
                  }}
                />
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

          {/* BLOK 2: Area Foto & Simbol Tengah */}
          <m.div
            variants={blockFadeUp}
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
                  <div
                    className="absolute -left-2 -top-2"
                    style={{
                      animation: "couple-twinkle-pop 2.5s ease-in-out infinite",
                    }}
                  >
                    <Sparkle className="h-2 w-2 opacity-80 sm:h-3 sm:w-3" />
                  </div>
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
                  <div
                    className="absolute -bottom-1 -right-2"
                    style={{
                      animation:
                        "couple-twinkle-pop-lg 3s ease-in-out 1.2s infinite",
                    }}
                  >
                    <Sparkle className="h-1.5 w-1.5 opacity-80 sm:h-2 sm:w-2" />
                  </div>
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
                floatDelay={0}
              />
            </div>
          </m.div>

          {/* BLOK 3: Pembatas Wreath Bawah */}
          <m.div variants={blockFadeUp} className="mt-9 sm:mt-12 lg:mt-16">
            <StaticWreathBand
              flip
              animated
              className="h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
            />
          </m.div>
        </div>
      </m.div>

      <style>{`
        @keyframes couple-badge-spin-l {
          0%, 100% { transform: rotate(0deg) translateZ(0); }
          50% { transform: rotate(15deg) translateZ(0); }
        }
        @keyframes couple-badge-spin-r {
          0%, 100% { transform: rotate(0deg) translateZ(0); }
          50% { transform: rotate(-15deg) translateZ(0); }
        }
        @keyframes couple-amp-scale {
          0%, 100% { transform: scale(1) translateZ(0); }
          50% { transform: scale(1.08) translateZ(0); }
        }
        @keyframes couple-twinkle-pop {
          0%, 100% { opacity: 0.3; transform: scale(0.6) translateZ(0); }
          50% { opacity: 1; transform: scale(1.2) translateZ(0); }
        }
        @keyframes couple-twinkle-pop-lg {
          0%, 100% { opacity: 0.3; transform: scale(0.6) translateZ(0); }
          50% { opacity: 1; transform: scale(1.4) translateZ(0); }
        }
        @keyframes couple-badge-shimmer {
          0%, 100% { background-position: 150% 0; }
          50% { background-position: -50% 0; }
        }
        @keyframes couple-band-sway {
          0%, 100% { transform: rotate(-0.6deg) translateZ(0); }
          50% { transform: rotate(0.6deg) translateZ(0); }
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
