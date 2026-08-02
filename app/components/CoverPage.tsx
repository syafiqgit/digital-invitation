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
import FloralCorner from "./FloralCorner";
import FloralSilhouettePattern from "./FloralSilhouettePattern";
import FloralVine from "./FloralVine";

interface CoverPageProps {
  guestName?: string;
  onOpen: () => void;
}

const stars = [
  { top: "10%", left: "8%" },
  { top: "18%", left: "22%" },
  { top: "30%", left: "4%" },
  { top: "45%", left: "15%" },
  { top: "60%", left: "6%" },
  { top: "75%", left: "20%" },
  { top: "10%", right: "8%" },
  { top: "18%", right: "22%" },
  { top: "30%", right: "4%" },
  { top: "45%", right: "15%" },
  { top: "60%", right: "6%" },
  { top: "75%", right: "20%" },
];

const petals = [
  { left: "10%", size: 12, duration: 9, delay: 0, color: "#d9a5a0" },
  { left: "25%", size: 9, duration: 11, delay: 2, color: "#c9dcc0" },
  { left: "80%", size: 11, duration: 10, delay: 1, color: "#f0d9d4" },
  { left: "65%", size: 8, duration: 12, delay: 3.5, color: "#d9a5a0" },
  { left: "45%", size: 10, duration: 9.5, delay: 4.5, color: "#c9dcc0" },
];

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function CoverPage({
  guestName = "Tamu Undangan",
  onOpen,
}: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const { isDesktop, isTouch, reduceMotion } = useDeviceCapability();
  const enableAnim = !reduceMotion;

  const boxRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleBoxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || isTouch) return;
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

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ivory"
      >
        <FloralSilhouettePattern className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]" />

        <FloralBouquetBand className="pointer-events-none absolute top-0 left-0 z-10 h-24 w-full sm:h-32 lg:h-40" />
        <FloralBouquetBand
          flip
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full sm:h-32 lg:h-40"
        />

        <motion.div
          animate={enableAnim ? { rotate: [-2, 2, -2] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 top-0 z-10 h-20 w-20 origin-top-left opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full" />
        </motion.div>
        <motion.div
          animate={enableAnim ? { rotate: [2, -2, 2] } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="pointer-events-none absolute right-0 top-0 z-10 h-20 w-20 origin-top-right opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full -scale-x-100" />
        </motion.div>
        <motion.div
          animate={enableAnim ? { rotate: [2, -2, 2] } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-20 origin-bottom-left opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
        >
          <FloralCorner className="h-full w-full rotate-180" />
        </motion.div>
        <motion.div
          animate={enableAnim ? { rotate: [-2, 2, -2] } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="pointer-events-none absolute bottom-0 right-0 z-10 h-20 w-20 origin-bottom-right opacity-70 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
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

        <div className="pointer-events-none absolute inset-4 z-10 border border-sage/30 sm:inset-6" />

        {/* Kelopak melayang tipis di dalam cover */}
        {enableAnim &&
          petals.map((p, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute top-[-5%] z-10"
              style={{ left: p.left, width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "105vh"],
                x: [0, 20, -10, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.8, 0.8, 0],
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
            className="pointer-events-none absolute z-10 text-blush-dark"
            style={s}
            animate={
              enableAnim
                ? { opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.1, 0.9] }
                : { opacity: 0.6 }
            }
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
            </svg>
          </motion.div>
        ))}

        <motion.div
          animate={
            enableAnim
              ? { scale: [1, 1.08, 1], opacity: [0.25, 0.35, 0.25] }
              : {}
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/25 blur-3xl sm:h-96 sm:w-96 lg:h-112 lg:w-md"
        />

        {/* Konten tengah - staggered reveal */}
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="show"
          className="relative z-20 flex flex-col items-center px-8 text-center"
        >
          <motion.p
            variants={textItem}
            className="font-serif text-[11px] font-semibold tracking-[0.35em] text-ink/80 sm:text-xs"
          >
            UNDANGAN PERNIKAHAN
          </motion.p>

          <motion.p
            variants={textItem}
            className="font-script mt-3 text-6xl leading-none text-ink sm:text-7xl lg:text-8xl"
          >
            Amelia
          </motion.p>
          <motion.p
            variants={textItem}
            className="font-serif my-1 text-lg italic text-blush-dark sm:text-xl"
          >
            &amp;
          </motion.p>
          <motion.p
            variants={textItem}
            className="font-script text-6xl leading-none text-ink sm:text-7xl lg:text-8xl"
          >
            Alexander
          </motion.p>

          <motion.div
            variants={textItem}
            ref={boxRef}
            onMouseMove={handleBoxMove}
            onMouseLeave={handleBoxLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              transformPerspective: 600,
            }}
            className="mt-8 flex items-center gap-3 rounded-lg border border-sage/50 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-sm"
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

          <motion.div variants={textItem} className="mt-8">
            <p className="font-serif text-xs font-medium tracking-[0.15em] text-ink/70">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="font-serif mt-1 text-lg font-semibold text-ink">
              {guestName}
            </p>
          </motion.div>

          {!isOpening && (
            <motion.button
              variants={textItem}
              onClick={handleOpen}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={
                enableAnim
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(217,165,160,0.35)",
                        "0 0 0 12px rgba(217,165,160,0)",
                      ],
                    }
                  : {}
              }
              transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
              className="mt-10 rounded-full bg-blush-dark px-10 py-3 font-serif text-[11px] font-semibold tracking-[0.25em] text-white shadow-md transition-transform hover:scale-105 sm:px-12 sm:text-xs"
            >
              BUKA UNDANGAN
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
