import { cn } from "@/lib/utils";

interface PopularityBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
}

export function PopularityBar({
  value,
  max = 100,
  className,
  showValue = false,
}: PopularityBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Popularity: ${percentage}%`}
      >
        <div
          className="h-full rounded-full bar-gradient transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-mono text-text-tertiary">
          {percentage}%
        </span>
      )}
    </div>
  );
}
