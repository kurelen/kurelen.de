import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser, userHasPermission } from "@/lib/session";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = userHasPermission(auth.user, "ADMIN");
  const where = isAdmin ? undefined : { userId: auth.user.id };

  const sessions = await prisma.session.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, userId: true, createdAt: true, lastActiveAt: true, revokedAt: true },
  });

  return NextResponse.json({ sessions });
}
