import { z } from "@/lib/zod";

export const RoleSchema = z.enum(["USER", "ADMIN"]);

export const UserPublic = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  role: RoleSchema,
  createdAt: z.string().datetime(),
});

export const ErrorResponse = z.object({
  error: z.string(),
});

export const InviteCreateRequest = z.object({
  email: z.string().email(),
});

export const InviteCreateResponse = z.object({
  inviteId: z.string().uuid(),
  inviteUrl: z.string().url(),
});
