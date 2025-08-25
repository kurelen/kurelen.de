import { describe, it, expect } from "vitest";

describe("GET /api/openapi.json", () => {
  it("returns OpenAPI v3 spec with expected paths", async () => {
    const { GET } = await import("@/app/api/openapi.json/route");
    const res = await GET(new Request("http://localhost:3000/api/openapi.json"));
    expect(res.status).toBe(200);
    const spec: any = await res.json();
    expect(spec.openapi).toMatch(/^3\./);
    // Check a couple of key paths exist
    expect(spec.paths["/api/invites"]).toBeDefined();
    expect(spec.paths["/api/invites/verify"]).toBeDefined();
    expect(spec.paths["/api/auth/register"]).toBeDefined();
  });
});
