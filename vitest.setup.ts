import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { resetPrismaMock } from "@/tests/mocks/prisma";
import { resetSessionMocks } from "@/tests/mocks/session";
import { resetTokenMocks } from "@/tests/mocks/tokens";
import { resetNextHeaders } from "@/tests/mocks/next";

afterEach(() => {
  resetPrismaMock();
  resetSessionMocks();
  resetTokenMocks();
  resetNextHeaders();
});
