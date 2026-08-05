// components/CoverPage.tsx
"use client";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useDeviceCapability } from "../hooks/useDeviceCapability";
import FloralBouquetBand from "./FloralBouquetBand";
import FloralClusterAccent from "./FloralClusterAccent";
import FloralCorner from "./FloralCorner";
import FloralSilhouettePattern from "./FloralSilhouettePattern";
import FloralVine from "./FloralVine";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

const stars = [
  { top: "8%", left: "10%" },
  { top: "15%", left: "75%" },
  { top: "24%", left: "20%" },
  { top: "32%", left: "82%" },
  { top: "40%", left: "8%" },
  { top: "48%", left: "78%" },
  { top: "56%", left: "15%" },
  { top: "64%", left: "85%" },
  { top: "72%", left: "10%" },
  { top: "80%", left: "75%" },
  { top: "88%", left: "20%" },
  { top: "94%", left: "80%" },
];

const petalsMobile = [
  { left: "8%", size: 10, duration: 8, delay: 0, color: "#d9a5a0" },
  { left: "30%", size: 8, duration: 9.5, delay: 1.5, color: "#c9dcc0" },
  { left: "55%", size: 9, duration: 8.5, delay: 0.8, color: "#e08a6b" },
  { left: "78%", size: 7, duration: 10, delay: 2.5, color: "#d9a441" },
  { left: "18%", size: 8, duration: 9, delay: 3.2, color: "#a13d3d" },
  { left: "65%", size: 10, duration: 8.8, delay: 4, color: "#c9dcc0" },
  { left: "90%", size: 7, duration: 9.2, delay: 1.2, color: "#d9a5a0" },
];

const mobileFlowerSpots = [
  { top: "20%", left: "8%", size: 14, delay: 0, flip: false },
  { top: "20%", right: "8%", size: 12, delay: 0.6, flip: true },
  { top: "38%", left: "4%", size: 11, delay: 1.2, flip: false },
  { top: "38%", right: "4%", size: 13, delay: 1.8, flip: true },
  { top: "58%", left: "6%", size: 12, delay: 0.4, flip: false },
  { top: "58%", right: "6%", size: 14, delay: 1, flip: true },
  { top: "76%", left: "5%", size: 11, delay: 1.6, flip: false },
  { top: "76%", right: "5%", size: 12, delay: 2.2, flip: true },
];

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.2 } },
};

const labelVariant: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const nameLeftVariant: Variants = {
  hidden: { opacity: 0, x: -90, rotate: -12 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const nameRightVariant: Variants = {
  hidden: { opacity: 0, x: 90, rotate: 12 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const ampersandVariant: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -45 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 12 },
  },
};

const dateBoxVariant: Variants = {
  hidden: { opacity: 0, rotateY: 90, scale: 0.8 },
  show: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const subtitleVariant: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const guestNameVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 14 },
  },
};

const buttonVariant: Variants = {
  hidden: { opacity: 0, y: -50, scale: 0.7 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 13 },
  },
};

