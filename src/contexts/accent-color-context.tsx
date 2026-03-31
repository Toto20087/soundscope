"use client";

import { createContext, useContext } from "react";
import { useAccentColor, type AccentColors } from "@/hooks/useAccentColor";

const AccentColorContext = createContext<AccentColors>({
  hex: "#8B5CF6",
  rgb: "139, 92, 246",
  light: "rgba(139, 92, 246, 0.08)",
  medium: "rgba(139, 92, 246, 0.5)",
  isDark: false,
});

export function AccentColorProvider({
  imageUrl,
  children,
}: {
  imageUrl: string | null;
  children: React.ReactNode;
}) {
  const colors = useAccentColor(imageUrl);

  return (
    <AccentColorContext.Provider value={colors}>
      <div
        style={{
          // @ts-expect-error CSS custom properties
          "--accent-hex": colors.hex,
          "--accent-rgb": colors.rgb,
          "--accent-light": colors.light,
        }}
      >
        {children}
      </div>
    </AccentColorContext.Provider>
  );
}

export function useAccentColorContext() {
  return useContext(AccentColorContext);
}
