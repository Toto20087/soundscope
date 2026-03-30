"use client";

import { motion } from "framer-motion";
import { Mic, BarChart3, Music } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const FEATURES = [
  {
    icon: Mic,
    title: "Artist Deep Dives",
    description:
      "Explore detailed profiles with bios, genre tags, stats, and similar artists.",
  },
  {
    icon: BarChart3,
    title: "Album Timelines",
    description:
      "See how an artist evolved chronologically, album by album, with visual analytics.",
  },
  {
    icon: Music,
    title: "Track Analytics",
    description:
      "Discover top tracks, popularity patterns, and auto-generated insights.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
};

export function FeatureShowcase() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {FEATURES.map((feature) => (
        <motion.div key={feature.title} variants={item}>
          <GlassCard accent className="h-full">
            <feature.icon className="w-8 h-8 text-accent-purple mb-4" />
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
