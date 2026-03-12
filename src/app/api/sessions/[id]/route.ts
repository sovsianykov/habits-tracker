import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validations";

async function getOwnedSession(id: string, userId: string) {
  return prisma.habitSession.findFirst({ where: { id, userId } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnedSession(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const result = sessionSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const data = {
    ...result.data,
    ...(result.data.startTime ? { startTime: new Date(result.data.startTime) } : {}),
    ...(result.data.endTime ? { endTime: new Date(result.data.endTime) } : {}),
  };

  const updated = await prisma.habitSession.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnedSession(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.habitSession.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
