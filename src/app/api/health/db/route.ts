import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const users = await prisma.user.count();
    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }
}
