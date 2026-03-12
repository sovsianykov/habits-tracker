import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { habitSchema } from "@/lib/validations";

async function getOwnedHabit(id: string, userId: string) {
  return prisma.habit.findFirst({ where: { id, userId } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const habit = await getOwnedHabit(id, session.user.id);
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const result = habitSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.habit.update({ where: { id }, data: result.data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const habit = await getOwnedHabit(id, session.user.id);
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.habit.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
