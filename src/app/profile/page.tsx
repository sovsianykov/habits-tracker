import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [user, habitCount, sessionCount, minutesAgg] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, createdAt: true } }),
    prisma.habit.count({ where: { userId: session.user.id } }),
    prisma.habitSession.count({ where: { userId: session.user.id } }),
    prisma.habitSession.aggregate({ where: { userId: session.user.id }, _sum: { duration: true } }),
  ]);

  if (!user) redirect("/login");

  const totalMinutes = minutesAgg._sum.duration ?? 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  return (
    <AppLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

        {/* User info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Member since {new Date(user.createdAt).toLocaleDateString([], { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Habits", value: habitCount },
            { label: "Sessions", value: sessionCount },
            { label: "Hours", value: totalHours > 0 ? `${totalHours}h ${remainingMins}m` : `${totalMinutes}m` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
              <p className="text-xl font-bold text-indigo-600">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <LogoutButton />
        </div>
      </div>
    </AppLayout>
  );
}
