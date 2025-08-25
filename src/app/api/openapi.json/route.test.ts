import { describe, it, expect } from "vitest";

type OpenAPIPartial = { openapi: string; paths: Record<string, unknown> };

describe("GET /api/openapi.json", () => {
  it("returns OpenAPI v3 spec with expected paths", async () => {
    const { GET } = await import("@/app/api/openapi.json/route");
    const res = await GET(
      new Request("http://localhost:3000/api/openapi.json")
    );
    expect(res.status).toBe(200);
    const spec = (await res.json()) as OpenAPIPartial;
    expect(spec.openapi).toMatch(/^3\./);
    expect(spec.paths["/api/invites"]).toBeDefined();
    expect(spec.paths["/api/invites/verify"]).toBeDefined();
    expect(spec.paths["/api/auth/register"]).toBeDefined();
  });
});

