import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/tokens";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const tokenHash = sha256Hex(token);
  const invite = await prisma.invite.findUnique({ where: { tokenHash } });

  if (!invite || invite.consumedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    email: invite.email,
    expiresAt: invite.expiresAt.toISOString(),
    permissions: invite.permissions,
  });
}
