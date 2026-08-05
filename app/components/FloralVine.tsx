import { memo } from "react";

type Props = {
  className?: string;
  orientation?: "vertical" | "horizontal";
};

const stemPathVertical =
  "M50 0 C42 60 58 120 46 180 C36 240 60 300 48 360 C40 420 58 480 46 540 C38 600 58 660 48 720 C42 760 52 780 50 800";
const stemPathHorizontal =
  "M0 50 C60 42 120 58 180 46 C240 36 300 60 360 48 C420 40 480 58 540 46 C600 38 660 58 720 48 C760 42 780 52 800 50";

type PointType = "leaf" | "flower-big" | "flower-small";

function generatePoints(): {
  pos: number;
  type: PointType;
  rot: number;
  color: string;
  twigSide: 1 | -1;
}[] {
  const colors = ["burgundy", "coral", "blush-dark"];
  const sequence: PointType[] = ["leaf", "flower-big", "leaf", "flower-small"];
  const points: {
    pos: number;
    type: PointType;
    rot: number;
    color: string;
    twigSide: 1 | -1;
  }[] = [];
  const start = 5;
  const end = 95;
  const count = 13;
  const step = (end - start) / (count - 1);

  for (let i = 0; i < count; i++) {
    const pos = start + step * i;
    const type = sequence[i % sequence.length];
    const rot = i % 2 === 0 ? -28 + (i % 5) * 4 : 28 - (i % 5) * 4;
    const color = colors[i % colors.length];
    const twigSide: 1 | -1 = i % 2 === 0 ? 1 : -1;
    points.push({ pos, type, rot, color, twigSide });
  }

  return points;
}

const points = generatePoints();

function Leaf({ rot = 0 }: { rot?: number }) {
  return (
    <ellipse
      cx="20"
      cy="20"
      rx="9"
      ry="16.5"
      fill="var(--sage-light)"
      stroke="var(--sage)"
      strokeWidth="0.7"
      transform={`rotate(${rot} 20 20)`}
    />
  );
}

function FlowerDot({
  color = "burgundy",
  big = true,
}: {
  color?: string;
  big?: boolean;
}) {
  const fill =
    color === "burgundy"
      ? "var(--burgundy)"
      : color === "coral"
        ? "var(--coral)"
        : "var(--blush-dark)";
  const scale = big ? 1.05 : 0.75;
  return (
    <g transform={`translate(20, 20) scale(${scale})`}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-8"
          rx="5.6"
          ry="11.5"
          fill={fill}
          opacity="0.97"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="3.8" fill="var(--mustard)" />
    </g>
  );
}

function Twig({
  side = 1,
  color = "coral",
}: {
  side?: 1 | -1;
  color?: string;
}) {
  const fill =
    color === "burgundy"
      ? "var(--burgundy)"
      : color === "coral"
        ? "var(--coral)"
        : "var(--blush-dark)";
  const dx = side * 10;
  return (
    <g>
      <path
        d={`M20 26 C ${20 + dx * 0.5} 30, ${20 + dx} 33, ${20 + dx} 37`}
        stroke="var(--sage)"
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      <ellipse
        cx={20 + dx}
        cy="37"
        rx="2.8"
        ry="5"
        fill={fill}
        opacity="0.85"
        transform={`rotate(${side * 20} ${20 + dx} 37)`}
      />
      <g
        transform={`translate(${20 + dx * 0.55} 31) rotate(${side * 35}) scale(0.65)`}
      >
        <path
          d="M0 0 C 4 -7, 4 -17, 0 -26 C -4 -17, -4 -7, 0 0 Z"
          fill="var(--sage-light)"
          stroke="var(--sage)"
          strokeWidth="0.6"
        />
      </g>
    </g>
  );
}

function FloralVine({ className = "", orientation = "vertical" }: Props) {
  const isVertical = orientation === "vertical";

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={isVertical ? "0 0 100 800" : "0 0 800 100"}
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d={isVertical ? stemPathVertical : stemPathHorizontal}
          stroke="var(--sage)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {points.map((p, i) => (
        <div
          key={i}
          className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          style={
            isVertical
              ? { top: `${p.pos}%`, left: "50%" }
              : { left: `${p.pos}%`, top: "50%" }
          }
        >
          <svg
            viewBox="0 0 40 40"
            className="h-full w-full overflow-visible"
            fill="none"
          >
            <Twig side={p.twigSide} color={p.color} />
            {p.type === "leaf" ? (
              <Leaf rot={p.rot} />
            ) : (
              <FlowerDot color={p.color} big={p.type === "flower-big"} />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}

export default memo(FloralVine);
