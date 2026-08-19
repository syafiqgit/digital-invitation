"use client";

import { memo, useEffect, useState } from "react";

interface FloralVineProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
  tileSize?: number;
}

const VINE_SRC = "/assets/floral-vine.webp";
let cachedRotatedUrl: string | null = null; // In-memory cache

function FloralVine({
  className = "",
  orientation = "vertical",
  tileSize = 260,
}: FloralVineProps) {
  const isVertical = orientation === "vertical";
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(
    isVertical ? null : cachedRotatedUrl,
  );

  useEffect(() => {
    if (isVertical || cachedRotatedUrl) return;

    let isMounted = true; // Guard untuk mencegah memory leak

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!isMounted) return; // Batal update state jika keburu unmount

      const canvas = document.createElement("canvas");
      canvas.width = img.height;
      canvas.height = img.width;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.translate(img.height / 2, img.width / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const dataUrl = canvas.toDataURL("image/png");
      cachedRotatedUrl = dataUrl; // Simpan ke cache global
      setRotatedUrl(dataUrl);
    };
    img.src = VINE_SRC;

    return () => {
      isMounted = false; // Cleanup
    };
  }, [isVertical]);

  if (isVertical) {
    return (
      <div
        aria-hidden="true"
        className={`relative ${className}`}
        style={{
          backgroundImage: `url(${VINE_SRC})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: `auto ${tileSize}px`,
          backgroundPosition: "center top",
        }}
      />
    );
  }

  if (!rotatedUrl) return <div aria-hidden="true" className={className} />;

  return (
    <div
      aria-hidden="true"
      className={`relative ${className}`}
      style={{
        backgroundImage: `url(${rotatedUrl})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: `${tileSize}px auto`,
        backgroundPosition: "left center",
      }}
    />
  );
}

export default memo(FloralVine);
