// components/CoupleSection.tsx
"use client";
import { motion } from "framer-motion";
import { useDeviceCapability } from "../hooks/useDeviceCapability";
import FloralVine from "./FloralVine";

interface PersonCardProps {
  name: string;
  parents: string;
  role: string;
  align?: "left" | "right";
}

function PersonCard({ name, parents, role, align = "left" }: PersonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-sage/40 bg-white/60 sm:h-32 sm:w-32">
        <span className="font-script text-3xl text-blush-dark sm:text-4xl">
          {name.charAt(0)}
        </span>
      </div>
      <p className="font-serif text-[10px] font-semibold tracking-[0.3em] text-sage sm:text-xs">
        {role}
      </p>
      <p className="font-script mt-2 text-4xl text-ink sm:text-5xl">{name}</p>
      <p className="mt-3 max-w-55 font-serif text-sm leading-relaxed text-ink/70">
        Putra/Putri dari {parents}
      </p>
    </motion.div>
  );
}

export default function CoupleSection() {
  const { isDesktop } = useDeviceCapability();

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 sm:py-28">
      {isDesktop && (
        <>
          <FloralVine className="pointer-events-none absolute left-[4%] top-0 h-full w-10 opacity-40" />
          <FloralVine className="pointer-events-none absolute right-[4%] top-0 h-full w-10 -scale-x-100 opacity-40" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <p className="font-serif text-[11px] font-semibold tracking-[0.35em] text-ink/80 sm:text-xs">
          KEDUA MEMPELAI
        </p>
        <span className="mx-auto mt-3 block h-px w-16 bg-sage/50" />
      </motion.div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-4xl flex-col items-center justify-center gap-14 sm:flex-row sm:gap-10">
        <PersonCard
          name="Amelia"
          parents="Bapak Sudirman & Ibu Ratna"
          role="MEMPELAI WANITA"
          align="left"
        />

        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-script text-4xl text-blush-dark sm:text-5xl"
        >
          &amp;
        </motion.p>

        <PersonCard
          name="Alexander"
          parents="Bapak Hermawan & Ibu Sari"
          role="MEMPELAI PRIA"
          align="right"
        />
      </div>
    </section>
  );
}
