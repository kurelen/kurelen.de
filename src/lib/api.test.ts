import { describe, it, expect } from "vitest";
import { json, jsonError, getOrigin, parseBody } from "@/lib/api";
import { z } from "@/lib/zod";

describe("lib/api", () => {
  it("json wraps status", async () => {
    const res = json({ ok: true as const }, 201);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("jsonError hides details in production", async () => {
    const OLD = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const res = jsonError("Bad", 400, { detail: "x" });
    expect(await res.json()).toEqual({ error: "Bad" });
    process.env.NODE_ENV = OLD;
  });

  it("getOrigin extracts origin", () => {
    const o = getOrigin(new Request("http://localhost:3000/api/foo"));
    expect(o).toBe("http://localhost:3000");
  });

  it("parseBody validates with zod", async () => {
    const schema = z.object({ a: z.number().int() });
    const good = await parseBody(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ a: 1 }),
      }),
      schema
    );
    const bad = await parseBody(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ a: "no" }),
      }),
      schema
    );
    expect(good.ok).toBe(true);
    if (!bad.ok) expect(bad.error.issues[0].path[0]).toBe("a");
  });
});
