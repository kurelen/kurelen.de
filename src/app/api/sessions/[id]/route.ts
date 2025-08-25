import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Permission } from "@prisma/client";
import { getAuthUser, userHasPermission } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sess = await prisma.session.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!sess) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canRevoke =
    sess.userId === auth.user.id ||
    userHasPermission(auth.user, Permission.ADMIN);

  if (!canRevoke)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.session.update({
    where: { id },
    data: { revokedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
