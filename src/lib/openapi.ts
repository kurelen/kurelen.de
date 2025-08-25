import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/zod";
import {
  UserPublic,
  ErrorResponse,
  InviteCreateRequest,
  InviteCreateResponse,
  InviteVerifyResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  OkResponse,
  MeResponse,
  SessionPublic,
} from "@/lib/schemas";

export function getOpenAPIDocument() {
  const registry = new OpenAPIRegistry();

  // Security scheme: cookie-based session
  registry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "sid",
  });

  // Components
  registry.register("User", UserPublic);
  registry.register("Error", ErrorResponse);
  registry.register("Session", SessionPublic);

  // ---------------- Invites ----------------

  // POST /api/invites  (ADMIN required)
  registry.registerPath({
    method: "post",
    path: "/api/invites",
    tags: ["Invites"],
    description: "Create an invite link (valid for 3 days) to onboard a user.",
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: { "application/json": { schema: InviteCreateRequest } },
      },
    },
    responses: {
      201: {
        description: "Invite created",
        content: { "application/json": { schema: InviteCreateResponse } },
      },
      400: {
        description: "Invalid input",
        content: { "application/json": { schema: ErrorResponse } },
      },
      401: {
        description: "Not authenticated",
        content: { "application/json": { schema: ErrorResponse } },
      },
      403: {
        description: "Forbidden",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // GET /api/invites/verify?token=...
  registry.registerPath({
    method: "get",
    path: "/api/invites/verify",
    tags: ["Invites"],
    description:
      "Verify an invite token and return email, expiry and permissions.",
    request: { query: z.object({ token: z.string().min(10) }) },
    responses: {
      200: {
        description: "Valid",
        content: { "application/json": { schema: InviteVerifyResponse } },
      },
      400: {
        description: "Invalid/expired",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // ---------------- Auth ----------------

  // POST /api/auth/register
  registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    tags: ["Auth"],
    description:
      "Complete registration with an invite token, name and password.",
    request: {
      body: { content: { "application/json": { schema: RegisterRequest } } },
    },
    responses: {
      201: {
        description: "Registered",
        content: { "application/json": { schema: RegisterResponse } },
      },
      400: {
        description: "Invalid",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // POST /api/auth/login
  registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    description: "Login with email and password; sets a session cookie.",
    request: {
      body: { content: { "application/json": { schema: LoginRequest } } },
    },
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: LoginResponse } },
      },
      400: {
        description: "Invalid body",
        content: { "application/json": { schema: ErrorResponse } },
      },
      401: {
        description: "Invalid credentials",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // POST /api/auth/logout
  registry.registerPath({
    method: "post",
    path: "/api/auth/logout",
    tags: ["Auth"],
    description: "Logout current session (revokes it) and clears cookie.",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: OkResponse } },
      },
      401: {
        description: "Not authenticated",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // GET /api/me
  registry.registerPath({
    method: "get",
    path: "/api/me",
    tags: ["Auth"],
    description: "Return the current authenticated user.",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: MeResponse } },
      },
      401: {
        description: "Not authenticated",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // ---------------- Sessions ----------------

  // GET /api/sessions
  registry.registerPath({
    method: "get",
    path: "/api/sessions",
    tags: ["Sessions"],
    description: "List active and revoked sessions for the current user.",
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: "OK",
        content: { "application/json": { schema: z.array(SessionPublic) } },
      },
      401: {
        description: "Not authenticated",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // DELETE /api/sessions/{id}
  registry.registerPath({
    method: "delete",
    path: "/api/sessions/{id}",
    tags: ["Sessions"],
    description:
      "Revoke a session by id. You can revoke your own sessions; admins can revoke any user's session.",
    security: [{ cookieAuth: [] }],
    request: {
      params: z.object({ id: z.string().uuid() }),
    },
    responses: {
      200: {
        description: "Revoked",
        content: { "application/json": { schema: OkResponse } },
      },
      401: {
        description: "Not authenticated",
        content: { "application/json": { schema: ErrorResponse } },
      },
      403: {
        description: "Forbidden",
        content: { "application/json": { schema: ErrorResponse } },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: ErrorResponse } },
      },
    },
  });

  // ---- Generate ----
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "Kurelen API",
      version: "0.3.0",
      description:
        "Private API for invite-only onboarding, email/password auth, sessions, permissions, and admin invite issuance.",
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [
      { name: "Auth" },
      { name: "Invites" },
      { name: "Sessions" },
      { name: "Users" },
    ],
    security: [{ cookieAuth: [] }],
  });
}
