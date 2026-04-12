import type { Prisma, SongRequest } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { RequestStatus, SongRequestListQuery } from "@/features/requests/types";

export async function findManySongRequests(query: SongRequestListQuery) {
  const where: Prisma.SongRequestWhereInput = {};

  if (query.status) {
    where.status = query.status as RequestStatus;
  }

  return prisma.songRequest.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
}

export async function findSongRequestById(id: string) {
  return prisma.songRequest.findUnique({ where: { id } });
}

export async function createSongRequest(data: Omit<SongRequest, "id" | "createdAt" | "updatedAt" | "reviewedAt">) {
  return prisma.songRequest.create({ data });
}

export async function approveSongRequest(id: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.songRequest.findUnique({ where: { id } });
    if (!request) return null;

    const song = await tx.song.create({
      data: {
        name: request.name,
        teamName: request.teamName,
        playerName: request.playerName,
        type: request.type,
        customTypeName: request.customTypeName,
        assetId: request.assetId
      }
    });

    const updatedRequest = await tx.songRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        rejectionReason: null,
        reviewedAt: new Date()
      }
    });

    return { request: updatedRequest, song };
  });
}

export async function rejectSongRequest(id: string, rejectionReason: string) {
  return prisma.songRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason,
      reviewedAt: new Date()
    }
  });
}

