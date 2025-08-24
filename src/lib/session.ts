import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";
import { sha256Hex, randomToken } from "./tokens";
import type { Permission, Session, User } from "@prisma/client";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "sid";
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 30);

export type AuthUser = User & { permissions: { permission: Permission }[] };

function cookieAttrs() {
  const secure = process.env.NODE_ENV !== "development";
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  };
}

export async function issueSession(userId: string) {
  const token = randomToken(32);
  const tokenHash = sha256Hex(token);
  const ua = headers().get("user-agent") || undefined;
  const ip =
    headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers().get("x-real-ip") ||
    undefined;

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

  // Set cookie
  const c = cookies();
  c.set(COOKIE_NAME, token, cookieAttrs());

  return { token, session };
}

export async function getAuthUser(): Promise<{
  user: AuthUser;
  session: Session;
} | null> {
  const c = cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = sha256Hex(token);
  const now = new Date();

  const sess = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: { permissions: true },
      },
    },
  });

  if (!sess || sess.revokedAt || sess.expiresAt <= now) return null;
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

export async function revokeCurrentSession() {
  const c = cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return;
  const tokenHash = sha256Hex(token);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  c.set(COOKIE_NAME, "", { ...cookieAttrs(), maxAge: 0 });
}
