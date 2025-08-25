import { describe, it, expect } from "vitest";
import { prismaMock, muteConsoleError } from "@/tests/mocks";

type HealthOk = { ok: true; users: number };

describe("GET /api/health/db", () => {
  it("returns ok with user count", async () => {
    const prisma = prismaMock();
    prisma.user.count.mockResolvedValue(3);

    const { GET } = await import("@/app/api/health/db/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json() as HealthOk;
    expect(json).toEqual({ ok: true, users: 3 });
  });

  it("returns 500 on DB error", async () => {
    const restore = muteConsoleError();
    const prisma = prismaMock();
    prisma.user.count.mockRejectedValue(new Error("boom"));

    const { GET } = await import("@/app/api/health/db/route");
    const res = await GET();
    expect(res.status).toBe(500);

    restore();
  });
});
