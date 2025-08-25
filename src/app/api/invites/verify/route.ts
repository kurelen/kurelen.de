import { z } from "@/lib/zod";
import { json, jsonError } from "@/lib/api";
import { getInviteByRawToken } from "@/lib/invites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Query = z.object({ token: z.string().min(10) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success)
    return jsonError("Invalid or expired", 400, parsed.error.flatten());

  const result = await getInviteByRawToken(parsed.data.token);
  if (!result.ok) return jsonError("Invalid or expired", 400, result.reason);

  const { invite } = result;
  return json({
    ok: true as const,
    email: invite.email,
    expiresAt: invite.expiresAt.toISOString(),
    permissions: invite.permissions,
  });
}
