import { describe, it, expect } from "vitest";
import { setAuthUser, setAuthUserNone } from "@/tests/mocks";

describe("GET /api/me", () => {
  it("401 when not authenticated", async () => {
    setAuthUserNone();
    const { GET } = await import("@/app/api/me/route");
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns current user when authenticated", async () => {
    setAuthUser({
      id: "u1",
      email: "u@kurelen.de",
      permissions: [{ permission: "ADMIN" }],
    });
    const { GET } = await import("@/app/api/me/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      id: string;
      email: string;
      permissions: { permission: string }[];
    };
    expect(json).toMatchObject({
      email: "u@kurelen.de",
      permissions: ["ADMIN"],
    });
  });
});
