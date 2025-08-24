import crypto from "node:crypto";

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}
export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
