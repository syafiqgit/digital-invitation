import { Suspense } from "react";
import HomeClient from "./components/HomeClient";

function CoverSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory">
      <p className="text-ink/70 tracking-widest text-sm">MEMUAT UNDANGAN...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<CoverSkeleton />}>
      <HomeClient />
    </Suspense>
  );
}
