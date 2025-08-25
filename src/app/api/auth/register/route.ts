import { prisma } from "@/lib/db";
import { json, jsonError, parseBody } from "@/lib/api";
import { getInviteByRawToken, consumeInvite } from "@/lib/invites";
import { RegisterRequest } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const parsed = await parseBody(req, RegisterRequest);
  if (!parsed.ok) return jsonError("Invalid body", 400, parsed.error.flatten());
  const { token, name, password } = parsed.data;

  const good = await getInviteByRawToken(token);
  if (!good.ok) return jsonError("Invalid or expired invite", 400, good.reason);
  const { invite, tokenHash } = good;

  const existing = await prisma.user.findUnique({
    where: { email: invite.email },
  });
  if (existing) return jsonError("User already exists", 400);

  const passwordHash = await bcrypt.hash(password, 12);

  const userId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: invite.email, name, passwordHash },
      select: { id: true },
    });

    if (invite.permissions.length) {
      await tx.userPermission.createMany({
        data: invite.permissions.map((p) => ({
          userId: user.id,
          permission: p,
        })),
        skipDuplicates: true,
      });
    }

    await consumeInvite(tx, tokenHash, user.id);
    return user.id;
  });

  return json({ ok: true as const, userId }, 201);
}
