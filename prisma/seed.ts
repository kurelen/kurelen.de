import "dotenv/config";
import { PrismaClient, Permission } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "kurelen@pm.me";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const rawPassword = crypto.randomBytes(18).toString("base64url");
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      permissions: { create: [{ permission: Permission.ADMIN }] },
    },
  });

  console.log("========================================");
  console.log(" Admin user created");
  console.log(`   email:    ${email}`);
  console.log(`   password: ${rawPassword}`);
  console.log(" (store this somewhere safe, then change it later)");
  console.log("========================================");
}

main().finally(() => prisma.$disconnect());
