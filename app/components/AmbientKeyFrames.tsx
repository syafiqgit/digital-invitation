"use client";

export function AmbientKeyframes() {
  return (
    <style>{`
      @keyframes couple-twinkle {
        0%, 100% { opacity: 0.15; transform: scale(0.6); }
        50% { opacity: 0.9; transform: scale(1.2); }
      }
      @keyframes couple-petal-fall {
        0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.7; }
        50% { transform: translate3d(16px, 57vh, 0) rotate(180deg); }
        90% { opacity: 0.7; }
        100% { transform: translate3d(0, 115vh, 0) rotate(360deg); opacity: 0; }
      }
      @keyframes couple-gold-rise {
        0% { transform: translate3d(0,0,0); opacity: 0; }
        15% { opacity: 0.8; }
        50% { transform: translate3d(10px, -52vh, 0); opacity: 0.4; }
        85% { opacity: 0.8; }
        100% { transform: translate3d(0, -105vh, 0); opacity: 0; }
      }
      @keyframes couple-firefly-drift {
        0%, 100% { transform: translate3d(0,0,0); opacity: 0; }
        25% { transform: translate3d(10px, -55px, 0); opacity: 0.9; }
        50% { transform: translate3d(-6px, -18px, 0); opacity: 0.4; }
        75% { transform: translate3d(4px, -80px, 0); opacity: 0.9; }
      }
      @keyframes couple-butterfly-flit {
        0%, 100% { transform: translate3d(0,0,0) rotate(0deg); }
        25% { transform: translate3d(32px, -22px, 0) rotate(6deg); }
        50% { transform: translate3d(-16px, -6px, 0) rotate(-5deg); }
        75% { transform: translate3d(40px, -28px, 0) rotate(4deg); }
      }
      @keyframes couple-ornament-pulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(5deg); }
      }
      @keyframes couple-sway {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(var(--sway-mag)); }
        75% { transform: rotate(calc(var(--sway-mag) * -1)); }
      }
      @keyframes couple-fairy-blink {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 1; }
      }
      @keyframes couple-glow-pulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.6; }
      }
      @media (prefers-reduced-motion: reduce) {
        [class*="couple-anim-"] {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    `}</style>
  );
}
