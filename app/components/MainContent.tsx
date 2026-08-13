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
      <CoupleSection
        brideFullName="Amelia Grace Henderson"
        brideName="Amelia"
        brideParents="Mr. Robert Henderson & Mrs. Clara Henderson"
        groomFullName="Alexander James Sterling"
        groomName="Alexander"
        groomParents="Mr. David Sterling & Mrs. Sarah Sterling"
        groomPhotoUrl="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
        openingAnimation={true}
      />
      <EventSection
        akadAddress="The Grand Glasshouse, Jl. MH Thamrin No. 1, Central Jakarta"
        akadTime="08:00 AM - 10:00 AM"
        akadVenue="The Grand Glasshouse Ballroom"
        mapsUrl="https://maps.google.com"
        resepsiAddress="The Grand Glasshouse, Jl. MH Thamrin No. 1, Central Jakarta"
        resepsiTime="11:00 AM - 02:00 PM"
        resepsiVenue="The Grand Glasshouse Grand Hall"
        targetDate="2026-12-12T08:00:00"
      />
      <StorySection
        milestones={[
          {
            date: "January 15, 2024",
            title: "First Met",
            description:
              "We crossed paths for the very first time at a cozy café downtown, sparking a conversation that lasted for hours.",
            photoUrl:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
          },
          {
            date: "August 20, 2025",
            title: "The Engagement",
            description:
              "Surrounded by our closest family and friends under a golden sunset, we promised to spend the rest of our lives together.",
            photoUrl:
              "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
          },
          {
            date: "December 12, 2026",
            title: "Our Wedding Day",
            description:
              "The beginning of our forever journey as husband and wife, joining our hearts and hands for a lifetime.",
            photoUrl:
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
          },
        ]}
      />
      <GallerySection
        photos={[
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
        ]}
      />
      <RsvpWishSection />
      <DigitalEnvelopeSection />
      <ClosingSection
        brideName="Sarah"
        groomName="Michael"
        couplePhotoUrl="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
      />
    </main>
  );
}
