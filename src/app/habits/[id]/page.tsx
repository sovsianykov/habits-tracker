import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import SessionForm from "@/components/SessionForm";
import { redirect, notFound } from "next/navigation";

export default async function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const habit = await prisma.habit.findFirst({ where: { id, userId: session.user.id } });
  if (!habit) notFound();

  const sessions = await prisma.habitSession.findMany({
    where: { habitId: id, userId: session.user.id },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  const totalMinutes = sessions.reduce((s, x) => s + x.duration, 0);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{habit.title}</h1>
          {habit.description && <p className="text-gray-500 text-sm mt-1">{habit.description}</p>}
          <p className="text-sm text-indigo-600 mt-1 font-medium">
            {totalMinutes} min total · {sessions.length} sessions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Log a session</h2>
          <SessionForm habitId={id} />
        </div>

        {sessions.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">History</h2>
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-1.5 h-10 bg-indigo-400 rounded-full shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(s.startTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {s.duration} min
                    </p>
                    {s.notes && <p className="text-xs text-gray-400 mt-0.5">{s.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
