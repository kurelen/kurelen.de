import { vi } from "vitest";

// mock hashing so we don't care about real crypto
vi.mock("@/lib/tokens", () => ({
  sha256Hex: () => "HASHED",
}));

const findUnique = vi.fn();
vi.mock("@/lib/db", () => ({
  prisma: { invite: { findUnique } },
}));

describe("GET /api/invites/verify", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns 400 when missing token", async () => {
    const { GET } = await import("./route");
    const res = await GET(
      new Request("http://localhost:3000/api/invites/verify")
    );
    expect(res.status).toBe(400);
  });

  it("returns data for valid token", async () => {
    findUnique.mockResolvedValue({
      email: "t@kurelen.de",
      expiresAt: new Date(Date.now() + 1000 * 60),
      consumedAt: null,
      permissions: ["RECEIPTS"],
    });

    const { GET } = await import("./route");
    const res = await GET(
      new Request("http://localhost:3000/api/invites/verify?token=abc")
    );
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.email).toBe("t@kurelen.de");
    expect(json.permissions).toEqual(["RECEIPTS"]);
  });
});
