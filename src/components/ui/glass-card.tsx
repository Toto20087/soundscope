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
        "bg-white",
        "shadow-[0_2px_20px_rgba(0,0,0,0.04)]",
        "rounded-3xl p-6",
        "transition-all duration-300",
        "hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
        glow && "shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]",
        className
      )}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300"
          style={{ background: `linear-gradient(90deg, var(--accent-hex) 0%, #06B6D4 50%, #10B981 100%)` }}
        />
      )}
      {children}
    </div>
  );
}
