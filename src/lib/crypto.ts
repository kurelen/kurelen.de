import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
export function sha256(input: string) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
