"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import BackgroundPattern from "./BackgroundPattern";
import FloralCorner from "./FloralCorner";

type Attendance = "hadir" | "tidak-hadir" | "ragu";

interface Message {
  id: string;
  name: string;
  attendance: Attendance;
  text: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Animation config                                                    */
/*  - Semua transisi hanya opacity + transform -> GPU-only, mulus.      */
/*  - viewport once: true untuk animasi masuk section (form & header).  */
/*  - List pesan pakai AnimatePresence popLayout supaya insert/exit      */
/*    tidak saling mendorong layout secara kasar (mencegah jitter).     */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

const messageItem: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2, ease: EASE } },
};

const attendanceOptions: {
  value: Attendance;
  label: string;
  emoji: string;
}[] = [
  { value: "hadir", label: "Hadir", emoji: "✅" },
  { value: "tidak-hadir", label: "Tidak Hadir", emoji: "🙏" },
  { value: "ragu", label: "Masih Ragu", emoji: "🤔" },
];

/* ------------------------------------------------------------------ */
/*  Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function MiniFlower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <g transform="translate(20, 20)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-8"
            rx="4.6"
            ry="8.5"
            fill="var(--blush-dark)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.8" fill="var(--mustard)" />
      </g>
    </svg>
  );
}

function OrnateDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 20" className={className} fill="none">
      <line
        x1="0"
        y1="10"
        x2="62"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <line
        x1="98"
        y1="10"
        x2="160"
        y2="10"
        stroke="var(--mustard)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <g transform="translate(80, 10)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-4.4"
            rx="2.8"
            ry="5.4"
            fill="var(--burgundy)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="1.8" fill="var(--mustard)" />
      </g>
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect
        x="2.5"
        y="5"
        width="19"
        height="14"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 6.5 12 13l8.5-6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyStateIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M12 20h40a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V22a2 2 0 0 1 2-2z"
        stroke="var(--sage)"
        strokeWidth="1.6"
        fill="var(--blush)"
        opacity="0.5"
      />
      <path
        d="M12 21 32 36 52 21"
        stroke="var(--sage)"
        strokeWidth="1.6"
        fill="none"
      />
      <g transform="translate(32, 14)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5"
            rx="3.2"
            ry="6"
            fill="var(--coral)"
            opacity="0.9"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2" fill="var(--mustard)" />
      </g>
    </svg>
  );
}

/* avatar bulat berisi inisial nama, warna dipilih deterministik dari    */
/* nama supaya konsisten tiap kali dirender ulang (bukan acak).          */
const avatarPalette = [
  "var(--burgundy)",
  "var(--coral)",
  "var(--sage)",
  "var(--mustard)",
  "var(--blush-dark)",
];

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const colorIndex =
    name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    avatarPalette.length;
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
      style={{ backgroundColor: avatarPalette[colorIndex] }}
    >
      {initial}
    </div>
  );
}

function attendanceBadgeClass(attendance: Attendance) {
  if (attendance === "hadir") return "bg-sage-light/60 text-sage";
  if (attendance === "tidak-hadir") return "bg-blush-dark/20 text-burgundy";
  return "bg-mustard/20 text-ink/70";
}

function attendanceLabel(attendance: Attendance) {
  if (attendance === "hadir") return "HADIR";
  if (attendance === "tidak-hadir") return "TIDAK HADIR";
  return "RAGU";
}

const MAX_CHARS = 250;

