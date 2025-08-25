import { vi } from "vitest";

const randomToken = vi.fn(() => "FIXED_TOKEN");
const sha256Hex = vi.fn(() => "FIXED_HASH");

vi.mock("@/lib/tokens", () => ({
  randomToken: (...args: any[]) => randomToken(...args),
  sha256Hex: (...args: any[]) => sha256Hex(...args),
}));

export function setRandomToken(value: string) {
  randomToken.mockReturnValue(value);
}
export function setSha256(value: string) {
  sha256Hex.mockReturnValue(value);
}
export function resetTokenMocks() {
  randomToken.mockReset();
  sha256Hex.mockReset();
}
