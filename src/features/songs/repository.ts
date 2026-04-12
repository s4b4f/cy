import type { Prisma, Song } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { SongListQuery, SongType } from "@/features/songs/types";

function containsInsensitive(value: string) {
  return { contains: value, mode: "insensitive" as const };
}

export async function findManySongs(query: SongListQuery) {
  const where: Prisma.SongWhereInput = {};

  if (query.type) where.type = query.type as SongType;
  if (query.name) where.name = containsInsensitive(query.name);
  if (query.teamName) where.teamName = containsInsensitive(query.teamName);
  if (query.playerName) where.playerName = containsInsensitive(query.playerName);
  if (query.customTypeName) where.customTypeName = containsInsensitive(query.customTypeName);

  const songs = await prisma.song.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  return songs;
}

export async function findSongById(id: string) {
  return prisma.song.findUnique({ where: { id } });
}

export async function createSong(data: Omit<Song, "id" | "createdAt" | "updatedAt">) {
  return prisma.song.create({ data });
}

export async function updateSong(id: string, data: Partial<Omit<Song, "id" | "createdAt" | "updatedAt">>) {
  return prisma.song.update({ where: { id }, data });
}

export async function deleteSong(id: string) {
  return prisma.song.delete({ where: { id } });
}

