import { NextResponse } from "next/server";
import { revokeCurrentSession, COOKIE_NAME, cookieAttrs } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await revokeCurrentSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { ...cookieAttrs(), maxAge: 0 });
  return res;
}
