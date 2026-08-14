"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface AnalyticsChartProps {
  title: string;
  data: { month: string; count: number }[];
  color?: string;
}

// Shortens "1 Jan 2026" style labels down to just the month abbreviation,
// since the x-axis gets cramped with 12 full dates.
function shortenMonth(label: string) {
  const parts = label.split(" ");
  return parts.length >= 2 ? parts[1] : label;
}

export default function AnalyticsChart({
  title,
  data,
  color = "#C9A227",
}: AnalyticsChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="border border-ink/10 bg-surface rounded-sm p-6">
      <p className="text-ink/50 text-sm mb-4">{title}</p>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#28241C" />
            <XAxis
              dataKey="month"
              tickFormatter={shortenMonth}
              stroke="#F3EEE280"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#F3EEE280"
              tick={{ fontSize: 11 }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E1B15",
                border: "1px solid rgba(243,238,226,0.1)",
                borderRadius: 4,
                fontSize: 13,
              }}
              labelStyle={{ color: "#F3EEE2" }}
              itemStyle={{ color }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-ink/40 text-sm">
          No data yet
        </div>
      )}
    </div>
  );
}
