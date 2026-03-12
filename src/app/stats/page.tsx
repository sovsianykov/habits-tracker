import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import StatsCharts from "@/components/StatsCharts";
import HabitProgressBar from "@/components/HabitProgressBar";
import { redirect } from "next/navigation";

const COLORS = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-red-500"];

export default async function StatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [habits, allSessions, recentSessions] = await Promise.all([
    prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.habitSession.findMany({
      where: { userId, startTime: { gte: thirtyDaysAgo } },
      include: { habit: { select: { title: true } } },
      orderBy: { startTime: "asc" },
    }),
    prisma.habitSession.findMany({
      where: { userId, startTime: { gte: sevenDaysAgo } },
      orderBy: { startTime: "asc" },
    }),
  ]);

  // Daily totals for last 7 days
  const dailyMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    dailyMap.set(key, 0);
  }
  for (const s of recentSessions) {
    const d = new Date(s.startTime);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) ?? 0) + s.duration);
  }
  const daily = Array.from(dailyMap.entries()).map(([date, totalMinutes]) => ({ date, totalMinutes }));

  // Per-habit totals (all time in last 30 days)
  const habitTotals = new Map<string, number>();
  for (const s of allSessions) {
    habitTotals.set(s.habit.title, (habitTotals.get(s.habit.title) ?? 0) + s.duration);
  }
  const byHabit = habits
    .map((h) => ({ habitTitle: h.title, totalMinutes: habitTotals.get(h.title) ?? 0 }))
    .filter((h) => h.totalMinutes > 0);

  // 30-day trend per habit
  const trendMap = new Map<string, Map<string, number>>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(thirtyDaysAgo.getDate() + i);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    trendMap.set(key, new Map());
  }
  for (const s of allSessions) {
    const d = new Date(s.startTime);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    if (trendMap.has(key)) {
      const day = trendMap.get(key)!;
      day.set(s.habit.title, (day.get(s.habit.title) ?? 0) + s.duration);
    }
  }
  const habitNames = habits.map((h) => h.title);
  const trend = Array.from(trendMap.entries()).map(([date, habitMap]) => {
    const row: Record<string, string | number> = { date };
    for (const name of habitNames) row[name] = habitMap.get(name) ?? 0;
    return row;
  });

  const maxMinutes = Math.max(...byHabit.map((h) => h.totalMinutes), 1);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>

        {byHabit.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">No activity yet. Start tracking habits!</p>
          </div>
        ) : (
          <>
            {/* Progress bars */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Time per habit (30 days)</h2>
              {byHabit.map((h, i) => (
                <HabitProgressBar
                  key={h.habitTitle}
                  title={h.habitTitle}
                  minutes={h.totalMinutes}
                  maxMinutes={maxMinutes}
                  color={COLORS[i % COLORS.length]}
                />
              ))}
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <StatsCharts daily={daily} byHabit={byHabit} trend={trend} habitNames={habitNames} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
