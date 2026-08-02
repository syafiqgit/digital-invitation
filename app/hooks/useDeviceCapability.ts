import { useEffect, useState } from "react";

export function useDeviceCapability() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    setIsDesktop(mqDesktop.matches);
    setReduceMotion(mqMotion.matches);
    setIsTouch("ontouchstart" in window);

    const handleDesktop = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const handleMotion = (e: MediaQueryListEvent) => setReduceMotion(e.matches);

    mqDesktop.addEventListener("change", handleDesktop);
    mqMotion.addEventListener("change", handleMotion);
    return () => {
      mqDesktop.removeEventListener("change", handleDesktop);
      mqMotion.removeEventListener("change", handleMotion);
    };
  }, []);

  return { isDesktop, reduceMotion, isTouch };
}
