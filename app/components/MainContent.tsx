"use client";

import CoupleSection from "./CoupleSection";
import QuoteSection from "./QuoteSection";
import CountdownSection from "./CountdownSection";
import EventSection from "./EventSection";
import GallerySection from "./GallerySection";
import GiftSection from "./GiftSection";
import GuestbookSection from "./GuestbookSection";
import ClosingSection from "./ClosingSection";

interface MainContentProps {
  guestName?: string;
}

export default function MainContent({
  guestName = "Tamu Undangan",
}: MainContentProps) {
  return (
    <main className="relative w-full overflow-hidden bg-ivory">
      <CoupleSection />
      <QuoteSection />
      <CountdownSection />
      <EventSection />
      <GallerySection />
      <GiftSection />
      <GuestbookSection guestName={guestName} />
      <ClosingSection guestName={guestName} />
    </main>
  );
}
