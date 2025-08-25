import { vi } from "vitest";

const randomToken = vi.fn((_len?: number) => "FIXED_TOKEN");
const sha256Hex = vi.fn((_s: string) => "FIXED_HASH");

vi.mock("@/lib/tokens", () => ({
  randomToken: (len?: number) => randomToken(len),
  sha256Hex: (s: string) => sha256Hex(s),
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
