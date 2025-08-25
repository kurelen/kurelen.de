import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginRequest } from "@/lib/schemas";
import { issueSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = LoginRequest.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const { cookie } = await issueSession(user.id);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie.name, cookie.value, cookie.attrs);
    return res;
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
