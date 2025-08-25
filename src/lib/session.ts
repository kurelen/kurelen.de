import { headers, cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { sha256Hex, randomToken } from "./tokens";
import type { Permission, Session, User } from "@prisma/client";

export const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "sid";
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 30);

export type AuthUser = User & { permissions: { permission: Permission }[] };

export function cookieAttrs() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  };
}

/**
 * Create a DB session and return the raw token and cookie metadata.
 * The caller (route) is responsible for setting the cookie on the response.
 */
export async function issueSession(userId: string) {
  const h = await headers();
  const ua = h.get("user-agent") || undefined;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    undefined;

  const token = randomToken(32);
  const tokenHash = sha256Hex(token);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: ua?.slice(0, 255),
      ip: ip?.slice(0, 45),
      expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 86400_000),
    },
    select: { id: true, userId: true, expiresAt: true },
  });

  return {
    token,
    session,
    cookie: { name: COOKIE_NAME, value: token, attrs: cookieAttrs() },
  };
}

async function getSessionTokenFromRequest() {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getAuthUser(): Promise<{
  user: AuthUser;
  session: Session;
} | null> {
  const token = await getSessionTokenFromRequest();
  if (!token) return null;

  const tokenHash = sha256Hex(token);
  const now = new Date();

  const sess = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: { include: { permissions: true } } },
  });

  if (!sess || sess.revokedAt || sess.expiresAt <= now) {
    if (process.env.NODE_ENV === "production") {
      const jitter = 300 + Math.floor(Math.random() * 900);
      await sleep(jitter);
    }
    return null;
  }
  return { user: sess.user as AuthUser, session: sess };
}

export async function requireAuth(): Promise<{
  user: AuthUser;
  session: Session;
}> {
  const auth = await getAuthUser();
  if (!auth) throw new Error("AUTH_REQUIRED");
  return auth;
}

export function userHasPermission(u: AuthUser, perm: Permission) {
  return u.permissions.some((p) => p.permission === perm);
}

export async function requirePermission(perm: Permission) {
  const { user, session } = await requireAuth();
  if (!userHasPermission(user, perm)) throw new Error("FORBIDDEN");
  return { user, session };
}

/** Revoke the current session in DB. The caller should clear the cookie in the response. */
export async function revokeCurrentSession() {
  const token = await getSessionTokenFromRequest();
  if (!token) return;
  const tokenHash = sha256Hex(token);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
