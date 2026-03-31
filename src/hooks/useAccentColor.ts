"use client";

import { useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";

const DEFAULT_COLOR = {
  hex: "#8B5CF6",
  rgb: "139, 92, 246",
  light: "rgba(139, 92, 246, 0.08)",
  medium: "rgba(139, 92, 246, 0.5)",
  isDark: false,
};

export interface AccentColors {
  hex: string;
  rgb: string;
  light: string; // 8% opacity — for card tints
  medium: string; // 50% opacity — for fills
  isDark: boolean;
}

/**
 * Extract dominant color from an image URL.
 * Falls back to purple if CORS fails or color is too dull.
 */
export function useAccentColor(imageUrl: string | null): AccentColors {
  const [colors, setColors] = useState<AccentColors>(DEFAULT_COLOR);

  useEffect(() => {
    if (!imageUrl) return;

    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const result = fac.getColor(img, { algorithm: "dominant" });
        const [r, g, b] = result.value;

        // Validate: skip too dull, too dark, or too light colors
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lightness = (max + min) / 2 / 255;
        const saturation =
          max === min
            ? 0
            : lightness > 0.5
              ? (max - min) / (510 - max - min)
              : (max - min) / (max + min);

        if (saturation < 0.12 || lightness < 0.15 || lightness > 0.85) {
          // Color is too gray/dark/light — keep default
          return;
        }

        setColors({
          hex: result.hex,
          rgb: `${r}, ${g}, ${b}`,
          light: `rgba(${r}, ${g}, ${b}, 0.08)`,
          medium: `rgba(${r}, ${g}, ${b}, 0.5)`,
          isDark: result.isDark,
        });
      } catch {
        // CORS or other failure — keep default
      }
    };

    return () => {
      fac.destroy();
    };
  }, [imageUrl]);

  return colors;
}
