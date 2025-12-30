-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;
