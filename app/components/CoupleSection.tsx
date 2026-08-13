"use client";

import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
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
  openingAnimation?: boolean;
}

const DEFAULT_BRIDE_PHOTO = "https://picsum.photos/id/1027/600/800";
const DEFAULT_GROOM_PHOTO = "https://picsum.photos/id/1005/600/800";

// Timing function yang smooth
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- ANIMASI ENTRANCE AMAN (Hanya jalan 1x) ---------- */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 }, // Jarak diperkecil agar lebih ringan
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.85, ease: EASE } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 }, // Skala diperkecil agar tidak over render
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE, delay: 0.35 },
  },
};

function CoupleSectionInner({
  groomName = "Alexander",
  groomFullName = "Alexander",
  groomParents = "Mr. ... & Mrs. ...",
  brideName = "Amelia",
  brideFullName = "Amelia",
  brideParents = "Mr. ... & Mrs. ...",
  groomPhotoUrl = DEFAULT_GROOM_PHOTO,
  bridePhotoUrl = DEFAULT_BRIDE_PHOTO,
  openingAnimation = true,
}: CoupleSectionProps) {
  const initialState = openingAnimation ? "hidden" : "visible";

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-16 xs:px-5 sm:px-6 sm:py-24 md:py-28">
      <AmbientKeyframes />

      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.28]" />
      </div>

      {/* Background Glow Statis (Sangat aman) */}
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem] opacity-70" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72 opacity-70" />

      <AmbientGlow />
      <FrameLayers />
      <AmbientDecor />
      <FairyLights />

      <div className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-6 w-full opacity-90 sm:block sm:h-8 lg:h-10">
        <GrassSilhouette className="h-full w-full" />
      </div>

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center xs:max-w-md sm:max-w-2xl md:max-w-3xl"
        initial={initialState}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <m.div variants={fadeUp}>
              <StaticWreathBand className="mb-1 h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72" />
            </m.div>

            <m.div
              variants={fadeUp}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Animasi spin murni rotasi (Aman) */}
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
              <style>{`
                @keyframes couple-badge-spin-l {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(15deg); }
                }
                @keyframes couple-badge-spin-r {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(-15deg); }
                }
              `}</style>
            </m.div>

            <m.p
              variants={fadeUp}
              className="font-script mt-3 max-w-[16rem] rounded-2xl bg-ivory/80 px-3 py-1.5 text-base font-semibold leading-snug text-ink backdrop-blur-[2px] xs:text-lg xs:max-w-[18rem] sm:mt-4 sm:max-w-md sm:text-2xl lg:mt-5 lg:text-3xl"
              style={{ textShadow: "0 1px 6px rgba(255,255,255,0.9)" }}
            >
              With joyful hearts, we warmly invite you
            </m.p>

            <m.div variants={fadeUp}>
              <SprigDivider className="mt-2 h-4 w-28 xs:w-32 sm:mt-3 sm:w-40 lg:mt-4 lg:h-5 lg:w-44" />
            </m.div>
          </div>

          <div
            className="relative mt-5 flex w-full flex-row items-end justify-center gap-2 sm:mt-8 sm:gap-4 md:mt-10 lg:gap-6"
            style={{ paddingInline: "clamp(0.75rem, 6vw, 3rem)" }}
          >
            <m.div
              variants={fadeIn}
              className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={brideName}
                fullName={brideFullName}
                parents={brideParents}
                photoUrl={bridePhotoUrl}
                align="left"
                floatDelay={0}
                priority
              />
            </m.div>

            <m.div
              variants={popIn}
              className="relative z-20 mb-6 w-14 shrink-0 sm:mb-10 sm:w-24 lg:mb-12 lg:w-40"
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-xl opacity-70" />

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
                  {/* Animasi twinkle murni scale & opacity (Aman) */}
                  <div
                    className="absolute -left-2 -top-2"
                    style={{
                      animation: "couple-twinkle-pop 2.5s ease-in-out infinite",
                    }}
                  >
                    <Sparkle className="h-2 w-2 opacity-80 sm:h-3 sm:w-3" />
                  </div>

                  <span
                    className="font-script block font-semibold leading-none text-burgundy text-sm sm:text-2xl lg:text-4xl"
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
              <style>{`
                @keyframes couple-amp-scale {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.08); }
                }
                @keyframes couple-twinkle-pop {
                  0%, 100% { opacity: 0.3; transform: scale(0.6) translateZ(0); }
                  50% { opacity: 1; transform: scale(1.2) translateZ(0); }
                }
                @keyframes couple-twinkle-pop-lg {
                  0%, 100% { opacity: 0.3; transform: scale(0.6) translateZ(0); }
                  50% { opacity: 1; transform: scale(1.4) translateZ(0); }
                }
              `}</style>
            </m.div>

            <m.div
              variants={fadeIn}
              className="flex w-[38%] max-w-[8.5rem] shrink-0 sm:w-auto sm:max-w-[10rem] lg:max-w-[16rem]"
            >
              <ArchPortrait
                displayName={groomName}
                fullName={groomFullName}
                parents={groomParents}
                photoUrl={groomPhotoUrl}
                align="right"
                floatDelay={0}
              />
            </m.div>
          </div>

          <m.div variants={fadeUp} className="mt-9 sm:mt-12 lg:mt-16">
            <StaticWreathBand
              flip
              className="h-4 w-36 opacity-70 xs:w-40 sm:h-5 sm:w-56 lg:h-6 lg:w-72"
            />
          </m.div>
        </div>
      </m.div>
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
