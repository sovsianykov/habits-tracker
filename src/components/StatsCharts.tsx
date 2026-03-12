"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

interface DailyData {
  date: string;
  totalMinutes: number;
}

interface HabitData {
  habitTitle: string;
  totalMinutes: number;
}

type TrendData = Record<string, string | number>;

interface Props {
  daily: DailyData[];
  byHabit: HabitData[];
  trend: TrendData[];
  habitNames: string[];
}

function CustomTooltipMinutes({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-indigo-600">{payload[0].value} min</p>
    </div>
  );
}

export default function StatsCharts({ daily, byHabit, trend, habitNames }: Props) {
  return (
    <div className="space-y-8">
      {/* Bar chart — last 7 days */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Last 7 days</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltipMinutes />} />
            <Bar dataKey="totalMinutes" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Pie chart — time distribution */}
      {byHabit.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Time distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byHabit}
                dataKey="totalMinutes"
                nameKey="habitTitle"
                cx="50%"
                cy="45%"
                outerRadius={80}
                innerRadius={40}
                isAnimationActive
              >
                {byHabit.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
              />
              <Tooltip formatter={(v) => [`${v} min`]} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Line chart — 30-day trend per habit */}
      {trend.length > 0 && habitNames.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">30-day trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend formatter={(value) => <span className="text-xs text-gray-700">{value}</span>} />
              {habitNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}
