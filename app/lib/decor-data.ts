// Static decoration data for CoupleSection. Separated from components so
// the data itself has no render cost and can be reasoned about on its own.

export const ANGLES_5 = [0, 72, 144, 216, 288] as const;
export const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;

export const scatterItems = [
  { top: "6%", left: "10%", type: "bloom", color: "var(--burgundy)" },
  { top: "5%", left: "90%", type: "leaf", rot: 25 },
  { top: "88%", left: "6%", type: "bloom", color: "var(--coral)" },
  { top: "88%", left: "94%", type: "bloom", color: "var(--blush-dark)" },
  { top: "34%", left: "3%", type: "bloom", color: "var(--sage-light)" },
  { top: "34%", left: "97%", type: "leaf", rot: -10 },
  { top: "60%", left: "4%", type: "leaf", rot: 15 },
  { top: "60%", left: "96%", type: "bloom", color: "var(--coral)" },
] as const;

export const sparkles = [
  { top: "14%", left: "45%", duration: 3, delay: 0 },
  { top: "22%", left: "12%", duration: 3.4, delay: 0.4 },
  { top: "22%", left: "88%", duration: 3.8, delay: 0.8 },
  { top: "68%", left: "14%", duration: 3.2, delay: 1.2 },
  { top: "70%", left: "86%", duration: 3.6, delay: 0.2 },
];

export const floatingPetals = [
  { left: "18%", size: 11, duration: 13, delay: 1, color: "var(--coral)" },
  { left: "70%", size: 10, duration: 15, delay: 4, color: "var(--sage-light)" },
  { left: "45%", size: 12, duration: 12, delay: 6, color: "var(--burgundy)" },
  { left: "8%", size: 26, duration: 9, delay: 2, color: "var(--blush-dark)" },
  { left: "58%", size: 24, duration: 10, delay: 5.5, color: "var(--coral)" },
];

export const goldDusts = [
  { left: "18%", bottom: "-4%", size: 5, duration: 14, delay: 0 },
  { left: "50%", bottom: "0%", size: 6, duration: 16, delay: 2.5 },
  { left: "82%", bottom: "-6%", size: 4, duration: 12, delay: 1 },
];

export const butterflies = [
  { left: "12%", top: "20%", color: "var(--coral)", duration: 17, delay: 0 },
  { left: "84%", top: "24%", color: "var(--burgundy)", duration: 19, delay: 4 },
];

export const fireflies = [
  { left: "16%", bottom: "12%", duration: 7.5, delay: 0 },
  { left: "82%", bottom: "18%", duration: 8, delay: 1.5 },
  { left: "22%", bottom: "55%", duration: 8.5, delay: 3 },
];

export const fairyLights = [
  { cx: 40, cy: 34, delay: 0 },
  { cx: 110, cy: 14, delay: 0.4 },
  { cx: 200, cy: 24, delay: 0.8 },
  { cx: 290, cy: 14, delay: 1.2 },
  { cx: 360, cy: 34, delay: 0.3 },
] as const;

export const cornerOrnaments = [
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
  {
    cls: "right-2 top-2 sm:right-4 sm:top-4 lg:right-8 lg:top-8",
    rotate: "rotate-90",
    delay: 1.4,
    duration: 3.3,
  },
  {
    cls: "bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-8 lg:left-8",
    rotate: "-rotate-90",
    delay: 0.2,
    duration: 4.1,
  },
];

export const wreathBlooms = [
  { x: 40, y: 14, s: 1, color: "var(--burgundy)" },
  { x: 95, y: 6, s: 0.8, color: "var(--coral)" },
  { x: 150, y: 16, s: 0.9, color: "var(--blush-dark)" },
  { x: 205, y: 5, s: 0.75, color: "var(--coral)" },
  { x: 260, y: 15, s: 1, color: "var(--burgundy)" },
] as const;

export const wreathLeaves = [
  { x: 65, y: 12, rot: -20 },
  { x: 120, y: 4, rot: 15 },
  { x: 178, y: 12, rot: -12 },
  { x: 232, y: 4, rot: 18 },
] as const;

export const grassBlades = [
  { x: 10, h: 22, rot: -8 },
  { x: 24, h: 30, rot: 4 },
  { x: 40, h: 18, rot: -12 },
  { x: 58, h: 26, rot: 6 },
  { x: 76, h: 20, rot: -4 },
  { x: 94, h: 28, rot: 10 },
  { x: 300, h: 20, rot: -6 },
  { x: 318, h: 28, rot: 8 },
  { x: 336, h: 18, rot: -10 },
  { x: 354, h: 26, rot: 5 },
  { x: 372, h: 22, rot: -3 },
  { x: 390, h: 30, rot: 9 },
] as const;

export const vines = [
  {
    key: "left",
    orientation: "vertical" as const,
    className: "absolute left-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "",
    delay: 0,
    swayDuration: 7.4,
    swayMagnitude: 1.1,
    swayOrigin: "top center",
    swayReverse: false,
  },
  {
    key: "right",
    orientation: "vertical" as const,
    className: "absolute right-0 top-0 h-full w-6 opacity-70 sm:w-10 lg:w-14",
    flip: "-scale-x-100",
    delay: 0.1,
    swayDuration: 8,
    swayMagnitude: 1.1,
    swayOrigin: "top center",
    swayReverse: true,
  },
  {
    key: "top",
    orientation: "horizontal" as const,
    className: "absolute left-0 top-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "",
    delay: 0.2,
    swayDuration: 8.6,
    swayMagnitude: 0.7,
    swayOrigin: "left center",
    swayReverse: false,
  },
  {
    key: "bottom",
    orientation: "horizontal" as const,
    className: "absolute bottom-0 left-0 h-6 w-full opacity-70 sm:h-10 lg:h-14",
    flip: "-scale-y-100",
    delay: 0.3,
    swayDuration: 9.2,
    swayMagnitude: 0.7,
    swayOrigin: "left center",
    swayReverse: true,
  },
];

export const corners = [
  {
    key: "top-left",
    position: "top-2 left-2 sm:top-4 sm:left-4",
    flip: "",
    fadeDelay: 0,
    swayDuration: 6.6,
    swayMagnitude: 1.8,
    swayOrigin: "top left",
    swayReverse: false,
  },
  {
    key: "top-right",
    position: "top-2 right-2 sm:top-4 sm:right-4",
    flip: "-scale-x-100",
    fadeDelay: 0.1,
    swayDuration: 7.1,
    swayMagnitude: 1.8,
    swayOrigin: "top right",
    swayReverse: true,
  },
  {
    key: "bottom-left",
    position: "bottom-2 left-2 sm:bottom-4 sm:left-4",
    flip: "-scale-y-100",
    fadeDelay: 0.2,
    swayDuration: 6.9,
    swayMagnitude: 1.8,
    swayOrigin: "bottom left",
    swayReverse: false,
  },
  {
    key: "bottom-right",
    position: "bottom-2 right-2 sm:bottom-4 sm:right-4",
    flip: "-scale-x-100 -scale-y-100",
    fadeDelay: 0.3,
    swayDuration: 7.4,
    swayMagnitude: 1.8,
    swayOrigin: "bottom right",
    swayReverse: true,
  },
];
