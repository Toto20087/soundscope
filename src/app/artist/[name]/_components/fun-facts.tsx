"use client";

import { motion } from "framer-motion";
import {
  Calendar, TrendingUp, Zap, Music, Crown,
  Globe, Palette, BarChart3, Users,
} from "lucide-react";
import type { FunFact } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar, Users, TrendingUp, Zap, Music, Crown, Globe, Palette, BarChart3,
};

interface FunFactsProps {
  facts: FunFact[];
}

export function FunFacts({ facts }: FunFactsProps) {
  if (facts.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      {facts.map((fact) => {
        const Icon = ICON_MAP[fact.icon] || BarChart3;
        return (
          <motion.div
            key={fact.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="p-8 rounded-[2rem] border-l-4 transition-colors duration-300"
            style={{
              backgroundColor: "var(--accent-light)",
              borderLeftColor: "var(--accent-hex)",
            }}
          >
            <span className="mb-4 block transition-colors duration-300" style={{ color: "var(--accent-hex)" }}>
              <Icon className="w-6 h-6" />
            </span>
            <h4 className="font-heading font-bold text-lg leading-tight mb-2">
              {fact.title}
            </h4>
            <p className="text-sm opacity-70 leading-relaxed">{fact.text}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
