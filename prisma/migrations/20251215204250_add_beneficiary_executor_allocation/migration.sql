/*
  Warnings:

  - The `type` column on the `Asset` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('BANK_ACCOUNT', 'PROPERTY', 'INVESTMENT', 'PENSION', 'VEHICLE', 'DIGITAL', 'CRYPTOCURRENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('RESIDUARY', 'SPECIFIC', 'CONTINGENT');

-- CreateEnum
CREATE TYPE "ExecutorRole" AS ENUM ('PRIMARY', 'CO_EXECUTOR', 'ALTERNATE');

-- CreateEnum
CREATE TYPE "ExecutorStatus" AS ENUM ('NOT_INVITED', 'INVITED', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "metadata" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "AssetType" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "Estate" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "type" "BeneficiaryType" NOT NULL DEFAULT 'RESIDUARY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Executor" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" "ExecutorRole" NOT NULL DEFAULT 'PRIMARY',
    "status" "ExecutorStatus" NOT NULL DEFAULT 'NOT_INVITED',
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Executor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_assetId_beneficiaryId_key" ON "Allocation"("assetId", "beneficiaryId");

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Executor" ADD CONSTRAINT "Executor_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
