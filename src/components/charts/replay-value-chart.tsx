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

interface ReplayValueChartProps {
  data: Array<{
    name: string;
    listeners: number;
    playcount: number;
    replayRatio: number;
  }>;
  color?: string;
  height?: number;
}

export function ReplayValueChartInner({
  data,
  color = "#91000a",
  height = 280,
}: ReplayValueChartProps) {
  // Average replay ratio for reference
  const avgRatio =
    data.length > 0
      ? Math.round(
          (data.reduce((s, d) => s + d.replayRatio, 0) / data.length) * 10
        ) / 10
      : 0;

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="listeners"
            name="Listeners"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => {
              if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
              if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
              return v.toString();
            }}
          />
          <YAxis
            type="number"
            dataKey="playcount"
            name="Plays"
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
                  <p className="text-sm font-bold text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">
                    {d.listeners.toLocaleString()} listeners
                  </p>
                  <p className="text-xs text-gray-500">
                    {d.playcount.toLocaleString()} plays
                  </p>
                  <p className="text-xs font-bold mt-1" style={{ color }}>
                    Replay ratio: {d.replayRatio}x
                  </p>
                </div>
              );
            }}
          />
          <Scatter dataKey="playcount">
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.replayRatio > avgRatio ? color : `${color}60`}
                r={Math.max(5, Math.min(12, entry.replayRatio * 3))}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {/* Axis labels */}
      <div className="flex justify-between mt-2 text-[10px] font-bold opacity-40 uppercase tracking-widest px-12">
        <span>Fewer listeners</span>
        <span>More listeners</span>
      </div>
    </div>
  );
}
