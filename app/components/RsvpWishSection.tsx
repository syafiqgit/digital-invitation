"use client";

import { memo, useEffect, useRef, useState, type FormEvent } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  type Transition,
  type Variants,
} from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";
import FloralVine from "./FloralVine";

interface WishItem {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak";
  date: string;
}

interface RsvpPayload {
  name: string;
  attendance: "hadir" | "tidak";
  guestCount: string;
}

interface WishPayload {
  name: string;
  message: string;
  attendance: "hadir" | "tidak";
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: "1",
    name: "John & Family",
    message:
      "Wishing you a lifetime of love and happiness! May your marriage be filled with endless joy.",
    attendance: "hadir",
    date: "Just now",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    message:
      "Congratulations! Wishing both of you a smooth preparation and a wonderful wedding day.",
    attendance: "hadir",
    date: "5 mins ago",
  },
];

const WISHES_STORAGE_KEY = "wedding_wishes_v1";

/* =========================================================================
   DATA LAYER — SIMULATED. Replace these two functions when a real backend
   exists (Next.js API route, Supabase, Firebase, whatever). Everything
   below this block is written against the *contract* (async, can throw,
   returns a definite result) — the calling components don't need to
   change when you swap the implementation, only these two functions do.

   Current behavior: localStorage + fake latency, so state survives a
   refresh on the SAME device/browser. This does NOT make the guestbook
   shared across guests — two different visitors will not see each
   other's entries until this is backed by a real shared store. Don't
   ship this to real guests as-is.
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
    // Storage can fail (quota, private mode) — the UI surfaces this via
    // the thrown error in submitWish, so we don't need to do anything
    // here except avoid crashing.
  }
}

async function submitRsvp(payload: RsvpPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // TODO: replace with a real request, e.g.
  // const res = await fetch("/api/rsvp", { method: "POST", body: JSON.stringify(payload) });
  // if (!res.ok) throw new Error("Failed to submit confirmation");
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
  // TODO: replace with a real request, e.g.
  // const res = await fetch("/api/wishes", { method: "POST", body: JSON.stringify(payload) });
  // if (!res.ok) throw new Error("Failed to submit wish");
  // return res.json();
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
const GPU_HINT = { willChange: "transform, opacity" } as const;
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

const loop = (
  duration: number,
  delay = 0,
  ease: Transition["ease"] = "easeInOut",
): Transition => ({ duration, delay, repeat: Infinity, ease });

const makeSway = (
  magnitude: number,
  duration: number,
  origin: string,
  reverse = false,
) => ({
  rotate: reverse
    ? [0, -magnitude, 0, magnitude, 0]
    : [0, magnitude, 0, -magnitude, 0],
  origin,
  duration,
});

/* ---------- Framer Motion variants (entrance only) ---------- */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

const vineFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

const cornerFade: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const wishItemFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const textLift = {
  textShadow:
    "0 2px 10px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.9)",
} as const;

/* ---------- Static decoration data ---------- */

const scatterItems = [
  { top: "8%", left: "12%", type: "bloom", color: "var(--burgundy)" },
  { top: "18%", left: "85%", type: "leaf", rot: 25 },
  { top: "45%", left: "5%", type: "bloom", color: "var(--coral)" },
  { top: "65%", left: "95%", type: "bloom", color: "var(--blush-dark)" },
  { top: "88%", left: "10%", type: "leaf", rot: -30 },
] as const;

const sparkles = [
  { top: "15%", left: "20%", duration: 3.2, delay: 0 },
  { top: "40%", left: "82%", duration: 3.6, delay: 0.5 },
  { top: "70%", left: "18%", duration: 3.4, delay: 1 },
  { top: "90%", left: "80%", duration: 4, delay: 0.3 },
];

const fireflies = [
  { left: "20%", bottom: "15%", duration: 7, delay: 0 },
  { left: "80%", bottom: "25%", duration: 8.5, delay: 1.5 },
  { left: "15%", bottom: "70%", duration: 7.5, delay: 3 },
];

const petals = [
  { left: "12%", size: 6, duration: 12, delay: 1, color: "var(--sage-light)" },
  {
    left: "88%",
    size: 7,
    duration: 10.5,
    delay: 2,
    color: "var(--blush-dark)",
  },
];

const goldDusts = [
  { left: "10%", bottom: "5%", size: 4, duration: 14, delay: 0 },
  { left: "90%", bottom: "10%", size: 5, duration: 15, delay: 1 },
];

