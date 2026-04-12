import { SongList } from "@/components/songs/song-list";
import { isAdminSession } from "@/features/auth/server";
import { listSongs, parseSongListSearchParams } from "@/features/songs/service";
import type { SongListQuery } from "@/features/songs/types";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SongsPage({ searchParams }: PageProps) {
  const [params, admin] = await Promise.all([searchParams, isAdminSession()]);

  let query: SongListQuery = {};
  try {
    query = parseSongListSearchParams(params);
  } catch {
    query = {};
  }

  const songs = await listSongs(query);
  return <SongList songs={songs} query={query} canManage={admin} />;
}

