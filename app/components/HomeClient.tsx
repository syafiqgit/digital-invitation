"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CoverPage from "./CoverPage";
import MainContent from "./MainContent";

export default function Home() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      {!isOpened && (
        <CoverPage guestName={guestName} onOpen={() => setIsOpened(true)} />
      )}
      {isOpened && <MainContent guestName={guestName} />}
    </>
  );
}
