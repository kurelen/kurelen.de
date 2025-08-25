import { vi } from "vitest";

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn(async () => "HASHED") },
  hash: vi.fn(async () => "HASHED"),
}));
vi.mock("@/lib/tokens", () => ({ sha256Hex: () => "INV_HASH" }));

const prismaMock = {
  invite: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() },
  $transaction: vi.fn(),
};
vi.mock("@/lib/db", () => ({ prisma: prismaMock }));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects short password (400)", async () => {
    const { POST } = await import("./route");
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token: "VALIDTOKEN_01",
        name: "A",
        password: "short",
      }), // < 8 chars
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates user and consumes invite (201)", async () => {
    prismaMock.invite.findUnique.mockResolvedValue({
      email: "new@kurelen.de",
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      permissions: ["RECEIPTS"],
    });
    prismaMock.user.findUnique.mockResolvedValue(null);

    // emulate $transaction callback API
    prismaMock.$transaction.mockImplementation(async (fn: any) => {
      const tx = {
        user: { create: vi.fn().mockResolvedValue({ id: "u1" }) },
        invite: { update: vi.fn().mockResolvedValue({}) },
      };
      const created = await fn(tx);
      expect(tx.user.create).toHaveBeenCalled();
      expect(tx.invite.update).toHaveBeenCalledWith({
        where: { tokenHash: "INV_HASH" },
        data: { consumedAt: expect.any(Date), consumedById: "u1" },
      });
      return created;
    });

    const { POST } = await import("./route");
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token: "VALIDTOKEN_02",
        name: "Test User",
        password: "S3cure!pass",
      }),
    });
    const res = await POST(req);
    const json: any = await res.json();
    expect(res.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.userId).toBe("u1");
  });
});
