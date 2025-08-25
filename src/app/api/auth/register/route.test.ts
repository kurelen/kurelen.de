import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "@/tests/mocks";

type MockFn = ReturnType<typeof vi.fn>;
type Tx = {
  user: { create: MockFn };
  invite: { update: MockFn };
  userPermission: { createMany: MockFn };
};

// Mock bcrypt hashing
vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn(async () => "HASHED") },
  hash: vi.fn(async () => "HASHED"),
}));

describe("POST /api/auth/register", () => {
  it("rejects short password (400)", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token: "VALIDTOKEN_01",
        name: "A",
        password: "short",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates user and consumes invite (201)", async () => {
    const prisma = prismaMock();

    prisma.invite.findUnique.mockResolvedValue({
      email: "new@kurelen.de",
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      permissions: ["RECEIPTS"],
    });
    prisma.user.findUnique.mockResolvedValue(null);

    // Emulate Prisma $transaction client with required methods
    prisma.$transaction.mockImplementation(
      async (fn: (tx: TX) => Promise<unknown>) => {
        const tx: Tx = {
          user: { create: vi.fn().mockResolvedValue({ id: "u1" }) },
          invite: { update: vi.fn().mockResolvedValue({}) },
          userPermission: {
            createMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
        };
        const result = await fn(tx);
        // Optional: verify we did the right writes
        expect(tx.user.create).toHaveBeenCalledWith({
          data: {
            email: "new@kurelen.de",
            name: "Test User",
            passwordHash: "HASHED",
          },
          select: { id: true },
        });
        expect(tx.userPermission.createMany).toHaveBeenCalledWith({
          data: [{ userId: "u1", permission: "RECEIPTS" }],
          skipDuplicates: true,
        });
        expect(tx.invite.update).toHaveBeenCalledWith({
          where: { tokenHash: expect.any(String) },
          data: { consumedAt: expect.any(Date), consumedById: "u1" },
        });
        return result;
      }
    );

    const { POST } = await import("@/app/api/auth/register/route");
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
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.userId).toBe("u1");
  });
});
