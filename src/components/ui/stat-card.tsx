import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <GlassCard className={cn("text-center py-4 px-3", className)}>
      <Icon
        className="w-5 h-5 mx-auto mb-2 transition-colors duration-300"
        style={{ color: "var(--accent-hex)" }}
      />
      <div className="text-3xl font-bold font-mono text-gradient">{value}</div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
    </GlassCard>
  );
}
