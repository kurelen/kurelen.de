import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RegisterRequest } from "@/lib/schemas";
import { sha256Hex } from "@/lib/tokens";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = RegisterRequest.safeParse(json);

  if (!parsed.success) {
    const details = parsed.error.flatten();
    const body =
      process.env.NODE_ENV === "development"
        ? { error: "Invalid body", details }
        : { error: "Invalid body" };
    return NextResponse.json(body, { status: 400 });
  }

  const { token, name, password } = parsed.data;
  const tokenHash = sha256Hex(token);

  const invite = await prisma.invite.findUnique({ where: { tokenHash } });
  if (!invite || invite.consumedAt || invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Prevent duplicate users
  const existing = await prisma.user.findUnique({
    where: { email: invite.email },
  });
  if (existing)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: invite.email,
        name,
        passwordHash,
        permissions: {
          create: invite.permissions.map((p) => ({ permission: p })),
        },
      },
      select: { id: true },
    });

    await tx.invite.update({
      where: { tokenHash },
      data: { consumedAt: new Date(), consumedById: created.id },
    });

    return created;
  });

  return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
}
