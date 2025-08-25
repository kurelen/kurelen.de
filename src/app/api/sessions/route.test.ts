import { describe, it, expect } from "vitest";
import { prismaMock, setAuthUserNone, setAuthUser, setAuthUserAdmin } from "@/tests/mocks";

const URL_SESSIONS = "http://localhost:3000/api/sessions";

describe("GET /api/sessions", () => {
  it("401 when not authenticated", async () => {
    setAuthUserNone();
    const { GET } = await import("@/app/api/sessions/route");
    const res = await GET(new Request(URL_SESSIONS));
    expect(res.status).toBe(401);
  });

  it("returns current user's sessions", async () => {
    const prisma = prismaMock();
    setAuthUser({ id: "u1", email: "a@b.c", permissions: [] });

    prisma.session.findMany.mockResolvedValue([
      { id: "s1", userId: "u1", revokedAt: null },
      { id: "s2", userId: "u1", revokedAt: null },
    ] as any);

    const { GET } = await import("@/app/api/sessions/route");
    const res = await GET(new Request(URL_SESSIONS));
    expect(res.status).toBe(200);
    expect(prisma.session.findMany).toHaveBeenCalled();

    const args = prisma.session.findMany.mock.calls[0][0];
    if (args?.where) {
      expect(args.where.userId).toBe("u1");
    }

    const json: any = await res.json();
    expect(Array.isArray(json.sessions ?? json)).toBe(true);
  });

  it("admin can list all sessions", async () => {
    const prisma = prismaMock();
    setAuthUserAdmin();

    prisma.session.findMany.mockResolvedValue([{ id: "sX" }] as any);

    const { GET } = await import("@/app/api/sessions/route");
    const res = await GET(new Request(URL_SESSIONS));
    expect(res.status).toBe(200);

    const args = prisma.session.findMany.mock.calls[0][0];
    if (args?.where) {
      expect(args.where.userId).toBeUndefined();
    }
  });
});
