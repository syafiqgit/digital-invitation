"use client";

import CoupleSection from "./CoupleSection";

interface MainContentProps {
  guestName?: string;
}

export default function MainContent({
  guestName = "Tamu Undangan",
}: MainContentProps) {
  return (
    <main className="relative w-full overflow-hidden bg-ivory">
      <CoupleSection />
    </main>
  );
}
