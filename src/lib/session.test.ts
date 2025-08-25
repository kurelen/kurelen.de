import { describe, it, expect, vi } from "vitest";
import { prismaMock, setRequestCookie } from "@/tests/mocks";

describe("session.getAuthUser", () => {
  it("returns null if session invalid/expired", async () => {
    vi.doUnmock("@/lib/session");
    const { getAuthUser } = await vi.importActual<typeof import("@/lib/session")>(
      "@/lib/session",
    );

    const prisma = prismaMock();
    prisma.session.findUnique.mockResolvedValue(null);

    setRequestCookie("sid", "rawtoken");

    const auth = await getAuthUser();
    expect(auth).toBeNull();
  });

  it("returns user if session exists and not expired/revoked", async () => {
    vi.doUnmock("@/lib/session");
    const { getAuthUser } = await vi.importActual<typeof import("@/lib/session")>(
      "@/lib/session",
    );

    const prisma = prismaMock();
    prisma.session.findUnique.mockResolvedValue({
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: { id: "u1", email: "a@b.c", permissions: [{ permission: "ADMIN" }] },
    });

    setRequestCookie("sid", "rawtoken");

    const auth = await getAuthUser();
    expect(auth?.user.email).toBe("a@b.c");
    expect(auth?.user.permissions[0].permission).toBe("ADMIN");
  });
});
