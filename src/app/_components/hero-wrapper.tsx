"use client";

import IntroAnimation from "@/components/scroll-morph-hero";
import type { HeroCover } from "@/lib/get-hero-covers";

interface HeroWrapperProps {
  covers: HeroCover[];
}

export function HeroWrapper({ covers }: HeroWrapperProps) {
  return <IntroAnimation covers={covers} />;
}
