"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TrackConcentrationChartProps {
  topPercentage: number;
  topPlays: number;
  restPlays: number;
  isHitsArtist: boolean;
  color?: string;
}

export function TrackConcentrationChartInner({
  topPercentage,
  topPlays,
  restPlays,
  isHitsArtist,
  color = "#91000a",
}: TrackConcentrationChartProps) {
  const data = [
    { name: "Top 5 Tracks", value: topPlays },
    { name: "Rest of Catalog", value: restPlays },
  ];

  const restColor = `${color}30`;

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
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill={restColor} />
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
            Top 5 Tracks
          </span>
        </div>
      </div>

      {/* Legend + verdict */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-medium">Top 5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: restColor }} />
          <span className="text-xs font-medium">Rest</span>
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest opacity-40 mt-3">
        {isHitsArtist ? "Hits-driven artist" : "Deep cuts artist"}
      </p>
    </div>
  );
}
