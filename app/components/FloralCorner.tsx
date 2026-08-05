import { memo } from "react";

type Props = { className?: string };

function Leaf({
  x,
  y,
  rot = 0,
  scale = 1,
  color = "var(--sage-light)",
}: {
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0 0 C 4 -8, 4 -20, 0 -30 C -4 -20, -4 -8, 0 0 Z"
        fill={color}
        stroke="var(--sage)"
        strokeWidth="0.6"
      />
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="-28"
        stroke="var(--sage)"
        strokeWidth="0.4"
        opacity="0.5"
      />
    </g>
  );
}

function Bud({
  x,
  y,
  rot = 0,
  scale = 1,
  color = "var(--coral)",
}: {
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <ellipse cx="0" cy="-9" rx="4" ry="7" fill={color} opacity="0.95" />
      <path
        d="M0 -2 C 3 -6, 3 -10, 0 -14"
        stroke="var(--sage)"
        strokeWidth="0.7"
        fill="none"
        opacity="0.7"
      />
    </g>
  );
}

function Flower({
  x,
  y,
  scale = 1,
  rot = 0,
  petalColor = "var(--burgundy)",
  centerColor = "var(--mustard)",
}: {
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  petalColor?: string;
  centerColor?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-9"
          rx="6.2"
          ry="12.5"
          fill={petalColor}
          opacity="0.96"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="4.2" fill={centerColor} />
    </g>
  );
}

function FloralCorner({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      preserveAspectRatio="xMinYMin meet"
    >
      {/* tangkai utama */}
      <path
        d="M6 4 C 30 22, 45 40, 55 68 C 63 90, 78 100, 105 108"
        stroke="var(--sage)"
        strokeWidth="1.8"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M14 8 C 40 14, 65 12, 95 20 C 118 27, 132 22, 150 12"
        stroke="var(--sage)"
        strokeWidth="1.6"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M10 16 C 16 40, 14 62, 22 88 C 28 108, 22 122, 12 138"
        stroke="var(--sage)"
        strokeWidth="1.6"
        fill="none"
        opacity="0.7"
      />

      {/* daun di sepanjang tangkai diagonal */}
      <Leaf x={22} y={20} rot={-35} scale={0.95} />
      <Leaf x={34} y={34} rot={20} scale={1.1} />
      <Leaf x={44} y={52} rot={-15} scale={1} />
      <Leaf x={56} y={66} rot={35} scale={1.05} />
      <Leaf x={68} y={82} rot={-25} scale={0.9} />
      <Leaf x={82} y={96} rot={15} scale={1} />
      <Leaf x={95} y={104} rot={-30} scale={0.85} />

      {/* daun di sepanjang tangkai atas */}
      <Leaf x={42} y={12} rot={70} scale={0.9} />
      <Leaf x={62} y={16} rot={100} scale={1} />
      <Leaf x={84} y={20} rot={65} scale={0.95} />
      <Leaf x={105} y={22} rot={110} scale={0.9} />
      <Leaf x={126} y={16} rot={75} scale={0.85} />
      <Leaf x={142} y={10} rot={105} scale={0.9} />

      {/* daun di sepanjang tangkai kiri */}
      <Leaf x={14} y={30} rot={5} scale={0.9} />
      <Leaf x={18} y={50} rot={-15} scale={1} />
      <Leaf x={16} y={72} rot={10} scale={0.95} />
      <Leaf x={24} y={94} rot={-20} scale={0.9} />
      <Leaf x={20} y={116} rot={15} scale={0.85} />

      {/* buds kecil pengisi */}
      <Bud x={30} y={44} rot={-40} scale={0.85} color="var(--coral)" />
      <Bud x={72} y={70} rot={20} scale={0.9} color="var(--blush-dark)" />
      <Bud x={110} y={16} rot={-10} scale={0.8} color="var(--coral)" />
      <Bud x={16} y={100} rot={30} scale={0.8} color="var(--blush-dark)" />

      {/* cluster bunga: pojok (besar) */}
      <Flower
        x={16}
        y={16}
        scale={1.5}
        rot={-10}
        petalColor="var(--burgundy)"
      />
      <Flower x={30} y={10} scale={1.1} rot={20} petalColor="var(--coral)" />
      <Flower
        x={8}
        y={30}
        scale={1.05}
        rot={-30}
        petalColor="var(--blush-dark)"
      />

      {/* cluster bunga di ujung tangkai kanan atas */}
      <Flower x={148} y={10} scale={1.2} rot={15} petalColor="var(--coral)" />
      <Flower
        x={162}
        y={4}
        scale={0.9}
        rot={-20}
        petalColor="var(--burgundy)"
      />

      {/* cluster bunga di ujung tangkai diagonal */}
      <Flower
        x={104}
        y={110}
        scale={1.3}
        rot={10}
        petalColor="var(--blush-dark)"
      />
      <Flower
        x={118}
        y={100}
        scale={0.9}
        rot={-25}
        petalColor="var(--burgundy)"
      />

      {/* cluster bunga di ujung tangkai kiri bawah */}
      <Flower x={10} y={140} scale={1.15} rot={5} petalColor="var(--coral)" />
      <Flower
        x={24}
        y={130}
        scale={0.85}
        rot={-15}
        petalColor="var(--blush-dark)"
      />
    </svg>
  );
}

export default memo(FloralCorner);
