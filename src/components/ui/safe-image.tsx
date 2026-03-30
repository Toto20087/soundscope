"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  fallback?: string;
  className?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fallback = "/images/placeholder-album.svg",
  className,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  if (!imgSrc || hasError) {
    return (
      <div
        className={cn(
          "bg-bg-tertiary flex items-center justify-center text-text-tertiary",
          className
        )}
        style={{ width, height }}
        aria-label={alt}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={Math.min(width, height) * 0.4}
          height={Math.min(width, height) * 0.4}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        if (!hasError) {
          setImgSrc(fallback);
          setHasError(true);
        }
      }}
    />
  );
}
