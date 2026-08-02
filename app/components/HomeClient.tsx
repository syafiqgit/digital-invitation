// components/HomeClient.tsx
"use client";
import { useState } from "react";
import CoupleSection from "./CoupleSection";
import CoverPage from "./CoverPage";
import FloatingPetals from "./FloatingPetals";
import Hero3D from "./Hero3D";
import RevealSection from "./RevealSection";
import { useGuestName } from "../hooks/useGuestName";

export default function HomeClient() {
  const guestName = useGuestName();
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative bg-ivory">
      {!opened && (
        <CoverPage guestName={guestName} onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <>
          {/* Petal melayang - warna disesuaikan tema botanical (blush/sage), pengganti sparkle gold */}
          <FloatingPetals count={16} />

          <div className="relative z-20">
            <Hero3D />

            <RevealSection>
              <CoupleSection />
            </RevealSection>

            <RevealSection delay={0.15}>
              <section className="bg-ivory py-20 text-center">
                <p className="font-serif text-[11px] font-semibold tracking-[0.35em] text-ink/80">
                  SIMPAN TANGGALNYA
                </p>
                <h2 className="font-script mt-3 text-4xl text-ink sm:text-5xl">
                  Save The Date
                </h2>
                <span className="mx-auto mt-4 block h-px w-16 bg-sage/50" />
                <p className="mt-4 font-serif text-sm tracking-wide text-ink/70 sm:text-base">
                  12 Desember 2026 — Jakarta
                </p>
              </section>
            </RevealSection>
          </div>
        </>
      )}
    </main>
  );
}
