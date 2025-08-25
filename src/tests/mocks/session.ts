import { vi } from "vitest";

type MockUser = { id: string; email: string; permissions: { permission: string }[] };

const getAuthUser = vi.fn();
const userHasPermission = vi.fn();

export const COOKIE_NAME = "sid";
export const cookieAttrs = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
  maxAge: 60,
});

vi.mock("@/lib/session", () => ({
  getAuthUser,
  userHasPermission,
  COOKIE_NAME,
  cookieAttrs,
}));

export function setAuthUser(user: MockUser | null) {
  getAuthUser.mockResolvedValue(
    user ? { user, session: { id: "sess1" } } : null
  );
}

export function setAuthUserAdmin() {
  setAuthUser({
    id: "u1",
    email: "admin@kurelen.de",
    permissions: [{ permission: "ADMIN" }],
  });
  userHasPermission.mockReturnValue(true);
}

export function setAuthUserNone() {
  setAuthUser(null);
  userHasPermission.mockReturnValue(false);
}

export function resetSessionMocks() {
  getAuthUser.mockReset();
  userHasPermission.mockReset();
}
