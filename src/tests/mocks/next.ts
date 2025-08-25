import { vi } from "vitest";

let _headers = new Map<string, string>();
let _cookies: Record<string, { name: string; value: string }> = {};

vi.mock("next/headers", () => ({
  headers: async () =>
    ({
      get: (k: string) => _headers.get(k) ?? null,
    }) as unknown,
  cookies: async () =>
    ({
      get: (name: string) => _cookies[name],
    }) as unknown,
}));

export function resetNextHeaders() {
  _headers = new Map();
  _cookies = {};
}
export function setHeader(k: string, v: string) {
  _headers.set(k.toLowerCase(), v);
}
export function setRequestCookie(name: string, value: string) {
  _cookies[name] = { name, value };
}
