-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('SOL', 'AES', 'VIR', 'LUN', 'NOC', 'CRN');

-- CreateEnum
CREATE TYPE "Biome" AS ENUM ('Desert', 'Rift', 'Glacier');

-- CreateEnum
CREATE TYPE "SpecimenForm" AS ENUM ('Ore', 'Nugget', 'Coin', 'Bar');

-- CreateEnum
CREATE TYPE "SpecimenGrade" AS ENUM ('Low', 'High', 'Ultra');

-- CreateEnum
CREATE TYPE "RelicType" AS ENUM ('LoanVoucher', 'DamageShield', 'CreditBoost', 'SpecimenBoost', 'RepairDiscount', 'ExtraShift', 'LuckyVein', 'MarketInsight', 'VaultExpansion', 'TimeExtension');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('Active', 'Won', 'Lost');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'Active',
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "hp" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayState" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "due" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "shiftsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StashItem" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "units" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StashItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specimen" (
    "id" TEXT NOT NULL,
    "runId" TEXT,
    "metalType" "MetalType" NOT NULL,
    "form" "SpecimenForm" NOT NULL,
    "grade" "SpecimenGrade" NOT NULL,
    "biome" "Biome" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Specimen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultSpecimen" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "form" "SpecimenForm" NOT NULL,
    "grade" "SpecimenGrade" NOT NULL,
    "biome" "Biome" NOT NULL,
    "depositedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalSpecimenId" TEXT,

    CONSTRAINT "VaultSpecimen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "solUnits" INTEGER NOT NULL DEFAULT 0,
    "aesUnits" INTEGER NOT NULL DEFAULT 0,
    "virUnits" INTEGER NOT NULL DEFAULT 0,
    "lunUnits" INTEGER NOT NULL DEFAULT 0,
    "nocUnits" INTEGER NOT NULL DEFAULT 0,
    "crnUnits" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaultBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "vaultSpecimenId" TEXT,
    "filledAt" TIMESTAMP(3),

    CONSTRAINT "JournalSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPriceSnapshot" (
    "id" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecimenListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "vaultSpecimenId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "listedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soldAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "SpecimenListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnedRelic" (
    "id" TEXT NOT NULL,
    "runId" TEXT,
    "userId" TEXT,
    "relicType" "RelicType" NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnedRelic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DayState_runId_day_key" ON "DayState"("runId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "VaultBalance_userId_key" ON "VaultBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecimenListing_vaultSpecimenId_key" ON "SpecimenListing"("vaultSpecimenId");

-- CreateIndex
CREATE INDEX "MarketPriceSnapshot_sectorId_metalType_timestamp_idx" ON "MarketPriceSnapshot"("sectorId", "metalType", "timestamp");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayState" ADD CONSTRAINT "DayState_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StashItem" ADD CONSTRAINT "StashItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specimen" ADD CONSTRAINT "Specimen_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaultSpecimen" ADD CONSTRAINT "VaultSpecimen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalSlot" ADD CONSTRAINT "JournalSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalSlot" ADD CONSTRAINT "JournalSlot_vaultSpecimenId_fkey" FOREIGN KEY ("vaultSpecimenId") REFERENCES "VaultSpecimen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPriceSnapshot" ADD CONSTRAINT "MarketPriceSnapshot_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecimenListing" ADD CONSTRAINT "SpecimenListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecimenListing" ADD CONSTRAINT "SpecimenListing_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecimenListing" ADD CONSTRAINT "SpecimenListing_vaultSpecimenId_fkey" FOREIGN KEY ("vaultSpecimenId") REFERENCES "VaultSpecimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedRelic" ADD CONSTRAINT "OwnedRelic_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedRelic" ADD CONSTRAINT "OwnedRelic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

