import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");

  const sessions = await prisma.habitSession.findMany({
    where: {
      userId: session.user.id,
      ...(habitId ? { habitId } : {}),
    },
    include: { habit: { select: { id: true, title: true } } },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = sessionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const habit = await prisma.habit.findFirst({
    where: { id: result.data.habitId, userId: session.user.id },
  });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  const habitSession = await prisma.habitSession.create({
    data: {
      ...result.data,
      startTime: new Date(result.data.startTime),
      endTime: new Date(result.data.endTime),
      userId: session.user.id,
    },
  });

  return NextResponse.json(habitSession, { status: 201 });
}
