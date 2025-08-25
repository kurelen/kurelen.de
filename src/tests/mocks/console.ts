import { vi } from "vitest";

export function muteConsoleError() {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  return () => spy.mockRestore();
}
