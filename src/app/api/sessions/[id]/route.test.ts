import { describe, it, expect } from "vitest";
import { prismaMock, setAuthUser, setAuthUserAdmin } from "@/tests/mocks";

function urlFor(id: string) {
  return `http://localhost:3000/api/sessions/${id}`;
}

describe("DELETE /api/sessions/[id]", () => {
  it("user can revoke own session", async () => {
    const prisma = prismaMock();
    setAuthUser({ id: "u1", email: "a@b.c", permissions: [] });

    prisma.session.findUnique.mockResolvedValue({
      id: "s1",
      userId: "u1",
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    } as any);

    prisma.session.update.mockResolvedValue({ id: "s1", revokedAt: new Date() } as any);
    prisma.session.updateMany.mockResolvedValue({ count: 1 } as any);

    const { DELETE } = await import("@/app/api/sessions/[id]/route");
    const res = await DELETE(new Request(urlFor("s1"), { method: "DELETE" }), { params: { id: "s1" } } as any);

    expect(res.status).toBeLessThan(300);
    expect(
      prisma.session.update.mock.calls.length + prisma.session.updateMany.mock.calls.length
    ).toBeGreaterThan(0);
  });

  it("admin can revoke any session", async () => {
    const prisma = prismaMock();
    setAuthUserAdmin();

    prisma.session.findUnique.mockResolvedValue({
      id: "s9",
      userId: "u2",
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    } as any);

    prisma.session.update.mockResolvedValue({ id: "s9", revokedAt: new Date() } as any);

    const { DELETE } = await import("@/app/api/sessions/[id]/route");
    const res = await DELETE(new Request(urlFor("s9"), { method: "DELETE" }), { params: { id: "s9" } } as any);

    expect(res.status).toBeLessThan(300);
    expect(prisma.session.update).toHaveBeenCalled();
  });
});
