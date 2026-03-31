"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieChartWrapperProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  accentColor?: string;
}

export function PieChartWrapperInner({
  data,
  height = 300,
  accentColor = "#91000a",
}: PieChartWrapperProps) {
  // Generate color shades from accent — darkest for largest, fading for smaller
  const total = data.reduce((s, d) => s + d.value, 0);
  const topPercentage = total > 0 ? Math.round((data[0]?.value / total) * 100) : 0;

  // Find what the top slice represents
  const topSliceName = data[0]?.name || "";

  // Colors: accent (darkest) for top, then progressively lighter/pinker
  const sliceColors = data.map((_, i) => {
    if (i === 0) return accentColor;
    // Lighter shades: mix with pink/salmon
    const opacity = Math.max(0.2, 1 - i * 0.25);
    return `rgba(254, 138, 126, ${opacity})`;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: "100%", maxWidth: 280, height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={1}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={sliceColors[i]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0];
                return (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
                    <p className="text-sm font-bold text-gray-900">{d.name}</p>
                    <p className="text-sm text-gray-500">
                      {(d.value as number).toLocaleString()} plays
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-heading text-4xl font-black">{topPercentage}%</span>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">
            {topSliceName.length > 12 ? topSliceName.substring(0, 10) + "..." : topSliceName}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {data.slice(0, 3).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sliceColors[i] }} />
            <span className="text-xs font-medium">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
