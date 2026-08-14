"use client";

import { memo, useEffect, useRef, useState, type FormEvent } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface WishItem {
  id: string;
  name: string;
  message: string;
  attendance: "attending" | "not_attending";
  date: string;
}

interface RsvpPayload {
  name: string;
  attendance: "attending" | "not_attending";
  guestCount: string;
}

interface WishPayload {
  name: string;
  message: string;
  attendance: "attending" | "not_attending";
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: "1",
    name: "John & Family",
    message:
      "Wishing you a lifetime of love and happiness! May your marriage be filled with endless joy.",
    attendance: "attending",
    date: "Just now",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    message:
      "Congratulations! Wishing both of you a smooth preparation and a wonderful wedding day.",
    attendance: "attending",
    date: "5 mins ago",
  },
];

const WISHES_STORAGE_KEY = "wedding_wishes_v1";

/* =========================================================================
   DATA LAYER — SIMULATED / MOCK.

   ⚠️ ARCHITECTURAL WARNING (not addressed, out of scope for this
   responsive change): submitRsvp & submitWish write to localStorage,
   which is per-browser/per-device. For an invitation shared with many
   different guests, this means:
   - The host never actually receives guest RSVP data.
   - The "Wishes List" shown to each guest only contains dummy data plus
     that guest's own wish — not other guests' wishes from the same link.
   Before production, replace submitRsvp/submitWish with calls to an
   API route + database (or at minimum Google Sheets/Airtable) so data
   is actually collected in one place and visible to all guests.
   ========================================================================= */

function readStoredWishes(): WishItem[] {
  if (typeof window === "undefined") return INITIAL_WISHES;
  try {
    const raw = window.localStorage.getItem(WISHES_STORAGE_KEY);
    if (!raw) return INITIAL_WISHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_WISHES;
  } catch {
    return INITIAL_WISHES;
  }
}

function writeStoredWishes(wishes: WishItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
  } catch {
    // Ignore storage quota issues
  }
}

async function submitRsvp(payload: RsvpPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (typeof window !== "undefined") {
    const existing = JSON.parse(
      window.localStorage.getItem("wedding_rsvp_v1") || "[]",
    );
    existing.push({ ...payload, submittedAt: new Date().toISOString() });
    window.localStorage.setItem("wedding_rsvp_v1", JSON.stringify(existing));
  }
}

async function submitWish(payload: WishPayload): Promise<WishItem> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newWish: WishItem = {
    id: `${Date.now()}`,
    name: payload.name,
    message: payload.message,
    attendance: payload.attendance,
    date: "Just now",
  };
  const current = readStoredWishes();
  const updated = [newWish, ...current];
  writeStoredWishes(updated);
  return newWish;
}

/* ========================================================================= */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Framer Motion variants (entrance only) ---------- */
// NOTE: permanent manual willChange removed — entrance animation only
// runs once (viewport once: true), Framer Motion already handles
// will-change automatically while the animation is active.
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const wishItemFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* ---------- Static decoration data (Optimized) ---------- */
const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "left-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "",
    isAnimated: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "right-0 top-0 h-full w-6 sm:w-10 md:w-12 lg:w-14",
    flip: "-scale-x-100",
    isAnimated: false,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "left-0 top-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "",
    origin: "left center",
    endDeg: "0.7deg",
    duration: "8.6s",
    delay: "0.2s",
    isAnimated: true,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "bottom-0 left-0 h-6 w-full sm:h-10 md:h-12 lg:h-14",
    flip: "-scale-y-100",
    origin: "left center",
    endDeg: "-0.7deg",
    duration: "9.2s",
    delay: "0.3s",
    isAnimated: true,
  },
];

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    origin: "top left",
    endDeg: "1.8deg",
    duration: "6.6s",
    delay: "0s",
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    origin: "top right",
    endDeg: "-1.8deg",
    duration: "7.1s",
    delay: "0.1s",
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    origin: "bottom left",
    endDeg: "1.8deg",
    duration: "6.9s",
    delay: "0.2s",
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    origin: "bottom right",
    endDeg: "-1.8deg",
    duration: "7.4s",
    delay: "0.3s",
  },
];

