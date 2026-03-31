"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "@/components/ui/skeletons";

const LazyBarChart = dynamic(
  () =>
    import("./bar-chart-wrapper").then((mod) => ({
      default: mod.BarChartWrapperInner,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyAreaChart = dynamic(
  () =>
    import("./area-chart-wrapper").then((mod) => ({
      default: mod.AreaChartWrapperInner,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface MetricOption {
  key: string;
  label: string;
  color?: string;
}

interface ChartContainerProps {
  title: string;
  data: Array<Record<string, string | number>>;
  metrics: MetricOption[];
  xAxisKey?: string;
  chartType?: "bar" | "area";
  className?: string;
}

export function ChartContainer({
  title,
  data,
  metrics,
  xAxisKey = "name",
  chartType = "bar",
  className,
}: ChartContainerProps) {
  const [activeMetric, setActiveMetric] = useState(metrics[0]?.key || "");

  const activeOption = metrics.find((m) => m.key === activeMetric) || metrics[0];
  const Chart = chartType === "area" ? LazyAreaChart : LazyBarChart;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xl font-heading font-semibold text-text-primary">
          {title}
        </h3>
        {metrics.length > 1 && (
          <div className="flex gap-2" role="tablist">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                role="tab"
                aria-selected={metric.key === activeMetric}
                onClick={() => setActiveMetric(metric.key)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  metric.key === activeMetric
                    ? "text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                )}
                style={
                  metric.key === activeMetric
                    ? { backgroundColor: "var(--accent-hex)" }
                    : undefined
                }
              >
                {metric.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Chart
        data={data}
        dataKey={activeOption?.key || ""}
        xAxisKey={xAxisKey}
        color={activeOption?.color || "#8B5CF6"}
      />
    </div>
  );
}
