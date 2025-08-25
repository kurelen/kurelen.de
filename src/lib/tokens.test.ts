import { describe, it, expect, vi } from "vitest";

describe("tokens", () => {
  it("sha256Hex hashes deterministically", async () => {
    vi.doUnmock("@/lib/tokens");
    const { sha256Hex } = await vi.importActual<typeof import("@/lib/tokens")>(
      "@/lib/tokens",
    );
    expect(sha256Hex("hello")).toBe(sha256Hex("hello"));
    expect(sha256Hex("hello")).not.toBe(sha256Hex("world"));
  });

  it("randomToken yields url-safe string", async () => {
    vi.doUnmock("@/lib/tokens");
    const { randomToken } = await vi.importActual<typeof import("@/lib/tokens")>(
      "@/lib/tokens",
    );
    const t = randomToken(32);
    expect(typeof t).toBe("string");
    expect(t).toMatch(/^[A-Za-z0-9\-_]+$/); // base64url
    expect(t.length).toBeGreaterThanOrEqual(32);
  });
});
