import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  accent = false,
  glow = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-white/[0.05] backdrop-blur-xl",
        "border border-white/[0.1]",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
        "rounded-2xl p-6",
        "transition-all duration-300",
        "hover:bg-white/[0.08] hover:border-white/[0.15]",
        glow && "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
        className
      )}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />
      )}
      {children}
    </div>
  );
}
