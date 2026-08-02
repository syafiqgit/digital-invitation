// components/FloatingPetals.tsx
"use client";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useDeviceCapability } from "../hooks/useDeviceCapability";

interface FloatingPetalsProps {
  count?: number;
}

function FloatingPetals({ count = 16 }: FloatingPetalsProps) {
  const { reduceMotion } = useDeviceCapability();

  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 10 + 10,
        duration: Math.random() * 6 + 8,
        delay: Math.random() * 6,
        rotateDir: Math.random() > 0.5 ? 1 : -1,
        color: i % 3 === 0 ? "#d9a5a0" : i % 3 === 1 ? "#f0d9d4" : "#c9dcc0",
      })),
    [count],
  );

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-5%]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.rotateDir * 30, 0],
            rotate: [0, p.rotateDir * 180, p.rotateDir * 360],
            opacity: [0, 0.9, 0.9, 0],
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
              opacity="0.85"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default memo(FloatingPetals);
