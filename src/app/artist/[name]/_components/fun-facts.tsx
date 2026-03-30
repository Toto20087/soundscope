"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Zap,
  Music,
  Crown,
  Globe,
  Palette,
  BarChart3,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { FunFact } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  TrendingUp,
  Zap,
  Music,
  Crown,
  Globe,
  Palette,
  BarChart3,
};

interface FunFactsProps {
  facts: FunFact[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FunFacts({ facts }: FunFactsProps) {
  if (facts.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {facts.map((fact) => {
        const Icon = ICON_MAP[fact.icon] || BarChart3;
        return (
          <motion.div key={fact.id} variants={item}>
            <GlassCard className="relative overflow-hidden">
              {/* Left accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-purple" />

              <div className="pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs uppercase tracking-wider text-text-tertiary font-medium">
                    {fact.title}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {fact.text}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
