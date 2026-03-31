"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface ScatterChartWrapperProps {
  data: Array<{ name: string; duration: number; isOutlier: boolean }>;
  averageDuration?: number;
  height?: number;
  color?: string;
}

export function ScatterChartWrapperInner({
  data,
  averageDuration,
  color = "#8B5CF6",
  height = 300,
}: ScatterChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
        <XAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: "#71717a" }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
          hide
        />
        <YAxis
          type="number"
          dataKey="duration"
          name="Duration"
          unit=" min"
          tick={{ fontSize: 12, fill: "#71717a" }}
          axisLine={false}
          tickLine={false}
        />
        {averageDuration && (
          <ReferenceLine
            y={averageDuration}
            stroke={color}
            strokeDasharray="5 5"
            label={{
              value: `Avg: ${averageDuration.toFixed(1)} min`,
              fill: color,
              fontSize: 11,
            }}
          />
        )}
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
                <p className="text-sm font-medium text-gray-900">{d.name}</p>
                <p className="text-sm text-gray-500">
                  {d.duration} min
                  {d.isOutlier && " (outlier)"}
                </p>
              </div>
            );
          }}
        />
        <Scatter dataKey="duration">
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.isOutlier ? "#F43F5E" : color}
              r={entry.isOutlier ? 6 : 4}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
