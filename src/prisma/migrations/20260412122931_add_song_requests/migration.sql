-- CreateEnum
CREATE TYPE "SongRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SongRequest" (
    "id" TEXT NOT NULL,
    "requesterName" TEXT,
    "requestNote" TEXT,
    "name" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "playerName" TEXT,
    "type" "SongType" NOT NULL,
    "customTypeName" TEXT,
    "assetId" TEXT NOT NULL,
    "status" "SongRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SongRequest_status_createdAt_idx" ON "SongRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SongRequest_name_idx" ON "SongRequest"("name");

-- CreateIndex
CREATE INDEX "SongRequest_teamName_idx" ON "SongRequest"("teamName");

-- CreateIndex
CREATE INDEX "SongRequest_playerName_idx" ON "SongRequest"("playerName");

-- CreateIndex
CREATE INDEX "SongRequest_assetId_idx" ON "SongRequest"("assetId");
