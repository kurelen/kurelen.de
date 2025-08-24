import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { InviteCreateRequest } from "@/lib/schemas";
import { randomToken, sha256Hex } from "@/lib/tokens";

export async function POST(req: Request) {
  // TEMP auth: allow only in dev until sessions are done
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Auth not implemented yet" },
      { status: 401 }
    );
  }

  const json = await req.json().catch(() => null);
  const parse = InviteCreateRequest.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { email, permissions } = parse.data;

  const token = randomToken(32);
  const tokenHash = sha256Hex(token);

  const invite = await prisma.invite.create({
    data: { email, tokenHash, permissions },
    select: { id: true },
  });

  const origin = new URL(req.url).origin;
  const inviteUrl = `${origin}/register?token=${token}`;
  return NextResponse.json({ inviteId: invite.id, inviteUrl }, { status: 201 });
}
