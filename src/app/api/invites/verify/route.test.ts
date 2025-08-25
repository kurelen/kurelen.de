import { describe, it, expect } from "vitest";
import { prismaMock } from "@/tests/mocks";

describe("GET /api/invites/verify", () => {
  it("returns 400 when missing token", async () => {
    const { GET } = await import("@/app/api/invites/verify/route");
    const res = await GET(
      new Request("http://localhost:3000/api/invites/verify")
    );
    expect(res.status).toBe(400);
  });

  it("returns data for valid token", async () => {
    const prisma = prismaMock();
    prisma.invite.findUnique.mockResolvedValue({
      email: "t@kurelen.de",
      expiresAt: new Date(Date.now() + 60_000),
      consumedAt: null,
      permissions: ["RECEIPTS"],
    });

    const { GET } = await import("@/app/api/invites/verify/route");
    const res = await GET(
      new Request(
        "http://localhost:3000/api/invites/verify?token=VALIDTOKEN_01"
      )
    );
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.email).toBe("t@kurelen.de");
    expect(json.permissions).toEqual(["RECEIPTS"]);
  });
});
