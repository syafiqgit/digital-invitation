// components/FloralVine.tsx
import { memo } from "react";
import { motion } from "framer-motion";

function FloralVine({
  className = "",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 60 800"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <motion.path
        d="M30 0 C10 60 50 120 30 180 C10 240 50 300 30 360 C10 420 50 480 30 540 C10 600 50 660 30 720 C15 750 30 780 30 800"
        stroke="#8a9a7e"
        strokeWidth="1.4"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      />
      {[70, 190, 310, 430, 550, 670].map((y, i) => (
        <motion.g
          key={i}
          transform={`translate(30, ${y})`}
          initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.25 }}
        >
          <ellipse
            cx="14"
            cy="-4"
            rx="8"
            ry="13"
            fill="#e8ede2"
            stroke="#8a9a7e"
            strokeWidth="1"
            transform="rotate(25)"
          />
          <ellipse
            cx="-14"
            cy="4"
            rx="8"
            ry="13"
            fill="#e8ede2"
            stroke="#8a9a7e"
            strokeWidth="1"
            transform="rotate(-25)"
          />
          {i % 2 === 0 && (
            <g transform="translate(0,-20)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-5"
                  rx="3.5"
                  ry="6"
                  fill="#f0d9d4"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle r="2.5" fill="#d9a5a0" />
            </g>
          )}
        </motion.g>
      ))}
    </svg>
  );
}

export default memo(FloralVine);