export default function GuestbookSection({
  guestName = "",
}: {
  guestName?: string;
}) {
  const [name, setName] = useState(guestName);
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const summary = useMemo(() => {
    return {
      hadir: messages.filter((m) => m.attendance === "hadir").length,
      tidakHadir: messages.filter((m) => m.attendance === "tidak-hadir").length,
      ragu: messages.filter((m) => m.attendance === "ragu").length,
    };
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      name: name.trim(),
      attendance,
      text: text.trim(),
      createdAt: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:py-28">
      {/* dasar dekoratif — konsisten dengan section lain */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.25]" />
      </div>
      <div className="pointer-events-none absolute -right-16 top-10 z-0 h-56 w-56 rounded-full bg-blush/30 blur-[95px] lg:h-80 lg:w-80" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-52 w-52 rounded-full bg-sage-light/30 blur-[90px] lg:h-72 lg:w-72" />

      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-28 w-28 opacity-50 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mx-auto flex max-w-lg flex-col items-center"
      >
        <motion.span
          variants={fadeUp}
          className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-burgundy/25 bg-burgundy/5 px-4 py-1 text-xs font-bold tracking-[0.35em] text-burgundy"
        >
          <MailIcon className="h-3.5 w-3.5" />
          UCAPAN &amp; DOA
        </motion.span>
        <motion.p
          variants={fadeUp}
          className="font-script mt-3 text-center text-2xl text-ink lg:text-3xl"
        >
          Kirimkan Doa Terbaikmu
        </motion.p>
        <motion.div variants={fadeUp} className="mt-3">
          <OrnateDivider className="h-4 w-32" />
        </motion.div>

        {/* form dibungkus kartu lebih premium: shadow, radius besar */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          style={{ willChange: "transform, opacity" }}
          className="mt-8 w-full rounded-3xl border border-sage/30 bg-gradient-to-b from-blush/15 to-sage-light/10 p-6 shadow-[0_16px_40px_-20px_rgba(58,54,48,0.35)] sm:p-7"
        >
          <label className="block text-left text-xs font-semibold tracking-wide text-ink/70">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nama kamu"
            className="mt-1.5 w-full rounded-xl border border-sage/30 bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20"
          />

          <label className="mt-4 block text-left text-xs font-semibold tracking-wide text-ink/70">
            Konfirmasi Kehadiran
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {attendanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendance(opt.value)}
                className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[10.5px] font-semibold transition-colors sm:text-[11px] ${
                  attendance === opt.value
                    ? "border-blush-dark bg-blush-dark text-white shadow-sm"
                    : "border-sage/30 bg-ivory text-ink/70 hover:border-sage/50"
                }`}
              >
                <span className="text-sm leading-none">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-baseline justify-between text-left text-xs font-semibold tracking-wide text-ink/70">
            <span>Ucapan &amp; Doa</span>
            <span className="text-[10px] font-normal text-ink/40">
              {text.length}/{MAX_CHARS}
            </span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            required
            rows={3}
            placeholder="Tuliskan ucapan dan doa terbaikmu untuk kedua mempelai..."
            className="mt-1.5 w-full resize-none rounded-xl border border-sage/30 bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20"
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="mt-5 w-full rounded-full bg-blush-dark py-3 text-xs font-bold tracking-[0.2em] text-white shadow-md transition hover:scale-[1.02]"
          >
            KIRIM UCAPAN
          </motion.button>

          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-3 text-center text-xs font-semibold text-sage"
              >
                Terima kasih atas ucapan &amp; doanya 🌸
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        {/* ringkasan kehadiran — elemen baru supaya section terasa lebih */}
        {/* "rame"/informatif, muncul begitu ada minimal 1 pesan.          */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 flex w-full items-center justify-center gap-2 sm:gap-3"
          >
            <div className="flex flex-1 flex-col items-center rounded-xl border border-sage/25 bg-sage-light/15 py-2.5">
              <span className="text-base font-bold text-sage">
                {summary.hadir}
              </span>
              <span className="text-[9px] font-semibold tracking-wide text-ink/55">
                HADIR
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center rounded-xl border border-burgundy/20 bg-blush-dark/10 py-2.5">
              <span className="text-base font-bold text-burgundy">
                {summary.tidakHadir}
              </span>
              <span className="text-[9px] font-semibold tracking-wide text-ink/55">
                TIDAK HADIR
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center rounded-xl border border-mustard/25 bg-mustard/10 py-2.5">
              <span className="text-base font-bold text-ink/70">
                {summary.ragu}
              </span>
              <span className="text-[9px] font-semibold tracking-wide text-ink/55">
                RAGU
              </span>
            </div>
          </motion.div>
        )}

        {/* daftar pesan — dibungkus scroll area supaya section tidak    */}
        {/* memanjang tak terbatas kalau ucapan sudah banyak.             */}
        <div className="mt-8 w-full">
          {messages.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sage/30 bg-blush/10 py-10"
            >
              <EmptyStateIcon className="h-12 w-12 opacity-70" />
              <p className="text-center text-xs italic text-ink/50">
                Belum ada ucapan. Jadilah yang pertama mengirimkan doa!
              </p>
            </motion.div>
          ) : (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false} mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    variants={messageItem}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    style={{ willChange: "transform, opacity" }}
                    className="rounded-2xl border border-sage/20 bg-ivory px-4 py-3.5 text-left shadow-[0_8px_20px_-14px_rgba(58,54,48,0.3)]"
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar name={msg.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-ink">
                            {msg.name}
                          </p>
                          <span
                            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide ${attendanceBadgeClass(
                              msg.attendance,
                            )}`}
                          >
                            {attendanceLabel(msg.attendance)}
                          </span>
                        </div>
                        <p className="mt-1 flex items-start gap-1 text-xs leading-relaxed text-ink/70">
                          <MiniFlower className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
                          <span>{msg.text}</span>
                        </p>
                        <p className="mt-1.5 text-[10px] text-ink/40">
                          {msg.createdAt}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
