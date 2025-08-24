import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { InviteCreateRequest } from "@/lib/schemas";
import { randomToken, sha256Hex } from "@/lib/tokens";
import { getAuthUser, userHasPermission } from "@/lib/session";
import { Permission } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!userHasPermission(auth.user, Permission.ADMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json().catch(() => null);
    const parsed = InviteCreateRequest.safeParse(json);
    if (!parsed.success) {
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          { error: "Invalid body", details: parsed.error.flatten() },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const { email, permissions } = parsed.data;

    const token = randomToken(32);
    const tokenHash = sha256Hex(token);

    const created = await prisma.invite.create({
      data: {
        email,
        tokenHash,
        permissions,
        invitedById: auth.user.id,
      },
      select: { id: true },
    });

    const origin = new URL(req.url).origin;
    const inviteUrl = `${origin}/register?token=${token}`;

    return NextResponse.json(
      { inviteId: created.id, inviteUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/invites error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
