-- AlterTable
ALTER TABLE "public"."Invite" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '3 days';

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '30 days';
