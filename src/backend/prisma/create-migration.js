#!/usr/bin/env node
/**
 * Migration setup helper — ensures the Prisma migration file exists before
 * prisma migrate dev is run. This is idempotent: safe to call multiple times.
 *
 * Automatically invoked by: npm run db:migrate
 */

const fs = require('fs')
const path = require('path')

const migrationName = '20260319132310_add_offer_lifecycle_models'
const migrationsDir = path.join(__dirname, 'migrations', migrationName)
const migrationFile = path.join(migrationsDir, 'migration.sql')

const sql = `-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "branding" TEXT,
    "reportingPartition" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT,
    "offerType" TEXT NOT NULL,
    "discountValue" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "syndicatorRef" TEXT,
    "sponsorId" TEXT NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "expirationDate" DATETIME,
    "depletionLimit" INTEGER,
    "channels" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ruleType" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentRuleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rule_parentRuleId_fkey" FOREIGN KEY ("parentRuleId") REFERENCES "Rule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Purse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "purseType" TEXT NOT NULL,
    "productCategories" TEXT,
    "sponsorId" TEXT NOT NULL,
    "maxDiscountPerTransaction" REAL,
    "maxDiscountPerDay" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purse_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Syndicator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "clipSlaSeconds" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyndicatorEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "syndicatorId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payload" TEXT,
    "providerResponse" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SyndicatorEvent_syndicatorId_fkey" FOREIGN KEY ("syndicatorId") REFERENCES "Syndicator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SyndicatorEvent_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "offerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "redemptionCount" INTEGER NOT NULL DEFAULT 0,
    "maxRedemptions" INTEGER,
    "clippedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unclippedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Clip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Clip_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorId" TEXT,
    "beforeState" TEXT,
    "afterState" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Clip_userId_offerId_key" ON "Clip"("userId", "offerId");
`

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true })
  fs.writeFileSync(migrationFile, sql)
  console.log('✓ Migration file created:', migrationFile)
} else {
  console.log('✓ Migration directory already exists, skipping creation.')
}

