-- CreateEnum
CREATE TYPE "SongType" AS ENUM ('TEAM', 'PLAYER', 'CUSTOM');

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "playerName" TEXT,
    "type" "SongType" NOT NULL,
    "customTypeName" TEXT,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Song_type_createdAt_idx" ON "Song"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Song_name_idx" ON "Song"("name");

-- CreateIndex
CREATE INDEX "Song_teamName_idx" ON "Song"("teamName");

-- CreateIndex
CREATE INDEX "Song_playerName_idx" ON "Song"("playerName");

-- CreateIndex
CREATE INDEX "Song_customTypeName_idx" ON "Song"("customTypeName");

-- CreateIndex
CREATE INDEX "Song_createdAt_idx" ON "Song"("createdAt");