/* ---------- Small presentational pieces ---------- */
const MiniBloom = memo(function MiniBloom({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  const ANGLES = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.8"
            ry="7.2"
            fill={color}
            opacity="0.94"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.3" fill="var(--mustard)" />
      </g>
    </svg>
  );
});

const SprigDivider = memo(function SprigDivider({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 220 28" className={className} fill="none">
      <line
        x1="0"
        y1="14"
        x2="86"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="134"
        y1="14"
        x2="220"
        y2="14"
        stroke="var(--sage)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <path
        d="M110 8 L114 14 L110 20 L106 14 Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
});

const SpinnerIcon = memo(function SpinnerIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

const AmbientGlow = memo(function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-2xl md:h-[520px] md:w-[520px] lg:h-[620px] lg:w-[620px]"
    />
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v) => (
        <div
          key={v.key}
          className={`pointer-events-none absolute z-[2] opacity-70 ${v.className} ${v.flip}`}
        >
          <div
            className={`h-full w-full ${v.isAnimated ? "animate-sway" : ""}`}
            style={
              v.isAnimated
                ? ({
                    transformOrigin: v.origin,
                    "--end-deg": v.endDeg,
                    animationDuration: v.duration,
                    animationDelay: v.delay,
                    willChange: "transform",
                  } as React.CSSProperties)
                : undefined
            }
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </div>
        </div>
      ))}

      {corners.map((c) => (
        <div
          key={c.key}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 ${c.position}`}
        >
          <div
            className="h-full w-full animate-sway"
            style={
              {
                transformOrigin: c.origin,
                "--end-deg": c.endDeg,
                animationDuration: c.duration,
                animationDelay: c.delay,
                willChange: "transform",
              } as React.CSSProperties
            }
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/20 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- RSVP form ---------- */
function RsvpCard() {
  const [rsvpName, setRsvpName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "not_attending">(
    "attending",
  );
  const [guestCount, setGuestCount] = useState("1");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }
    setErrorMsg("");
    setStatus("submitting");
    try {
      await submitRsvp({
        name: rsvpName.trim(),
        attendance,
        guestCount: attendance === "attending" ? guestCount : "0",
      });
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg("Failed to send confirmation. Please try again.");
    }
  };

  return (
    <m.div
      variants={fadeUp}
      className="group relative h-fit w-full rounded-[2rem] border border-mustard/30 bg-white/85 p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] sm:p-8 md:p-9"
    >
      <h3 className="font-serif relative z-10 mb-1 text-center text-xl font-bold text-ink transition-colors group-hover:text-burgundy sm:text-2xl">
        RSVP Confirmation
      </h3>
      <p className="relative z-10 mb-8 text-center text-sm text-ink/70">
        It would be an honor to have you join us.
      </p>

      <div className="relative z-10">
        {status === "done" ? (
          <div className="rounded-2xl border border-mustard/30 bg-white/60 p-6 text-center shadow-inner">
            <p className="font-serif text-xl font-bold text-burgundy">
              Thank You, {rsvpName}!
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Your RSVP (
              <span className="font-bold">
                {attendance === "attending" ? "Attending" : "Not Attending"}
              </span>
              ) has been received.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full border border-burgundy/30 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-burgundy transition-all hover:bg-burgundy hover:text-white"
            >
              Edit RSVP
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="rsvp-name"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/70"
              >
                Guest Full Name
              </label>
              <input
                id="rsvp-name"
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Type your name here..."
                aria-invalid={Boolean(errorMsg)}
                className="w-full rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-base text-ink shadow-sm outline-none transition-all placeholder:text-ink/40 focus:bg-white focus:ring-2 focus:ring-mustard/50"
              />
              {errorMsg && (
                <p
                  role="alert"
                  className="mt-2 text-xs font-medium text-burgundy"
                >
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="rsvp-attendance"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/70"
                >
                  Attendance
                </label>
                <select
                  id="rsvp-attendance"
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(
                      e.target.value as "attending" | "not_attending",
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-base text-ink shadow-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-mustard/50"
                >
                  <option value="attending">Yes, I will attend</option>
                  <option value="not_attending">
                    Sorry, can&apos;t make it
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rsvp-guest-count"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/70"
                >
                  Number of Guests
                </label>
                <select
                  id="rsvp-guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  disabled={attendance === "not_attending"}
                  className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-base text-ink shadow-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-mustard/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                </select>
              </div>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="text-center text-xs font-medium text-burgundy"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#6B2A36] py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {status === "submitting" && <SpinnerIcon className="h-4 w-4" />}
              {status === "submitting" ? "SENDING..." : "SEND RSVP"}
            </button>
          </form>
        )}
      </div>
    </m.div>
  );
}

/* ---------- Guestbook ---------- */
function WishCard() {
  const [wishes, setWishes] = useState<WishItem[]>(INITIAL_WISHES);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishAttendance, setWishAttendance] = useState<
    "attending" | "not_attending"
  >("attending");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successBanner, setSuccessBanner] = useState(false);
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWishes(readStoredWishes());
    return () => {
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) {
      setErrorMsg("Name and message are required.");
      return;
    }
    setErrorMsg("");
    setStatus("submitting");
    try {
      const newWish = await submitWish({
        name: wishName.trim(),
        message: wishMessage.trim(),
        attendance: wishAttendance,
      });
      setWishes((prev) => [newWish, ...prev]);
      setWishName("");
      setWishMessage("");
      setStatus("idle");
      setSuccessBanner(true);
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
      bannerTimeoutRef.current = setTimeout(
        () => setSuccessBanner(false),
        4000,
      );
    } catch {
      setStatus("error");
      setErrorMsg("Failed to send your message. Please try again.");
    }
  };

  return (
    <m.div
      variants={fadeUp}
      className="group relative flex h-full min-h-[420px] flex-col rounded-[2rem] border border-mustard/30 bg-white/85 p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-500 hover:shadow-[0_15px_40px_rgba(212,175,55,0.1)] sm:min-h-[480px] sm:p-8 md:p-9"
    >
      <h3 className="font-serif relative z-10 mb-1 text-center text-xl font-bold text-ink transition-colors group-hover:text-burgundy sm:text-2xl">
        Guestbook &amp; Wishes
      </h3>
      <p className="relative z-10 mb-8 text-center text-sm text-ink/70">
        Leave your prayers and best wishes for us.
      </p>

      <div className="relative z-10 flex h-full flex-col">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mb-8 flex flex-col gap-4"
        >
          {successBanner && (
            <div
              role="status"
              className="rounded-xl border border-mustard/40 bg-green-50 p-3 text-center text-xs font-medium text-green-700"
            >
              Your message was sent successfully!
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wish-name" className="sr-only">
                Your Name
              </label>
              <input
                id="wish-name"
                type="text"
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                placeholder="Your name"
                aria-invalid={Boolean(errorMsg)}
                className="w-full rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3.5 text-base text-ink shadow-sm outline-none transition-all placeholder:text-ink/40 focus:ring-2 focus:ring-mustard/50"
              />
            </div>
            <div>
              <label htmlFor="wish-attendance" className="sr-only">
                Attendance Status
              </label>
              <select
                id="wish-attendance"
                value={wishAttendance}
                onChange={(e) =>
                  setWishAttendance(
                    e.target.value as "attending" | "not_attending",
                  )
                }
                className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3.5 text-base text-ink shadow-sm outline-none transition-all focus:ring-2 focus:ring-mustard/50"
              >
                <option value="attending">Attending</option>
                <option value="not_attending">Not Attending</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="wish-message" className="sr-only">
              Prayers &amp; Wishes
            </label>
            <textarea
              id="wish-message"
              rows={3}
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
              placeholder="Write your prayers & wishes..."
              aria-invalid={Boolean(errorMsg)}
              className="w-full resize-none rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3.5 text-base text-ink shadow-sm outline-none transition-all placeholder:text-ink/40 focus:ring-2 focus:ring-mustard/50"
            />
          </div>

          {errorMsg && (
            <p
              role="alert"
              className="text-center text-xs font-medium text-burgundy"
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 hover:-translate-y-0.5"
          >
            {status === "submitting" && <SpinnerIcon className="h-4 w-4" />}
            {status === "submitting" ? "SENDING..." : "SEND WISH"}
          </button>
        </form>

        {/* FIX: max-h added so the wishes list doesn't grow unbounded on
            short screens (e.g. when the mobile keyboard is open) —
            overflow scrolls within its own area instead of pushing the
            whole card out of the viewport. */}
        <div className="flex min-h-[250px] flex-1 flex-col border-t border-mustard/20 pt-6">
          <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-widest text-ink/50">
            Wishes ({wishes.length})
          </p>

          <div className="custom-scroll flex max-h-[320px] flex-1 flex-col gap-4 overflow-y-auto pr-2 sm:max-h-[360px] md:max-h-[400px]">
            {wishes.map((item) => (
              <m.div
                key={item.id}
                variants={wishItemFade}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-mustard/20 bg-white/80 p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="font-serif text-base font-bold leading-tight text-ink">
                    {item.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                      item.attendance === "attending"
                        ? "bg-sage-light/50 text-burgundy"
                        : "bg-gray-100 text-ink/60"
                    }`}
                  >
                    {item.attendance === "attending"
                      ? "Attending"
                      : "Not Attending"}
                  </span>
                </div>
                <p className="mb-3 text-sm italic leading-relaxed text-ink/80">
                  &ldquo;{item.message}&rdquo;
                </p>
                <p className="flex justify-end text-[10px] text-ink/40">
                  {item.date}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </m.div>
  );
}

