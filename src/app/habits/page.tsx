import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import HabitsClient from "@/components/HabitsClient";
import { redirect } from "next/navigation";

export default async function HabitsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { sessions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
        <HabitsClient habits={habits.map((h) => ({ ...h, createdAt: h.createdAt.toISOString() }))} />
      </div>
    </AppLayout>
  );
}
