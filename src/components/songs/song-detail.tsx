import Link from "next/link";

import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SONG_TYPE_BADGE_VARIANT, SONG_TYPE_LABEL } from "@/features/songs/constants";
import type { SongRecord } from "@/features/songs/types";
import { formatDateTime } from "@/lib/utils";

export function SongDetail({ song, canManage }: { song: SongRecord; canManage: boolean }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>{song.name}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={SONG_TYPE_BADGE_VARIANT[song.type]}>{SONG_TYPE_LABEL[song.type]}</Badge>
              {song.type === "CUSTOM" && song.customTypeName ? (
                <span className="text-sm text-zinc-300">{song.customTypeName}</span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
              목록
            </Link>
            {canManage ? (
              <Link href={`/songs/${song.id}/edit`} className={buttonClassName({ variant: "default" })}>
                수정
              </Link>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">팀 이름</dt>
              <dd className="mt-1 text-sm">{song.teamName}</dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">선수 이름</dt>
              <dd className="mt-1 text-sm">{song.playerName ?? "-"}</dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">타입</dt>
              <dd className="mt-1 text-sm">{SONG_TYPE_LABEL[song.type]}</dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">기타 타입 이름</dt>
              <dd className="mt-1 text-sm">{song.customTypeName ?? "-"}</dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4 md:col-span-2">
              <dt className="text-xs text-zinc-400">로블록스 assetId</dt>
              <dd className="mt-2">
                <AssetIdCopy assetId={song.assetId} />
              </dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">생성일</dt>
              <dd className="mt-1 text-sm text-zinc-200">{formatDateTime(song.createdAt)}</dd>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4">
              <dt className="text-xs text-zinc-400">수정일</dt>
              <dd className="mt-1 text-sm text-zinc-200">{formatDateTime(song.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

