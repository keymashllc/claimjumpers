-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "hp" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DayState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "due" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "shiftsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayState_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StashItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "metalType" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StashItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specimen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT,
    "metalType" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "biome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Specimen_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VaultSpecimen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "metalType" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "biome" TEXT NOT NULL,
    "depositedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalSpecimenId" TEXT,
    CONSTRAINT "VaultSpecimen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VaultBalance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "solUnits" INTEGER NOT NULL DEFAULT 0,
    "aesUnits" INTEGER NOT NULL DEFAULT 0,
    "virUnits" INTEGER NOT NULL DEFAULT 0,
    "lunUnits" INTEGER NOT NULL DEFAULT 0,
    "nocUnits" INTEGER NOT NULL DEFAULT 0,
    "crnUnits" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VaultBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "vaultSpecimenId" TEXT,
    "filledAt" DATETIME,
    CONSTRAINT "JournalSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JournalSlot_vaultSpecimenId_fkey" FOREIGN KEY ("vaultSpecimenId") REFERENCES "VaultSpecimen" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketPriceSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectorId" TEXT NOT NULL,
    "metalType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MarketPriceSnapshot_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpecimenListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "vaultSpecimenId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "listedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soldAt" DATETIME,
    "cancelledAt" DATETIME,
    CONSTRAINT "SpecimenListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SpecimenListing_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SpecimenListing_vaultSpecimenId_fkey" FOREIGN KEY ("vaultSpecimenId") REFERENCES "VaultSpecimen" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OwnedRelic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT,
    "userId" TEXT,
    "relicType" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OwnedRelic_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OwnedRelic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE INDEX "MarketPriceSnapshot_sectorId_metalType_timestamp_idx" ON "MarketPriceSnapshot"("sectorId", "metalType", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "SpecimenListing_vaultSpecimenId_key" ON "SpecimenListing"("vaultSpecimenId");
