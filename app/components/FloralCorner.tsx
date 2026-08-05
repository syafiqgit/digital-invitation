import { memo } from "react";

type Props = {
  className?: string;
};

function FloralCorner({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 260 260" className={className} fill="none">
      {/* watercolor base supaya sudut terasa penuh */}
      <circle cx="70" cy="70" r="72" fill="#f7ebe7" opacity="0.95" />
      <circle cx="120" cy="90" r="58" fill="#f3e1dd" opacity="0.9" />
      <circle cx="96" cy="136" r="52" fill="#f9f0ec" opacity="0.9" />

      {/* layer daun besar di belakang */}
      {[
        { x: 32, y: 52, rx: 18, ry: 34, rot: -40 },
        { x: 52, y: 34, rx: 17, ry: 32, rot: -16 },
        { x: 80, y: 40, rx: 16, ry: 30, rot: 8 },
        { x: 42, y: 92, rx: 17, ry: 32, rot: -52 },
        { x: 78, y: 92, rx: 18, ry: 34, rot: 4 },
        { x: 104, y: 80, rx: 17, ry: 32, rot: 26 },
        { x: 118, y: 112, rx: 16, ry: 30, rot: 44 },
        { x: 88, y: 132, rx: 17, ry: 32, rot: 10 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx={leaf.rx}
          ry={leaf.ry}
          fill="#e8ede2"
          stroke="#8fa28a"
          strokeWidth="0.8"
          opacity="0.95"
          transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
        />
      ))}

      {/* bunga utama (besar) */}
      <g transform="translate(74, 74)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-20"
            rx="13"
            ry="26"
            fill="#a13d3d"
            opacity="0.98"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="9" fill="#d9a441" />
      </g>

      {/* bunga medium blush */}
      <g transform="translate(46, 104)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-16"
            rx="10"
            ry="22"
            fill="#d9a5a0"
            opacity="0.98"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="7" fill="#f0d9d4" />
      </g>

      {/* bunga medium warm */}
      <g transform="translate(98, 112)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-15"
            rx="9.5"
            ry="20"
            fill="#e08a6b"
            opacity="0.98"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="6.2" fill="#f7ebe7" />
      </g>

      {/* bunga blush di bawah untuk mengisi sudut */}
      <g transform="translate(86, 142)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-13"
            rx="8.5"
            ry="18"
            fill="#d9a5a0"
            opacity="0.98"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="5.8" fill="#f0d9d4" />
      </g>

      {/* cluster bunga kecil di sekeliling (biar meledak ke luar) */}
      {[
        { tx: 28, ty: 46, color: "#a13d3d" },
        { tx: 32, ty: 124, color: "#e08a6b" },
        { tx: 104, ty: 38, color: "#d9a5a0" },
        { tx: 124, ty: 86, color: "#a13d3d" },
        { tx: 82, ty: 128, color: "#e08a6b" },
        { tx: 54, ty: 138, color: "#d9a5a0" },
      ].map((f, i) => (
        <g key={i} transform={`translate(${f.tx}, ${f.ty})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-8"
              rx="5"
              ry="11"
              fill={f.color}
              opacity="0.97"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="3.6" fill="#f0d9d4" />
        </g>
      ))}

      {/* titik berry kecil untuk nambah detail */}
      {[
        { x: 52, y: 34 },
        { x: 34, y: 80 },
        { x: 96, y: 36 },
        { x: 118, y: 64 },
        { x: 92, y: 122 },
        { x: 56, y: 118 },
        { x: 112, y: 130 },
      ].map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r="3.4"
          fill="#a13d3d"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

export default memo(FloralCorner);