/* ---------- Main component ---------- */
function RsvpWishSectionInner() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.4); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }

        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translate3d(0,0,0); }
          50% { transform: rotate(var(--end-deg, 2deg)) translate3d(0,0,0); }
        }
        .animate-sway { animation: sway ease-in-out infinite; }
        
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1) rotate(0deg) translate3d(0,0,0); }
          50% { transform: scale(1.1) rotate(var(--rot, 5deg)) translate3d(0,0,0); }
        }
        .animate-gentle-pulse { animation: gentle-pulse ease-in-out infinite; }
      `}</style>

      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <BackgroundPattern className="h-full w-full" />
      </div>

      <AmbientGlow />
      <FrameLayers />

      <m.div
        className="relative z-10 flex w-full max-w-sm flex-col items-center px-2 text-center xs:max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <m.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "6deg",
                animationDuration: "3.4s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>

          <span className="inline-block rounded-full border border-mustard/40 bg-white/80 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-burgundy shadow-sm backdrop-blur-sm sm:text-xs">
            RSVP &amp; WISHES
          </span>

          <div
            className="animate-gentle-pulse"
            style={
              {
                "--rot": "-6deg",
                animationDuration: "3.7s",
              } as React.CSSProperties
            }
          >
            <MiniBloom
              className="h-4 w-4 opacity-70"
              color="var(--sage-light)"
            />
          </div>
        </m.div>

        <m.h2
          variants={fadeUp}
          className="font-script mt-5 text-4xl font-semibold text-ink sm:text-5xl md:text-6xl"
        >
          RSVP &amp; Wishes
        </m.h2>

        <m.div variants={fadeUp} className="mb-12 mt-6 sm:mb-16 md:mb-20">
          <SprigDivider className="h-3 w-36 opacity-70 sm:w-44" />
        </m.div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 lg:gap-10">
          <RsvpCard />
          <WishCard />
        </div>
      </m.div>
    </section>
  );
}

export default function RsvpWishSection() {
  return (
    <LazyMotion features={domAnimation}>
      <RsvpWishSectionInner />
    </LazyMotion>
  );
}
