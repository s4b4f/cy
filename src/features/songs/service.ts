import { ZodError } from "zod";

import { songListQuerySchema, songUpsertSchema, type SongUpsertOutput } from "@/features/songs/schemas";
import type { SongDto, SongListQuery, SongRecord } from "@/features/songs/types";
import * as repo from "@/features/songs/repository";

export class SongValidationError extends Error {
  constructor(public readonly cause: ZodError) {
    super("입력값이 올바르지 않습니다.");
    this.name = "SongValidationError";
  }
}

export class SongNotFoundError extends Error {
  constructor() {
    super("응원가를 찾을 수 없습니다.");
    this.name = "SongNotFoundError";
  }
}

function coerceFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSongListSearchParams(searchParams: Record<string, string | string[] | undefined>): SongListQuery {
  const rawType = coerceFirst(searchParams.type);
  const query = {
    name: coerceFirst(searchParams.name),
    teamName: coerceFirst(searchParams.teamName),
    playerName: coerceFirst(searchParams.playerName),
    customTypeName: coerceFirst(searchParams.customTypeName),
    type: rawType && rawType.trim().length > 0 ? rawType.trim() : undefined
  };
  const parsed = songListQuerySchema.safeParse(query);
  if (!parsed.success) throw new SongValidationError(parsed.error);
  return parsed.data;
}

export function parseSongListUrlSearchParams(params: URLSearchParams): SongListQuery {
  const rawType = params.get("type") ?? undefined;
  const parsed = songListQuerySchema.safeParse({
    name: params.get("name") ?? undefined,
    teamName: params.get("teamName") ?? undefined,
    playerName: params.get("playerName") ?? undefined,
    customTypeName: params.get("customTypeName") ?? undefined,
    type: rawType && rawType.trim().length > 0 ? rawType.trim() : undefined
  });
  if (!parsed.success) throw new SongValidationError(parsed.error);
  return parsed.data;
}

function normalizeForDb(input: SongUpsertOutput) {
  return {
    name: input.name,
    teamName: input.teamName,
    playerName: input.playerName ?? null,
    type: input.type,
    customTypeName: input.type === "CUSTOM" ? (input.customTypeName ?? null) : null,
    assetId: input.assetId
  };
}

export async function listSongs(query: SongListQuery) {
  return repo.findManySongs(query);
}

export async function getSong(id: string) {
  return repo.findSongById(id);
}

export async function getSongOrThrow(id: string) {
  const song = await repo.findSongById(id);
  if (!song) throw new SongNotFoundError();
  return song;
}

export async function createSong(input: unknown) {
  const parsed = songUpsertSchema.safeParse(input);
  if (!parsed.success) throw new SongValidationError(parsed.error);
  return repo.createSong(normalizeForDb(parsed.data));
}

export async function updateSong(id: string, input: unknown) {
  const parsed = songUpsertSchema.safeParse(input);
  if (!parsed.success) throw new SongValidationError(parsed.error);

  const existing = await repo.findSongById(id);
  if (!existing) throw new SongNotFoundError();

  return repo.updateSong(id, normalizeForDb(parsed.data));
}

export async function removeSong(id: string) {
  const existing = await repo.findSongById(id);
  if (!existing) throw new SongNotFoundError();
  return repo.deleteSong(id);
}

export function toSongDto(song: SongRecord): SongDto {
  return {
    ...song,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString()
  };
}

export function toSongDtoList(songs: SongRecord[]): SongDto[] {
  return songs.map(toSongDto);
}
