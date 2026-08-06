"use client";

import { memo, useCallback, useMemo, useState, type FormEvent } from "react";
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

interface GuestbookSectionProps {
  guestName?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ANGLES_5 = [0, 72, 144, 216, 288] as const;
const MAX_CHARS = 250;

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

const attendanceOptions: { value: Attendance; label: string; emoji: string }[] =
  [
    { value: "hadir", label: "Hadir", emoji: "✅" },
    { value: "tidak-hadir", label: "Tidak Hadir", emoji: "🙏" },
    { value: "ragu", label: "Masih Ragu", emoji: "🤔" },
  ];

const avatarPalette = [
  "var(--burgundy)",
  "var(--coral)",
  "var(--sage)",
  "var(--mustard)",
  "var(--blush-dark)",
];

const fireflies = [
  { left: "9%", top: "18%", duration: 7, delay: 0 },
  { left: "20%", top: "72%", duration: 8.5, delay: 1.5 },
  { left: "87%", top: "22%", duration: 7.5, delay: 3 },
  { left: "91%", top: "68%", duration: 9, delay: 2 },
  { left: "50%", top: "10%", duration: 8, delay: 4.5 },
] as const;

const floatingPetals = [
  { left: "13%", size: 6, duration: 11, delay: 0, color: "var(--blush-dark)" },
  { left: "79%", size: 7, duration: 13, delay: 4, color: "var(--sage-light)" },
] as const;

const fairyLights = [
  { cx: 30, cy: 24 },
  { cx: 70, cy: 10 },
  { cx: 110, cy: 20 },
  { cx: 150, cy: 8 },
  { cx: 190, cy: 20 },
] as const;

function getTimeLabel() {
  return new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function attendanceBadgeClass(attendance: Attendance) {
  if (attendance === "hadir") return "bg-sage-light/70 text-sage";
  if (attendance === "tidak-hadir") return "bg-blush-dark/25 text-burgundy";
  return "bg-mustard/30 text-ink";
}

function attendanceLabel(attendance: Attendance) {
  if (attendance === "hadir") return "HADIR";
  if (attendance === "tidak-hadir") return "TIDAK HADIR";
  return "RAGU";
}

const MiniFlower = memo(function MiniFlower({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <g transform="translate(20, 20)">
        {ANGLES_5.map((deg) => (
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
});

const OrnateDivider = memo(function OrnateDivider({
  className = "",
}: {
  className?: string;
}) {
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
        {ANGLES_5.map((deg) => (
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
});

const MailIcon = memo(function MailIcon({
  className = "",
}: {
  className?: string;
}) {
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
});

const EmptyStateIcon = memo(function EmptyStateIcon({
  className = "",
}: {
  className?: string;
}) {
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
        {ANGLES_5.map((deg) => (
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
        opacity="0.5"
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

const Firefly = memo(function Firefly({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`rounded-full bg-mustard blur-[1.5px] ${className}`} />
  );
});

const Avatar = memo(function Avatar({ name }: { name: string }) {
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
});

const SummaryStat = memo(function SummaryStat({
  value,
  label,
  border,
  bg,
  valueColor,
}: {
  value: number;
  label: string;
  border: string;
  bg: string;
  valueColor: string;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center rounded-xl border ${border} ${bg} py-2.5`}
    >
      <span className={`text-base font-bold ${valueColor}`}>{value}</span>
      <span className="text-[9px] font-bold tracking-wide text-ink/70">
        {label}
      </span>
    </div>
  );
});

const MessageCard = memo(function MessageCard({ msg }: { msg: Message }) {
  return (
    <motion.div
      layout
      variants={messageItem}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ willChange: "transform, opacity" }}
      className="rounded-2xl border border-sage/30 bg-ivory px-4 py-3.5 text-left shadow-[0_8px_20px_-14px_rgba(58,54,48,0.3)]"
    >
      <div className="flex items-start gap-2.5">
        <Avatar name={msg.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-ink">{msg.name}</p>
            <span
              className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide ${attendanceBadgeClass(msg.attendance)}`}
            >
              {attendanceLabel(msg.attendance)}
            </span>
          </div>
          <p className="mt-1 flex items-start gap-1 text-xs font-medium leading-relaxed text-ink/90">
            <MiniFlower className="mt-0.5 h-3 w-3 shrink-0 opacity-70" />
            <span>{msg.text}</span>
          </p>
          <p className="mt-1.5 text-[10px] font-medium text-ink/50">
            {msg.createdAt}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default function GuestbookSection({
  guestName = "",
}: GuestbookSectionProps) {
  const [name, setName] = useState(guestName);
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const summary = useMemo(
    () => ({
      hadir: messages.filter((m) => m.attendance === "hadir").length,
      tidakHadir: messages.filter((m) => m.attendance === "tidak-hadir").length,
      ragu: messages.filter((m) => m.attendance === "ragu").length,
    }),
    [messages],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !text.trim()) return;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        name: name.trim(),
        attendance,
        text: text.trim(),
        createdAt: getTimeLabel(),
      };

      setMessages((prev) => [newMessage, ...prev]);
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    },
    [name, attendance, text],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value.slice(0, MAX_CHARS));
    },
    [],
  );

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundPattern className="h-full w-full opacity-[0.32]" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-12 z-0 h-56 w-56 rounded-full bg-blush/35 blur-[90px] lg:h-[22rem] lg:w-[22rem]" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 h-48 w-48 rounded-full bg-sage-light/40 blur-[80px] lg:h-72 lg:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-mustard/15 blur-[70px] lg:h-56 lg:w-56" />

      <motion.svg
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 w-full opacity-80 lg:h-20"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        {fairyLights.map((f, i) => (
          <g key={`fl-${i}`}>
            <circle
              cx={f.cx}
              cy={f.cy}
              r="4.5"
              fill="var(--mustard)"
              opacity="0.18"
            />
            <motion.circle
              cx={f.cx}
              cy={f.cy}
              r="2.2"
              fill="var(--mustard)"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 2.2 + (i % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          </g>
        ))}
      </motion.svg>

      <div className="hidden sm:contents">
        {floatingPetals.map((p, i) => (
          <motion.div
            key={`petal-${i}`}
            className="pointer-events-none absolute top-[-6%] z-[1]"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{
              y: ["0vh", "112vh"],
              x: [0, 14, -8, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 20 20" fill="none">
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="9"
                fill={p.color}
                opacity="0.65"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="hidden sm:block">
        <motion.div
          className="pointer-events-none absolute left-[6%] top-[35%] z-[1] h-4 w-5 lg:h-6 lg:w-8"
          animate={{
            x: [0, 30, -14, 40, 0],
            y: [0, -20, -4, -28, 0],
            rotate: [0, 6, -5, 4, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ scaleX: [1, 0.82, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <Butterfly className="h-full w-full" color="var(--coral)" />
          </motion.div>
        </motion.div>
      </div>

      <div className="contents">
        {fireflies.map((f, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="pointer-events-none absolute z-[1] h-1.5 w-1.5 lg:h-2 lg:w-2"
            style={{ left: f.left, top: f.top }}
            animate={{
              y: [0, -30, -8, -40, 0],
              x: [0, 10, -6, 8, 0],
              opacity: [0, 0.9, 0.4, 0.9, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Firefly className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute -left-8 -top-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-8 -right-8 z-0 hidden h-28 w-28 opacity-55 sm:block lg:h-40 lg:w-40"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeOnly}
      >
        <motion.div
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="h-full w-full"
        >
          <FloralCorner className="h-full w-full -scale-x-100 -scale-y-100" />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-4 z-[1] rounded-[2rem] border border-sage/25 sm:inset-6 lg:inset-10" />
      <div className="pointer-events-none absolute inset-7 z-[1] hidden rounded-[2.5rem] border border-dashed border-mustard/25 sm:block lg:inset-12" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 mx-auto flex max-w-lg flex-col items-center"
      >
        <motion.span
          variants={fadeUp}
          className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-burgundy/40 bg-burgundy/10 px-4 py-1 text-xs font-bold tracking-[0.35em] text-burgundy"
        >
          <MailIcon className="h-3.5 w-3.5" />
          UCAPAN &amp; DOA
        </motion.span>
        <motion.p
          variants={fadeUp}
          className="font-script mt-3 text-center text-2xl font-semibold text-ink lg:text-3xl"
        >
          Kirimkan Doa Terbaikmu
        </motion.p>
        <motion.div variants={fadeUp} className="mt-3">
          <OrnateDivider className="h-4 w-32" />
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          style={{ willChange: "transform, opacity" }}
          className="mt-8 w-full rounded-3xl border border-sage/40 bg-gradient-to-b from-blush/15 to-sage-light/10 p-6 shadow-[0_16px_40px_-20px_rgba(58,54,48,0.35)] sm:p-7"
        >
          <label className="block text-left text-xs font-bold tracking-wide text-ink/80">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nama kamu"
            className="mt-1.5 w-full rounded-xl border border-sage/40 bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20"
          />

          <label className="mt-4 block text-left text-xs font-bold tracking-wide text-ink/80">
            Konfirmasi Kehadiran
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {attendanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendance(opt.value)}
                className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[10.5px] font-bold transition-colors sm:text-[11px] ${
                  attendance === opt.value
                    ? "border-blush-dark bg-blush-dark text-white shadow-sm"
                    : "border-sage/40 bg-ivory text-ink/80 hover:border-sage/60"
                }`}
              >
                <span className="text-sm leading-none">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-baseline justify-between text-left text-xs font-bold tracking-wide text-ink/80">
            <span>Ucapan &amp; Doa</span>
            <span className="text-[10px] font-semibold text-ink/60">
              {text.length}/{MAX_CHARS}
            </span>
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            required
            rows={3}
            placeholder="Tuliskan ucapan dan doa terbaikmu untuk kedua mempelai..."
            className="mt-1.5 w-full resize-none rounded-xl border border-sage/40 bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20"
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
                className="mt-3 text-center text-xs font-bold text-sage"
              >
                Terima kasih atas ucapan &amp; doanya 🌸
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 flex w-full items-center justify-center gap-2 sm:gap-3"
          >
            <SummaryStat
              value={summary.hadir}
              label="HADIR"
              border="border-sage/40"
              bg="bg-sage-light/20"
              valueColor="text-sage"
            />
            <SummaryStat
              value={summary.tidakHadir}
              label="TIDAK HADIR"
              border="border-burgundy/30"
              bg="bg-blush-dark/15"
              valueColor="text-burgundy"
            />
            <SummaryStat
              value={summary.ragu}
              label="RAGU"
              border="border-mustard/40"
              bg="bg-mustard/15"
              valueColor="text-ink"
            />
          </motion.div>
        )}

        <div className="mt-8 w-full">
          {messages.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sage/40 bg-blush/10 py-10"
            >
              <EmptyStateIcon className="h-12 w-12 opacity-70" />
              <p className="text-center text-xs font-medium italic text-ink/70">
                Belum ada ucapan. Jadilah yang pertama mengirimkan doa!
              </p>
            </motion.div>
          ) : (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false} mode="popLayout">
                {messages.map((msg) => (
                  <MessageCard key={msg.id} msg={msg} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
