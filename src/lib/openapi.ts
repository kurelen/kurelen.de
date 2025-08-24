import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  InviteCreateRequest,
  InviteCreateResponse,
  UserPublic,
  ErrorResponse,
} from "@/lib/schemas";

const registry = new OpenAPIRegistry();
registry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "sid",
});

registry.register("User", UserPublic);
registry.register("Error", ErrorResponse);

registry.registerPath({
  method: "post",
  path: "/api/invites",
  description: "Create an invite link (valid for 3 days).",
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

export function getOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: { title: "Kurelen API", version: "0.1.0" },
    servers: [{ url: "http://localhost:3000" }],
    security: [{ cookieAuth: [] }],
    tags: [
      { name: "Invites" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Sessions" },
    ],
  });
}
