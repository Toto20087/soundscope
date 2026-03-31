"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface RadarChartWrapperProps {
  data: Array<{ metric: string; value: number; fullMark: number }>;
  height?: number;
  color?: string;
}

export function RadarChartWrapperInner({
  data,
  height = 300,
  color = "#91000a",
}: RadarChartWrapperProps) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
          <PolarGrid stroke="#e2e2e2" strokeWidth={0.5} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: "#1a1c1c",
              fontSize: 10,
              fontWeight: 700,
            }}
          />
          <Radar
            name="Profile"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
