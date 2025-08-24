import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  InviteCreateRequest,
  InviteCreateResponse,
  InviteVerifyResponse,
  RegisterRequest,
  RegisterResponse,
  ErrorResponse,
} from "@/lib/schemas";

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: "post",
  path: "/api/invites",
  tags: ["Invites"],
  security: [{ cookieAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: InviteCreateRequest } } },
  },
  responses: {
    201: {
      description: "Invite created",
      content: { "application/json": { schema: InviteCreateResponse } },
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

registry.registerPath({
  method: "get",
  path: "/api/invites/verify",
  tags: ["Invites"],
  request: { query: { token: { type: "string" } } },
  responses: {
    200: {
      description: "Valid",
      content: { "application/json": { schema: InviteVerifyResponse } },
    },
    400: {
      description: "Invalid",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
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

export function getOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: { title: "Kurelen API", version: "0.2.0" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "sid" },
      },
    },
    tags: [
      { name: "Invites" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Sessions" },
    ],
    security: [{ cookieAuth: [] }],
  });
}
