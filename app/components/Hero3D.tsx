// components/Hero3D.tsx
"use client";
import { motion } from "framer-motion";
import { useDeviceCapability } from "../hooks/useDeviceCapability";
import FloralCorner from "./FloralCorner";

export default function Hero3D() {
  const { reduceMotion, isDesktop } = useDeviceCapability();
  const enableAnim = !reduceMotion;

  return (
    <section className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-ivory px-6 text-center">
      <FloralCorner className="pointer-events-none absolute left-0 top-0 h-24 w-24 opacity-60 sm:h-32 sm:w-32 lg:h-44 lg:w-44" />
      <FloralCorner className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rotate-180 opacity-60 sm:h-32 sm:w-32 lg:h-44 lg:w-44" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/20 blur-3xl sm:h-96 sm:w-96" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <motion.div
          animate={enableAnim ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sage/50 bg-white/60 sm:h-20 sm:w-20"
        >
          <span className="font-script text-2xl text-blush-dark sm:text-3xl">
            A&amp;A
          </span>
        </motion.div>

        <p className="font-serif text-[11px] font-semibold tracking-[0.35em] text-ink/80 sm:text-xs">
          MOHON DOA RESTU
        </p>

        <p className="font-script mt-3 text-5xl leading-tight text-ink sm:text-6xl lg:text-7xl">
          Amelia &amp; Alexander
        </p>

        <span className="mx-auto mt-6 block h-px w-16 bg-sage/50" />

        <p className="mx-auto mt-6 max-w-md font-serif text-sm leading-relaxed text-ink/70 sm:text-base">
          Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
          dan memberikan doa restu pada hari bahagia kami.
        </p>
      </motion.div>

      {isDesktop && (
        <motion.div
          animate={enableAnim ? { y: [0, 10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 z-10 flex flex-col items-center text-sage/70"
        >
          <span className="font-serif text-[10px] tracking-[0.3em]">
            SCROLL
          </span>
          <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            className="mt-2"
          >
            <path
              d="M7 0 L7 18 M2 13 L7 18 L12 13"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </motion.div>
      )}
    </section>
  );
}
