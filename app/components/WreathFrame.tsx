import { memo } from "react";

type Props = { className?: string };

function WreathFrame({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 220 220" className={className} fill="none">
      <circle
        cx="110"
        cy="110"
        r="80"
        stroke="var(--mustard)"
        strokeWidth="1.4"
      />
      <circle
        cx="110"
        cy="110"
        r="74"
        stroke="var(--mustard)"
        strokeWidth="0.7"
        opacity="0.6"
      />

      {/* bunga di kiri bawah wreath */}
      <g transform="translate(40, 160)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-9"
            rx="6.5"
            ry="13"
            fill="var(--burgundy)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="4.2" fill="var(--mustard)" />
      </g>
      <g transform="translate(60, 174)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="4.6"
            ry="9"
            fill="var(--blush-dark)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="3" fill="var(--blush)" />
      </g>
      <ellipse
        cx="30"
        cy="142"
        rx="8"
        ry="15"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform="rotate(-30 30 142)"
      />
      <ellipse
        cx="50"
        cy="162"
        rx="7"
        ry="13"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform="rotate(20 50 162)"
      />

      {/* bunga di kanan atas wreath */}
      <g transform="translate(180, 60)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-8"
            rx="5.6"
            ry="11"
            fill="var(--coral)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="3.6" fill="var(--mustard)" />
      </g>
      <g transform="translate(160, 46)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-5"
            rx="3.8"
            ry="7.6"
            fill="var(--blush-dark)"
            opacity="0.96"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="2.6" fill="var(--blush)" />
      </g>
      <ellipse
        cx="188"
        cy="78"
        rx="7"
        ry="13"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform="rotate(30 188 78)"
      />
      <ellipse
        cx="170"
        cy="58"
        rx="6.5"
        ry="12"
        fill="var(--sage-light)"
        stroke="var(--sage)"
        strokeWidth="0.6"
        transform="rotate(-20 170 58)"
      />
    </svg>
  );
}

export default memo(WreathFrame);
