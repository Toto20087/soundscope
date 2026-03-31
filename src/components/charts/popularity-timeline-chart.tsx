"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PopularityTimelineChartProps {
  data: Array<{ year: number; name: string; playcount: number }>;
  color?: string;
  height?: number;
}

export function PopularityTimelineChartInner({
  data,
  color = "#91000a",
  height = 280,
}: PopularityTimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="popularityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "#1a1c1c", fontSize: 10, fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => {
            if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
            if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
            return v.toString();
          }}
          width={50}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">{d.year}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{d.name}</p>
                <p className="text-sm text-gray-500">{d.playcount.toLocaleString()} plays</p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="playcount"
          stroke={color}
          fill="url(#popularityFill)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
