import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { user } = auth;
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    permissions: user.permissions.map((p) => p.permission),
  });
}
