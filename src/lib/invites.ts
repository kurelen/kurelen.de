import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/tokens";
import type { Invite, Prisma } from "@prisma/client";

type Ok = { ok: true; invite: Invite; tokenHash: string };
type Fail =
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "expired" }
  | { ok: false; reason: "consumed" };

export async function getInviteByRawToken(token: string): Promise<Ok | Fail> {
  const tokenHash = sha256Hex(token);
  const invite = await prisma.invite.findUnique({ where: { tokenHash } });
  if (!invite) return { ok: false, reason: "not_found" };
  if (invite.consumedAt) return { ok: false, reason: "consumed" };
  if (invite.expiresAt <= new Date()) return { ok: false, reason: "expired" };
  return { ok: true, invite, tokenHash };
}

export async function consumeInvite(
  tx: Prisma.TransactionClient | typeof prisma,
  tokenHash: string,
  userId: string
) {
  await tx.invite.update({
    where: { tokenHash },
    data: { consumedAt: new Date(), consumedById: userId },
  });
}
