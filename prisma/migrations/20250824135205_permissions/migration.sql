/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('ADMIN', 'RECEIPTS', 'FAMILYTREE');

-- AlterTable
ALTER TABLE "public"."Invite" ADD COLUMN     "permissions" "public"."Permission"[] DEFAULT ARRAY[]::"public"."Permission"[],
ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '30 days';

-- CreateTable
CREATE TABLE "public"."UserPermission" (
    "userId" TEXT NOT NULL,
    "permission" "public"."Permission" NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("userId","permission")
);

-- CreateIndex
CREATE INDEX "UserPermission_permission_idx" ON "public"."UserPermission"("permission");

-- AddForeignKey
ALTER TABLE "public"."UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "public"."Role";

