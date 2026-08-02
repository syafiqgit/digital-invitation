// hooks/useGuestName.ts
"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

function formatGuestName(raw: string) {
  return decodeURIComponent(raw)
    .replace(/[-+]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function useGuestName(paramKey: string = "to"): string {
  const searchParams = useSearchParams();

  const guestName = useMemo(() => {
    const raw = searchParams.get(paramKey);
    if (!raw) return "Tamu Undangan";
    return formatGuestName(raw);
  }, [searchParams, paramKey]);

  return guestName;
}
