import type { Song } from "@prisma/client";

import type { SONG_TYPES } from "@/features/songs/constants";

export type SongType = (typeof SONG_TYPES)[number];

export type SongRecord = Song;

export type SongDto = Omit<SongRecord, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SongListQuery = {
  name?: string;
  teamName?: string;
  playerName?: string;
  customTypeName?: string;
  type?: SongType;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
