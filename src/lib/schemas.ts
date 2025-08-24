import { z } from "@/lib/zod";

export const PermissionEnum = z.enum(["ADMIN", "RECEIPTS", "FAMILYTREE"]);

export const UserPublic = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  // Present permissions as string[]
  permissions: z.array(PermissionEnum),
});

export const ErrorResponse = z.object({ error: z.string() });

// Allow optional permissions when issuing an invite
export const InviteCreateRequest = z.object({
  email: z.string().email(),
  permissions: z.array(PermissionEnum).optional().default([]),
});
export const InviteCreateResponse = z.object({
  inviteId: z.string().uuid(),
  inviteUrl: z.string().url(),
});

// Verify invite
export const InviteVerifyResponse = z.object({
  ok: z.literal(true),
  email: z.string().email(),
  expiresAt: z.string().datetime(),
  permissions: z.array(PermissionEnum),
});

// Register with invite
export const RegisterRequest = z.object({
  token: z.string().min(10),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(200),
});
export const RegisterResponse = z.object({
  ok: z.literal(true),
  userId: z.string().uuid(),
});
