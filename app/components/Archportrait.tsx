"use client";

import { memo } from "react";
import Image from "next/image";
import { Monogram, MiniLeaf } from "./DecorPieces";

const textLift = {
  strong: {
    textShadow:
      "0 1px 4px rgba(255,255,255,0.9), 0 2px 14px rgba(255,255,255,0.85)",
  },
  soft: {
    textShadow:
      "0 1px 8px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.9)",
  },
} as const;

interface ArchPortraitProps {
  displayName: string;
  fullName: string;
  parents: string;
  photoUrl?: string;
  align?: "left" | "right";
  /** Delay (seconds) before the floating idle animation starts. Should be
   *  set to roughly when this portrait's entrance slide-in finishes, so
   *  the two animations don't compete for the same frames — see the note
   *  below. */
  floatDelay?: number;
  /** Whether this photo should preload/decode eagerly. Only ONE portrait
   *  in a pair should be `true` — marking both eager makes their preload
   *  and decode work compete for the same bandwidth and main-thread
   *  budget right as the section scrolls into view, which is exactly
   *  when the slide-in animation is also trying to run smoothly. */
  priority?: boolean;
}

/**
 * Fixes vs the original:
 *
 * 1. `<img>` → `next/image` with explicit `fill` + a fixed aspect-ratio
 *    container (no more layout shift once the photo decodes — the box is
 *    already the right size before the pixels arrive), plus a `sizes`
 *    hint so the browser doesn't download a full-res image for a portrait
 *    that's often under 200px wide on mobile.
 *
 * 2. The floating idle animation (`y: [-3, 3, -3]`, infinite) now starts
 *    via a CSS `animation-delay` timed to land AFTER this portrait's
 *    entrance slide-in transition finishes, instead of starting on the
 *    same frame as the entrance animation and the image decode. That
 *    overlap — three animated/layout-affecting things landing on the same
 *    frame right as the section scrolls into view — was the actual cause
 *    of the stutter, not the floating animation itself.
 */
export const ArchPortrait = memo(function ArchPortrait({
  displayName,
  fullName,
  parents,
  photoUrl,
  align = "left",
  floatDelay = 0.9,
  priority = false,
}: ArchPortraitProps) {
  return (
    <div
      className="relative flex w-full flex-col items-center text-center"
      style={{
        // Forces this entire subtree (borders, photo, garland, leaf) onto
        // its own GPU layer BEFORE the parent's slide-in transform starts,
        // not mid-animation. Without this, the browser often defers layer
        // promotion until the transform is already running — the first
        // few frames get composited on the main thread instead of the
        // GPU, which is what reads as "patah" right at the start of the
        // slide. translateZ(0) is a deliberate, well-known trick to force
        // that promotion early; backfaceVisibility avoids a Safari flicker
        // side-effect of the same trick.
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className="couple-anim-float relative w-full"
        style={
          {
            animation: `couple-portrait-float 6s ease-in-out ${floatDelay}s infinite`,
            willChange: "transform",
          } as React.CSSProperties
        }
      >
        <style>{`
          @keyframes couple-portrait-float {
            0%, 100% { transform: translateY(-3px); }
            50% { transform: translateY(3px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .couple-anim-float { animation-duration: 0.01ms !important; }
          }
        `}</style>

        <div className="absolute -inset-[7px] rounded-t-[3.6rem] rounded-b-xl border-[1.5px] border-mustard shadow-[0_0_15px_rgba(212,175,55,0.3)] sm:-inset-2.5 sm:rounded-t-[4.3rem] lg:-inset-3 lg:rounded-t-[6.6rem] lg:rounded-b-3xl" />
        <div className="absolute -inset-[3px] rounded-t-[3.4rem] rounded-b-lg border border-mustard/70 sm:-inset-1 sm:rounded-t-[4rem] lg:-inset-1.5 lg:rounded-t-[6.3rem] lg:rounded-b-2xl" />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-[3.5rem] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(58,54,48,0.4)] ring-1 ring-white/70 sm:rounded-t-[4.2rem] lg:rounded-t-[6.5rem] lg:rounded-b-3xl">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={displayName}
              fill
              priority={priority}
              loading={priority ? undefined : "eager"}
              sizes="(min-width: 1024px) 16rem, (min-width: 640px) 10rem, 38vw"
              className="object-cover"
            />
          ) : (
            <Monogram name={displayName} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-1 rounded-t-[3rem] rounded-b-lg border border-white/50 sm:rounded-t-[3.7rem] lg:inset-2 lg:rounded-t-[5.7rem] lg:rounded-b-2xl" />
        </div>

        <div className="pointer-events-none absolute -bottom-[18%] left-1/2 z-20 w-[130%] -translate-x-1/2 sm:-bottom-[22%] lg:-bottom-[24%]">
          <Image
            src="/assets/garland.png"
            alt=""
            width={900}
            height={529}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <div
          className={`pointer-events-none absolute -top-2 z-30 h-5 w-5 opacity-90 sm:-top-3 sm:h-6 sm:w-6 lg:-top-4 lg:h-8 lg:w-8 ${
            align === "left" ? "-left-1 sm:-left-2" : "-right-1 sm:-right-2"
          }`}
        >
          <MiniLeaf
            rot={align === "left" ? -30 : 30}
            className="h-full w-full drop-shadow-sm"
          />
        </div>
      </div>

      <p
        className="font-script mt-12 text-2xl font-semibold leading-none text-balance break-words text-ink sm:mt-16 sm:text-4xl lg:mt-20 lg:text-5xl"
        style={textLift.strong}
      >
        {displayName}
      </p>
      <span className="mt-1.5 block h-px w-8 bg-sage/60 lg:mt-2 lg:w-10" />
      <p
        className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-balance text-ink lg:mt-2 lg:text-[13px]"
        style={textLift.soft}
      >
        {fullName}
      </p>
      <p
        className="mt-1 block max-w-[13rem] text-[11px] font-medium leading-relaxed text-balance text-ink/90 lg:mt-2.5 lg:text-[12px]"
        style={textLift.soft}
      >
        {align === "left" ? "Daughter of" : "Son of"}
        <br />
        {parents}
      </p>
    </div>
  );
});
