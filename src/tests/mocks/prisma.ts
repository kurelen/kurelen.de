import { vi } from "vitest";

type Fn = ReturnType<typeof vi.fn>;

type PrismaMock = {
  user: {
    findUnique: Fn;
    create: Fn;
    findMany: Fn;
    count: Fn;
  };
  invite: {
    create: Fn;
    findUnique: Fn;
    update: Fn;
    findMany: Fn;
  };
  session: {
    findUnique: Fn;
    findMany: Fn;
    create: Fn;
    update: Fn;
    updateMany: Fn;
  };
  $transaction: Fn;
};

const prisma: PrismaMock = {
  user: { findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
  invite: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  session: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("@/lib/db", () => ({ prisma }));

export function prismaMock() {
  return prisma;
}

export function resetPrismaMock() {
  prisma.user.findUnique.mockReset();
  prisma.user.create.mockReset();
  prisma.user.findMany.mockReset();
  prisma.user.count.mockReset();
  prisma.invite.create.mockReset();
  prisma.invite.findUnique.mockReset();
  prisma.invite.update.mockReset();
  prisma.invite.findMany.mockReset();
  prisma.session.findUnique.mockReset();
  prisma.session.findMany.mockReset();
  prisma.session.create.mockReset();
  prisma.session.update.mockReset();
  prisma.session.updateMany.mockReset();
  prisma.$transaction.mockReset();
}
