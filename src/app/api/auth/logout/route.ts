import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await revokeCurrentSession();
  return NextResponse.json({ ok: true });
}
