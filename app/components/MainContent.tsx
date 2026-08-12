"use client";

import ClosingSection from "./ClosingSection";
import CoupleSection from "./CoupleSection";
import DigitalEnvelopeSection from "./DigitalEnvelopeSection";
import EventSection from "./EventSection";
import GallerySection from "./GallerySection";
import RsvpWishSection from "./RsvpWishSection";
import StorySection from "./StorySection";

interface MainContentProps {
  guestName?: string;
}

export default function MainContent({
  guestName = "Tamu Undangan",
}: MainContentProps) {
  return (
    <main className="relative w-full overflow-hidden bg-ivory">
      <CoupleSection />
      <EventSection />
      <StorySection />
      <GallerySection />
      <RsvpWishSection />
      <DigitalEnvelopeSection />
      <ClosingSection />
    </main>
  );
}