export default function CoverPage({
  guestName = "Tamu Undangan",
  onOpen,
}: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const { isDesktop, isTouch, reduceMotion } = useDeviceCapability();
  const enableAnim = !reduceMotion;

  const sceneRef = useRef<HTMLDivElement>(null);
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const gSpringX = useSpring(gx, { stiffness: 60, damping: 20 });
  const gSpringY = useSpring(gy, { stiffness: 60, damping: 20 });

  const layerFarX = useTransform(gSpringX, [-0.5, 0.5], [-14, 14]);
  const layerFarY = useTransform(gSpringY, [-0.5, 0.5], [-10, 10]);
  const layerMidX = useTransform(gSpringX, [-0.5, 0.5], [-26, 26]);
  const layerMidY = useTransform(gSpringY, [-0.5, 0.5], [-18, 18]);
  const sceneRotateX = useTransform(gSpringY, [-0.5, 0.5], [3, -3]);
  const sceneRotateY = useTransform(gSpringX, [-0.5, 0.5], [-3, 3]);

  const handleSceneMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || isTouch) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    gx.set((e.clientX - rect.left) / rect.width - 0.5);
    gy.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleSceneLeave = () => {
    gx.set(0);
    gy.set(0);
  };

  const boxRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const boxRotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 18,
  });
  const boxRotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 18,
  });

  const handleBoxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || isTouch) return;
    e.stopPropagation();
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleBoxLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 1200);
  };

  const isMobile = !isDesktop;

  return (
    <AnimatePresence>
      <motion.div
        ref={sceneRef}
        onMouseMove={handleSceneMove}
        onMouseLeave={handleSceneLeave}
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        style={{ perspective: 1200 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
      >
        <FloralSilhouettePattern className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]" />

        <motion.div
          style={{ x: isDesktop ? layerFarX : 0, y: isDesktop ? layerFarY : 0 }}
          className="contents"
        >
          <FloralBouquetBand className="pointer-events-none absolute top-0 left-0 z-10 h-24 w-full sm:h-32 lg:h-40" />
          <FloralBouquetBand
            flip
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full sm:h-32 lg:h-40"
          />
        </motion.div>

        <motion.div
          style={{ x: isDesktop ? layerFarX : 0, y: isDesktop ? layerFarY : 0 }}
          animate={
            enableAnim ? { rotate: [-6, 6, -6], scale: [1, 1.05, 1] } : {}
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 top-0 z-10 h-16 w-16 origin-top-left opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerFarX : 0, y: isDesktop ? layerFarY : 0 }}
          animate={
            enableAnim ? { rotate: [6, -6, 6], scale: [1, 1.05, 1] } : {}
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="pointer-events-none absolute right-0 top-0 z-10 h-16 w-16 origin-top-right opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerFarX : 0, y: isDesktop ? layerFarY : 0 }}
          animate={
            enableAnim ? { rotate: [6, -6, 6], scale: [1, 1.05, 1] } : {}
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-16 w-16 origin-bottom-left opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full rotate-180" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerFarX : 0, y: isDesktop ? layerFarY : 0 }}
          animate={
            enableAnim ? { rotate: [-6, 6, -6], scale: [1, 1.05, 1] } : {}
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="pointer-events-none absolute bottom-0 right-0 z-10 h-16 w-16 origin-bottom-right opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full rotate-90" />
        </motion.div>

        {isDesktop && (
          <>
            <FloralVine
              animate={enableAnim}
              className="pointer-events-none absolute left-[6%] top-0 z-10 h-full w-10 opacity-60"
            />
            <FloralVine
              animate={enableAnim}
              className="pointer-events-none absolute right-[6%] top-0 z-10 h-full w-10 -scale-x-100 opacity-60"
            />
          </>
        )}

        <motion.div
          style={{ x: isDesktop ? layerMidX : 0, y: isDesktop ? layerMidY : 0 }}
          animate={enableAnim ? { y: [0, -12, 0], rotate: [-4, 4, -4] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[4%] top-[16%] z-10 h-12 w-12 opacity-90 sm:left-[18%] sm:top-[22%] sm:h-20 sm:w-20 lg:h-28 lg:w-28"
        >
          <FloralClusterAccent className="h-full w-full" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerMidX : 0, y: isDesktop ? layerMidY : 0 }}
          animate={enableAnim ? { y: [0, -12, 0], rotate: [4, -4, 4] } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="pointer-events-none absolute right-[4%] top-[16%] z-10 h-12 w-12 -scale-x-100 opacity-90 sm:right-[18%] sm:top-[22%] sm:h-20 sm:w-20 lg:h-28 lg:w-28"
        >
          <FloralClusterAccent className="h-full w-full" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerMidX : 0, y: isDesktop ? layerMidY : 0 }}
          animate={enableAnim ? { y: [0, -10, 0], rotate: [-5, 5, -5] } : {}}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
          className="pointer-events-none absolute left-[6%] bottom-[24%] z-10 h-10 w-10 opacity-80 sm:left-[22%] sm:bottom-[18%] sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        >
          <FloralClusterAccent className="h-full w-full" />
        </motion.div>
        <motion.div
          style={{ x: isDesktop ? layerMidX : 0, y: isDesktop ? layerMidY : 0 }}
          animate={enableAnim ? { y: [0, -10, 0], rotate: [5, -5, 5] } : {}}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.4,
          }}
          className="pointer-events-none absolute right-[6%] bottom-[24%] z-10 h-10 w-10 -scale-x-100 opacity-80 sm:right-[22%] sm:bottom-[18%] sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        >
          <FloralClusterAccent className="h-full w-full" />
        </motion.div>

        {isMobile &&
          mobileFlowerSpots.map((f, i) => (
            <motion.div
              key={i}
              animate={
                enableAnim
                  ? { y: [0, -8, 0], rotate: f.flip ? [4, -4, 4] : [-4, 4, -4] }
                  : {}
              }
              transition={{
                duration: 3.5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: f.delay,
              }}
              className="pointer-events-none absolute z-10 opacity-70"
              style={{
                top: f.top,
                left: f.left,
                right: f.right,
                width: f.size * 4,
                height: f.size * 4,
              }}
            >
              <FloralClusterAccent
                className={`h-full w-full ${f.flip ? "-scale-x-100" : ""}`}
              />
            </motion.div>
          ))}

        {enableAnim &&
          petalsMobile.map((p, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute top-[-5%] z-10"
              style={{ left: p.left, width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "105vh"],
                x: [0, 25, -15, 0],
                rotate: [0, 200, 380],
                opacity: [0, 0.85, 0.85, 0],
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
                  opacity="0.85"
                />
              </svg>
            </motion.div>
          ))}

        {stars.map((s, i) => (
          <motion.div
            key={i}
            style={{
              x: isDesktop ? layerMidX : 0,
              y: isDesktop ? layerMidY : 0,
            }}
            className="pointer-events-none absolute z-10 text-blush-dark"
            initial={s}
          >
            <motion.div
              animate={
                enableAnim
                  ? {
                      opacity: [0.25, 1, 0.25],
                      scale: [0.7, 1.3, 0.7],
                      rotate: [0, 90, 0],
                    }
                  : { opacity: 0.6 }
              }
              transition={{
                duration: 2.5 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          animate={
            enableAnim ? { scale: [1, 1.18, 1], opacity: [0.2, 0.4, 0.2] } : {}
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem]"
        />

        <motion.div
          animate={
            isMobile && enableAnim
              ? { rotateX: [3, -3, 3], rotateY: [-3, 3, -3] }
              : undefined
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-20"
        >
          <motion.div
            style={{
              rotateX: isDesktop ? sceneRotateX : 0,
              rotateY: isDesktop ? sceneRotateY : 0,
              transformStyle: "preserve-3d",
              transformPerspective: 1200,
            }}
            variants={textContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center px-8 text-center"
          >
            {/* Label - fade turun + scale */}
            <motion.p
              variants={labelVariant}
              className="font-serif text-[11px] font-semibold tracking-[0.35em] text-ink/80 sm:text-xs"
            >
              UNDANGAN PERNIKAHAN
            </motion.p>

            {/* Nama kiri - slide dari kiri + miring, lalu float terus-menerus */}
            <motion.div variants={nameLeftVariant} className="mt-3">
              <motion.p
                animate={enableAnim ? { y: [0, -6, 0] } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="font-script text-6xl leading-none text-ink sm:text-7xl lg:text-8xl"
              >
                Talitha
              </motion.p>
            </motion.div>

            {/* Ampersand - pop spring dari tengah */}
            <motion.p
              variants={ampersandVariant}
              className="font-script my-2 text-4xl text-blush-dark sm:text-5xl lg:text-6xl"
            >
              &amp;
            </motion.p>

            {/* Nama kanan - slide dari kanan + miring, lalu float terus-menerus */}
            <motion.div variants={nameRightVariant}>
              <motion.p
                animate={enableAnim ? { y: [0, -6, 0] } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="font-script text-6xl leading-none text-ink sm:text-7xl lg:text-8xl"
              >
                Regga
              </motion.p>
            </motion.div>

            {/* Date box - flip 3D masuk dari samping, lalu tilt interaktif/auto */}
            <motion.div variants={dateBoxVariant} className="mt-8">
              <motion.div
                ref={boxRef}
                onMouseMove={handleBoxMove}
                onMouseLeave={handleBoxLeave}
                animate={
                  isMobile && enableAnim
                    ? { rotateX: [6, -6, 6], rotateY: [-6, 6, -6] }
                    : undefined
                }
                transition={
                  isMobile
                    ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
                style={
                  isDesktop
                    ? {
                        rotateX: boxRotateX,
                        rotateY: boxRotateY,
                        transformStyle: "preserve-3d",
                        transformPerspective: 500,
                      }
                    : {
                        transformStyle: "preserve-3d",
                        transformPerspective: 500,
                      }
                }
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 rounded-lg border border-sage/50 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-sm"
              >
                <span className="font-serif text-sm font-medium tracking-wide text-ink">
                  Sabtu
                </span>
                <span className="h-6 w-px bg-sage/50" />
                <span className="font-script text-3xl text-blush-dark">12</span>
                <span className="h-6 w-px bg-sage/50" />
                <span className="font-serif text-sm font-medium tracking-wide text-ink">
                  Desember
                </span>
                <span className="h-6 w-px bg-sage/50" />
                <span className="font-serif text-sm font-medium tracking-wide text-ink">
                  2026
                </span>
              </motion.div>
            </motion.div>

            {/* Subtitle - blur in */}
            <motion.p
              variants={subtitleVariant}
              className="mt-8 font-serif text-xs font-medium tracking-[0.15em] text-ink/70"
            >
              Kepada Yth. Bapak/Ibu/Saudara/i
            </motion.p>

            {/* Nama tamu - spring pop */}
            <motion.p
              variants={guestNameVariant}
              className="mt-1 font-serif text-lg font-semibold text-ink"
            >
              {guestName}
            </motion.p>

            {/* Tombol - jatuh dari atas dengan bounce */}
            {!isOpening && (
              <motion.div variants={buttonVariant} className="mt-10">
                <motion.button
                  onClick={handleOpen}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    enableAnim
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(217,165,160,0.4)",
                            "0 0 0 16px rgba(217,165,160,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    boxShadow: { repeat: Infinity, duration: 1.8 },
                  }}
                  className="rounded-full bg-blush-dark px-10 py-3 font-serif text-[11px] font-semibold tracking-[0.25em] text-white shadow-md sm:px-12 sm:text-xs"
                >
                  BUKA UNDANGAN
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