const butterflies = [
  { left: "8%", top: "25%", color: "var(--coral)", duration: 16, delay: 0 },
  { left: "85%", top: "65%", color: "var(--burgundy)", duration: 18, delay: 3 },
];

const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
    delay: 0,
    sway: makeSway(1.1, 7.4, "top center"),
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    sway: makeSway(1.1, 8, "top center", true),
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
    delay: 0.2,
    sway: makeSway(0.7, 8.6, "left center"),
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    sway: makeSway(0.7, 9.2, "left center", true),
  },
];

const vineTransitions = vines.map((v) => loop(v.sway.duration, v.delay + 0.5));

const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    sway: makeSway(1.8, 6.6, "top left"),
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    sway: makeSway(1.8, 7.1, "top right", true),
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    sway: makeSway(1.8, 6.9, "bottom left"),
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    sway: makeSway(1.8, 7.4, "bottom right", true),
  },
];

const cornerTransitions = corners.map((c) =>
  loop(c.sway.duration, c.fadeDelay + 0.5),
);

const cornerOrnaments = [
  {
    cls: "left-2 top-2 sm:left-4 sm:top-4 lg:left-8 lg:top-8",
    rotate: "",
    delay: 0.4,
    duration: 3.6,
  },
  {
    cls: "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8",
    rotate: "rotate-180",
    delay: 0.9,
    duration: 3.9,
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
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none">
      <g transform="translate(14, 14)">
        {ANGLES_5.map((deg) => (
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

const MiniLeaf = memo(function MiniLeaf({
  className = "",
  rot = 0,
}: {
  className?: string;
  rot?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="5.2"
        ry="9.5"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform={`rotate(${rot} 12 12)`}
      />
    </svg>
  );
});

const CornerFlourish = memo(function CornerFlourish({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none">
      <path
        d="M4 4 C 4 24, 18 36, 40 38 C 48 39, 54 44, 56 52"
        stroke="var(--sage)"
        strokeWidth="1.1"
        fill="none"
        opacity="0.6"
      />
      <g transform="translate(10, 10)">
        {ANGLES_5.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5.5"
            rx="3.6"
            ry="7"
            fill="var(--blush-dark)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.2" fill="var(--mustard)" />
      </g>
      <ellipse
        cx="28"
        cy="30"
        rx="3"
        ry="6"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.5"
        transform="rotate(30 28 30)"
      />
    </svg>
  );
});

const Sparkle = memo(function Sparkle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="var(--mustard)">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
});

const Butterfly = memo(function Butterfly({
  className = "",
  color = "var(--coral)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 32 24" className={className} fill="none">
      <line
        x1="16"
        y1="3"
        x2="16"
        y2="21"
        stroke="var(--ink)"
        strokeWidth="1.1"
        opacity="0.55"
      />
      <ellipse cx="8" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse cx="8.5" cy="16" rx="5.5" ry="4.5" fill={color} opacity="0.65" />
      <ellipse cx="24" cy="9" rx="7.5" ry="6" fill={color} opacity="0.85" />
      <ellipse
        cx="23.5"
        cy="16"
        rx="5.5"
        ry="4.5"
        fill={color}
        opacity="0.65"
      />
      <circle cx="8" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
      <circle cx="24" cy="9" r="1.6" fill="var(--mustard)" opacity="0.9" />
    </svg>
  );
});

const MajesticRay = memo(function MajesticRay() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[0] -translate-x-1/2 -translate-y-1/2 opacity-40 animate-[spin_70s_linear_infinite]"
      style={GPU_HINT}
    >
      <div className="h-[700px] w-[700px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.06)_60deg,transparent_120deg,rgba(212,175,55,0.06)_180deg,transparent_240deg,rgba(212,175,55,0.06)_300deg,transparent_360deg)] blur-3xl lg:h-[900px] lg:w-[900px]" />
    </div>
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
      <g transform="translate(110, 14)">
        {ANGLES_6.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.6"
            ry="7"
            fill="var(--coral)"
            opacity="0.92"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.4" fill="var(--mustard)" />
      </g>
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

/* ---------- Ambient decoration ---------- */
/* Pure CSS keyframes — compositor thread only. */

const AmbientDecor = memo(function AmbientDecor() {
  return (
    <div className="hidden sm:contents">
      {scatterItems.map((item, i) => (
        <div
          key={`scatter-${i}`}
          style={{ top: item.top, left: item.left }}
          className="pointer-events-none absolute z-[1]"
        >
          {item.type === "bloom" ? (
            <MiniBloom className="opacity-80" color={item.color} />
          ) : (
            <MiniLeaf className="opacity-70" rot={item.rot} />
          )}
        </div>
      ))}

      {sparkles.map((s, i) => (
        <div
          key={`sparkle-${i}`}
          className="pointer-events-none absolute z-[1] animate-[twinkle_var(--d)_ease-in-out_infinite]"
          style={
            {
              top: s.top,
              left: s.left,
              "--d": `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Sparkle className="h-2.5 w-2.5 lg:h-3.5 lg:w-3.5" />
        </div>
      ))}

      {petals.map((p, i) => (
        <div
          key={`petal-${i}`}
          className="pointer-events-none absolute top-[-5%] z-[1] animate-[petal-fall-rev_var(--d)_linear_infinite]"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--d": `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
            <ellipse
              cx="10"
              cy="10"
              rx="6"
              ry="9"
              fill={p.color}
              opacity="0.7"
            />
          </svg>
        </div>
      ))}

      {butterflies.map((b, i) => (
        <div
          key={`butterfly-${i}`}
          className="pointer-events-none absolute z-[2] h-5 w-6 animate-[butterfly-flit_var(--d)_ease-in-out_infinite] lg:h-7 lg:w-9"
          style={
            {
              left: b.left,
              top: b.top,
              "--d": `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <Butterfly className="h-full w-full" color={b.color} />
        </div>
      ))}

      {goldDusts.map((g, i) => (
        <div
          key={`gd-${i}`}
          className="pointer-events-none absolute z-[15] animate-[gold-rise_var(--d)_linear_infinite]"
          style={
            {
              left: g.left,
              bottom: g.bottom,
              width: g.size,
              height: g.size,
              "--d": `${g.duration}s`,
              animationDelay: `${g.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-gradient-to-tr from-mustard to-yellow-200 blur-[1px] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>
      ))}

      {fireflies.map((f, i) => (
        <div
          key={`firefly-${i}`}
          className="pointer-events-none absolute z-[1] h-1.5 w-1.5 animate-[firefly-drift_var(--d)_ease-in-out_infinite] lg:h-2 lg:w-2"
          style={
            {
              left: f.left,
              bottom: f.bottom,
              "--d": `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <div className="h-full w-full rounded-full bg-mustard blur-[1.5px]" />
        </div>
      ))}
    </div>
  );
});

const FrameLayers = memo(function FrameLayers() {
  return (
    <>
      {vines.map((v, i) => (
        <m.div
          key={v.key}
          variants={vineFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: v.delay }}
          className={`pointer-events-none absolute z-[2] ${v.className} ${v.flip}`}
        >
          <m.div
            animate={{ rotate: v.sway.rotate }}
            transition={vineTransitions[i]}
            style={{ transformOrigin: v.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralVine orientation={v.orientation} className="h-full w-full" />
          </m.div>
        </m.div>
      ))}

      {corners.map((c, i) => (
        <m.div
          key={c.key}
          variants={cornerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: c.fadeDelay }}
          className={`pointer-events-none absolute z-[3] h-16 w-16 opacity-90 sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${c.position}`}
        >
          <m.div
            animate={{ rotate: c.sway.rotate }}
            transition={cornerTransitions[i]}
            style={{ transformOrigin: c.sway.origin, ...GPU_HINT }}
            className="h-full w-full"
          >
            <FloralCorner className="h-full w-full" flip={c.flip} />
          </m.div>
        </m.div>
      ))}

      {cornerOrnaments.map((c, i) => (
        <div
          key={`cf-${i}`}
          className={`pointer-events-none absolute z-[2] h-10 w-10 opacity-90 animate-[ornament-pulse_var(--d)_ease-in-out_infinite] sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${c.cls} ${c.rotate}`}
          style={
            {
              "--d": `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              ...GPU_HINT,
            } as React.CSSProperties
          }
        >
          <CornerFlourish className="h-full w-full" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-3 z-[1] rounded-[2rem] border border-sage/25 sm:inset-5 lg:inset-8" />
    </>
  );
});

/* ---------- RSVP form ---------- */

function RsvpCard() {
  const [rsvpName, setRsvpName] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
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
        guestCount: attendance === "hadir" ? guestCount : "0",
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
      className="group relative h-fit w-full rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-b from-ivory/95 to-white/90 p-6 text-left shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)]" />

      <h3 className="font-serif relative z-10 mb-1 text-center text-xl font-bold text-ink transition-colors group-hover:text-burgundy sm:text-2xl">
        RSVP Confirmation
      </h3>
      <p className="relative z-10 mb-8 text-center text-xs text-ink/70">
        It would be an honor for us if you could attend.
      </p>

      <div className="relative z-10">
        {status === "done" ? (
          <div className="rounded-2xl border border-mustard/50 bg-gradient-to-r from-blush/20 to-white/50 p-6 text-center shadow-inner">
            <p className="font-serif text-xl font-bold text-burgundy">
              Thank You, {rsvpName}!
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink/80">
              Your attendance confirmation (
              <span className="font-bold">
                {attendance === "hadir" ? "Attending" : "Declined"}
              </span>
              ) has been recorded.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-full border border-burgundy/30 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-burgundy transition-all hover:bg-burgundy hover:text-white"
            >
              Change Confirmation
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
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-ink/70"
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
                className="w-full rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-sm text-ink shadow-inner outline-none transition-all placeholder:text-ink/40 focus:bg-white focus:ring-2 focus:ring-mustard/50"
              />
              {errorMsg && (
                <p
                  role="alert"
                  className="mt-1.5 text-[11px] font-medium text-burgundy"
                >
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="rsvp-attendance"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-ink/70"
                >
                  Attendance
                </label>
                <select
                  id="rsvp-attendance"
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(e.target.value as "hadir" | "tidak")
                  }
                  className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-sm text-ink shadow-inner outline-none transition-all focus:bg-white focus:ring-2 focus:ring-mustard/50"
                >
                  <option value="hadir">Attending, God willing</option>
                  <option value="tidak">Sorry, unable to attend</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rsvp-guest-count"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-ink/70"
                >
                  Number of Guests
                </label>
                <select
                  id="rsvp-guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  disabled={attendance === "tidak"}
                  className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-5 py-3.5 text-sm text-ink shadow-inner outline-none transition-all focus:bg-white focus:ring-2 focus:ring-mustard/50 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="text-center text-[11px] font-medium text-burgundy"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-burgundy to-[#5e1927] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(94,25,39,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(94,25,39,0.4)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {status === "submitting" && <SpinnerIcon className="h-4 w-4" />}
              {status === "submitting" ? "Submitting..." : "Send Confirmation"}
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
  const [wishAttendance, setWishAttendance] = useState<"hadir" | "tidak">(
    "hadir",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successBanner, setSuccessBanner] = useState(false);
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWishes(readStoredWishes());
    // Cleanup any pending "success banner" timeout on unmount so we never
    // call setState after this component is gone.
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
      setErrorMsg("Failed to send wish. Please try again.");
    }
  };

  return (
    <m.div
      variants={fadeUp}
      className="group relative flex h-full min-h-[500px] flex-col rounded-[2rem] border-[1.5px] border-mustard/40 bg-gradient-to-b from-white/90 to-ivory/95 p-6 text-left shadow-[0_15px_40px_rgba(212,175,55,0.08)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,1)]" />

      <h3 className="font-serif relative z-10 mb-1 text-center text-xl font-bold text-ink transition-colors group-hover:text-burgundy sm:text-2xl">
        Guestbook &amp; Wishes
      </h3>
      <p className="relative z-10 mb-8 text-center text-xs text-ink/70">
        Leave your best wishes and prayers for us.
      </p>

      <div className="relative z-10 flex h-full flex-col">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mb-6 flex flex-col gap-4"
        >
          {successBanner && (
            <div
              role="status"
              className="rounded-xl border border-mustard/50 bg-blush/20 p-3 text-center text-[11px] font-semibold text-burgundy"
            >
              Wish sent successfully!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wish-name" className="sr-only">
                Your Name
              </label>
              <input
                id="wish-name"
                type="text"
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                placeholder="Your Name"
                aria-invalid={Boolean(errorMsg)}
                className="w-full rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3 text-xs text-ink shadow-inner outline-none transition-all placeholder:text-ink/40 focus:ring-2 focus:ring-mustard/50"
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
                  setWishAttendance(e.target.value as "hadir" | "tidak")
                }
                className="w-full appearance-none rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3 text-xs text-ink shadow-inner outline-none transition-all focus:ring-2 focus:ring-mustard/50"
              >
                <option value="hadir">Attending</option>
                <option value="tidak">Not Attending</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="wish-message" className="sr-only">
              Wishes &amp; Prayers
            </label>
            <textarea
              id="wish-message"
              rows={3}
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
              placeholder="Write your wishes..."
              aria-invalid={Boolean(errorMsg)}
              className="w-full resize-none rounded-2xl border border-mustard/40 bg-white/60 px-4 py-3 text-xs text-ink shadow-inner outline-none transition-all placeholder:text-ink/40 focus:ring-2 focus:ring-mustard/50"
            />
          </div>

          {errorMsg && (
            <p
              role="alert"
              className="text-center text-[11px] font-medium text-burgundy"
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-ink/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          >
            {status === "submitting" && <SpinnerIcon className="h-3.5 w-3.5" />}
            {status === "submitting" ? "Submitting..." : "Send Message"}
          </button>
        </form>

        <div className="flex min-h-0 flex-1 flex-col border-t border-mustard/20 pt-5">
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Wishes List ({wishes.length})
          </p>

          <div className="custom-scroll flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
            {wishes.map((item) => (
              <m.div
                key={item.id}
                variants={wishItemFade}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-mustard/30 bg-white/70 p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="font-serif text-sm font-bold leading-tight text-ink">
                    {item.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                      item.attendance === "hadir"
                        ? "bg-sage-light/50 text-burgundy"
                        : "bg-coral/20 text-ink/60"
                    }`}
                  >
                    {item.attendance === "hadir" ? "Attending" : "Declined"}
                  </span>
                </div>
                <p className="mb-2 text-[11px] italic leading-relaxed text-ink/80">
                  &ldquo;{item.message}&rdquo;
                </p>
                <p className="flex justify-end text-[9px] text-ink/40">
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
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-20 sm:px-6 sm:py-28">
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.4); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }

        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6); }
          50% { opacity: 0.85; transform: scale(1.1); }
        }
        @keyframes petal-fall-rev {
          0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          50% { transform: translate3d(-15px, 57vh, 0) rotate(-180deg); }
          90% { opacity: 0.7; }
          100% { transform: translate3d(0, 115vh, 0) rotate(-360deg); opacity: 0; }
        }
        @keyframes gold-rise {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate3d(8px, -55vh, 0); opacity: 0.4; }
          85% { opacity: 0.8; }
          100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
        }
        @keyframes firefly-drift {
          0%, 100% { transform: translate3d(0,0,0); opacity: 0; }
          25% { transform: translate3d(12px, -60px, 0); opacity: 0.9; }
          50% { transform: translate3d(-8px, -20px, 0); opacity: 0.4; }
          75% { transform: translate3d(6px, -90px, 0); opacity: 0.9; }
        }
        @keyframes butterfly-flit {
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
          25% { transform: translate3d(30px, -20px, 0) rotate(6deg); }
          50% { transform: translate3d(-15px, -5px, 0) rotate(-5deg); }
          75% { transform: translate3d(40px, -30px, 0) rotate(4deg); }
        }
        @keyframes ornament-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          section [style*="animation"], section [class*="animate-"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.26]" />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/30 blur-[100px] sm:h-80 sm:w-80"
        style={GPU_HINT}
      />

      <MajesticRay />
      <FrameLayers />
      <AmbientDecor />

      <m.div
        className="relative z-10 flex w-full max-w-5xl flex-col items-center px-2 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="flex items-center gap-2 sm:gap-3"
        >
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
            transition={loop(3.4, 0.4)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
          <span className="inline-block rounded-full border border-mustard/50 bg-ivory/90 px-3 py-0.5 text-[9px] font-extrabold tracking-[0.28em] text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:py-1 sm:text-[11px] sm:tracking-[0.32em]">
            RSVP &amp; WISHES
          </span>
          <m.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 0] }}
            transition={loop(3.7, 0.8)}
            style={GPU_HINT}
          >
            <MiniBloom
              className="h-3 w-3 opacity-70 sm:h-4 sm:w-4"
              color="var(--sage-light)"
            />
          </m.div>
        </m.div>

        <m.p
          variants={fadeUp}
          className="font-script mt-4 text-4xl font-semibold text-ink sm:mt-5 sm:text-5xl md:text-6xl"
          style={{ ...textLift, ...GPU_HINT }}
        >
          Confirmation &amp; Prayers
        </m.p>

        <m.div
          variants={fadeUp}
          style={GPU_HINT}
          className="mb-10 mt-4 sm:mb-14"
        >
          <SprigDivider className="h-4 w-36 opacity-80 sm:w-44" />
        </m.div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
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
