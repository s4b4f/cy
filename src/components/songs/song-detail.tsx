import Link from "next/link";

import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SONG_TYPE_BADGE_VARIANT, SONG_TYPE_LABEL } from "@/features/songs/constants";
import type { SongRecord } from "@/features/songs/types";
import { formatDateTime } from "@/lib/utils";

export function SongDetail({ song, canManage }: { song: SongRecord; canManage: boolean }) {
  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="응원가 상세"
        title={song.name}
        description="저장된 응원가 메타데이터와 로블록스 assetId를 확인합니다. 복사 버튼으로 바로 클립보드에 복사할 수 있습니다."
        meta={
          <>
            <Badge variant={SONG_TYPE_BADGE_VARIANT[song.type]}>{SONG_TYPE_LABEL[song.type]}</Badge>
            {song.customTypeName ? <span>{song.customTypeName}</span> : null}
          </>
        }
        actions={
          <>
            <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
              목록
            </Link>
            {canManage ? (
              <Link href={`/songs/${song.id}/edit`} className={buttonClassName({ variant: "default" })}>
                수정
              </Link>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>응원가 레코드에 저장된 핵심 데이터입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">팀 이름</dt>
              <dd className="mt-2 text-sm text-zinc-100">{song.teamName}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">선수 이름</dt>
              <dd className="mt-2 text-sm text-zinc-100">{song.playerName ?? "-"}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">타입</dt>
              <dd className="mt-2 text-sm text-zinc-100">{SONG_TYPE_LABEL[song.type]}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">기타 타입 이름</dt>
              <dd className="mt-2 text-sm text-zinc-100">{song.customTypeName ?? "-"}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Roblox assetId</dt>
              <dd className="mt-3">
                <AssetIdCopy assetId={song.assetId} />
              </dd>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>메타데이터</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">생성일</div>
                <div className="mt-2 text-sm text-zinc-100">{formatDateTime(song.createdAt)}</div>
              </div>
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">수정일</div>
                <div className="mt-2 text-sm text-zinc-100">{formatDateTime(song.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 메모</CardTitle>
              <CardDescription>이 레코드는 단일 Song 테이블 기준으로 관리됩니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-zinc-400">
              <p>팀과 선수는 현재 문자열로 저장되어 있어 빠르게 수정 가능합니다.</p>
              <p>추후 Team, Player 테이블이 추가되더라도 UI는 현재 필드를 유지한 채 매핑 계층만 확장할 수 있습니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
