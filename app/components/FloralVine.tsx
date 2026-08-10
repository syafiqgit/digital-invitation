"use client";

import { memo, useEffect, useState } from "react";

type Props = {
  className?: string;
  orientation?: "vertical" | "horizontal";
  tileSize?: number;
};

const VINE_SRC = "/assets/floral-border-transparent.png";

function FloralVine({
  className = "",
  orientation = "vertical",
  tileSize = 260,
}: Props) {
  const isVertical = orientation === "vertical";
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isVertical) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.translate(img.height / 2, img.width / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setRotatedUrl(canvas.toDataURL("image/png"));
    };
    img.src = VINE_SRC;
  }, [isVertical]);

  if (isVertical) {
    return (
      <div
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

  if (!rotatedUrl) return <div className={className} />;

  return (
    <div
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
