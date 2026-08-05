"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CoverPage from "./CoverPage";

function formatGuestName(raw: string) {
  return decodeURIComponent(raw)
    .replace(/[-+]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const rawGuest = searchParams.get("to");
  const guestName = rawGuest ? formatGuestName(rawGuest) : "Tamu Undangan";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-ivory">
      {!isOpen && (
        <CoverPage guestName={guestName} onOpen={() => setIsOpen(true)} />
      )}

      {isOpen && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-ink">
            Konten undangan setelah dibuka akan ditempatkan di sini.
          </p>
        </div>
      )}
    </main>
  );
}
