import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import DashboardCalendar from "@/components/DashboardCalendar";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const sessions = await prisma.habitSession.findMany({
    where: { userId: session.user.id },
    include: { habit: { select: { id: true, title: true } } },
    orderBy: { startTime: "desc" },
  });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { sessions: true } } },
    orderBy: { createdAt: "asc" },
  });

  const serialized = sessions.map((s) => ({
    id: s.id,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    duration: s.duration,
    notes: s.notes,
    habit: s.habit,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{habits.length} habit{habits.length !== 1 ? "s" : ""} tracked</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <DashboardCalendar sessions={serialized} />
        </div>

        {habits.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">All habits</h2>
            <ul className="space-y-2">
              {habits.map((h) => (
                <li key={h.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800">{h.title}</p>
                    {h.description && <p className="text-xs text-gray-400 mt-0.5">{h.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{h._count.sessions} sessions</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
