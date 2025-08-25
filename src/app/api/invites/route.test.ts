import { describe, it, expect } from "vitest";
import {
  prismaMock,
  setAuthUserNone,
  setAuthUserAdmin,
  setRandomToken,
  setSha256,
  jsonRequest,
  readJson,
  muteConsoleError,
} from "@/tests/mocks";

describe("POST /api/invites", () => {
  it("returns 401 if not authenticated", async () => {
    setAuthUserNone();

    const { POST } = await import("@/app/api/invites/route");
    const req = jsonRequest("http://localhost:3000/api/invites", "POST", {
      email: "test@example.com",
      permissions: [],
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates invite when ADMIN", async () => {
    setAuthUserAdmin();
    setRandomToken("FIXED_TOKEN");
    setSha256("FIXED_HASH");

    const prisma = prismaMock();
    prisma.invite.create.mockResolvedValue({ id: "inv1" });

    const { POST } = await import("@/app/api/invites/route");
    const req = jsonRequest("http://localhost:3000/api/invites", "POST", {
      email: "test@example.com",
      permissions: ["RECEIPTS"],
    });

    const res = await POST(req);
    const json = await readJson<{ inviteUrl: string }>(res);

    expect(res.status).toBe(201);
    expect(prisma.invite.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        tokenHash: "FIXED_HASH",
        permissions: ["RECEIPTS"],
        invitedById: "u1",
      },
      select: { id: true },
    });
    expect(json.inviteUrl).toContain("token=FIXED_TOKEN");
  });

  it("500 when DB create fails", async () => {
    const restore = muteConsoleError();
    setAuthUserAdmin();
    const prisma = prismaMock();
    prisma.invite.create.mockRejectedValue(new Error("boom"));

    const { POST } = await import("@/app/api/invites/route");
    const req = jsonRequest("http://localhost:3000/api/invites", "POST", {
      email: "err@example.com",
      permissions: [],
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    restore();
  });
});
