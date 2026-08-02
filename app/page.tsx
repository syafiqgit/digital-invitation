import { Suspense } from "react";
import HomeClient from "./components/HomeClient";

function CoverSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5efe3]">
      <p className="font-serif text-[#8b6f3f] tracking-widest">
        MEMUAT UNDANGAN...
      </p>
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
