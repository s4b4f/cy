import Link from "next/link";

import { SongFilter } from "@/components/songs/song-filter";
import { SongTable } from "@/components/songs/song-table";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SongListQuery, SongRecord } from "@/features/songs/types";

type Props = {
  songs: SongRecord[];
  query: SongListQuery;
  canManage: boolean;
};

export function SongList({ songs, query, canManage }: Props) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>응원가 목록</CardTitle>
            <div className="mt-1 text-sm text-zinc-400">총 {songs.length}건</div>
          </div>

          {canManage ? (
            <Link href="/songs/new" className={buttonClassName({ variant: "default" })}>
              + 응원가 등록
            </Link>
          ) : (
            <Link href="/requests/new" className={buttonClassName({ variant: "default" })}>
              + 응원가 신청
            </Link>
          )}
        </CardHeader>

        <CardContent>
          {!canManage ? (
            <div className="mb-4 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300">
              등록, 수정, 삭제는 관리자 로그인 후 사용할 수 있습니다. 일반 사용자는 신청 게시판에서 응원가를 요청할 수 있습니다.
            </div>
          ) : null}

          <SongFilter initialQuery={query} />

          <div className="mt-4">
            <SongTable songs={songs} canManage={canManage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
