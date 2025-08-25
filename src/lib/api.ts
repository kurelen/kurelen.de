import { NextResponse } from "next/server";
import type { z } from "@/lib/zod";

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  const body =
    process.env.NODE_ENV !== "production" && details
      ? { error: message, details }
      : { error: message };
  return NextResponse.json(body, { status });
}

export async function parseBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; error: z.ZodError }> {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  return parsed.success
    ? { ok: true, data: parsed.data }
    : { ok: false, error: parsed.error };
}

export function getOrigin(req: Request) {
  return new URL(req.url).origin;
}
