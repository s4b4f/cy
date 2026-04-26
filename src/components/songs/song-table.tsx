"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SONG_TYPE_BADGE_VARIANT, SONG_TYPE_LABEL } from "@/features/songs/constants";
import type { SongRecord } from "@/features/songs/types";
import { formatDateTime } from "@/lib/utils";

type Props = {
  songs: SongRecord[];
  canManage: boolean;
};

export function SongTable({ songs, canManage }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function remove(id: string) {
    const ok = window.confirm("정말 삭제할까요? 이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; message?: string; error?: string };

      if (response.status === 401 || result.error === "UNAUTHORIZED") {
        router.push(`/admin/login?next=${encodeURIComponent("/songs")}`);
        return;
      }

      if (!response.ok || !result.success) {
        window.alert(result.message ?? "삭제에 실패했습니다.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("삭제에 실패했습니다. 네트워크 상태를 확인해주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-grid">
      <Card className="hidden xl:block">
        <CardHeader className="border-b border-zinc-800/60">
          <CardTitle>데스크톱 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0">
              <thead className="bg-zinc-950/90">
                <tr className="text-left text-xs font-medium text-zinc-400">
                  <th className="border-b border-zinc-800/60 px-6 py-4">응원가</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">팀</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">선수</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">타입</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">assetId</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">생성일</th>
                  {canManage ? <th className="border-b border-zinc-800/60 px-6 py-4">관리</th> : null}
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id} className="text-sm hover:bg-zinc-900/35">
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <div className="space-y-1">
                        <Link href={`/songs/${song.id}`} className="font-medium text-zinc-50 hover:text-zinc-200">
                          {song.name}
                        </Link>
                        <div className="text-xs text-zinc-500">상세 보기 및 복사 지원</div>
                      </div>
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top text-zinc-200">{song.teamName}</td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top text-zinc-300">{song.playerName ?? "-"}</td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <div className="flex flex-col items-start gap-2">
                        <Badge variant={SONG_TYPE_BADGE_VARIANT[song.type]}>{SONG_TYPE_LABEL[song.type]}</Badge>
                        {song.type === "CUSTOM" && song.customTypeName ? (
                          <span className="text-xs text-zinc-400">{song.customTypeName}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <AssetIdCopy assetId={song.assetId} />
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top text-xs text-zinc-400">
                      {formatDateTime(song.createdAt)}
                    </td>
                    {canManage ? (
                      <td className="border-b border-zinc-900 px-6 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Link href={`/songs/${song.id}/edit`} className={buttonClassName({ variant: "secondary", size: "sm" })}>
                            수정
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(song.id)}
                            disabled={deletingId === song.id}
                          >
                            {deletingId === song.id ? "삭제 중..." : "삭제"}
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 xl:hidden">
        {songs.map((song) => (
          <Card key={song.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-zinc-800/60">
              <div className="space-y-2">
                <Link href={`/songs/${song.id}`} className="text-base font-semibold text-zinc-50 hover:text-zinc-200">
                  {song.name}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={SONG_TYPE_BADGE_VARIANT[song.type]}>{SONG_TYPE_LABEL[song.type]}</Badge>
                  {song.customTypeName ? <span className="text-xs text-zinc-400">{song.customTypeName}</span> : null}
                </div>
              </div>
              <div className="text-right text-xs text-zinc-500">{formatDateTime(song.createdAt)}</div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-zinc-500">팀</div>
                  <div className="mt-1 text-sm text-zinc-100">{song.teamName}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">선수</div>
                  <div className="mt-1 text-sm text-zinc-100">{song.playerName ?? "-"}</div>
                </div>
              </div>

              <AssetIdCopy assetId={song.assetId} />

              {canManage ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/songs/${song.id}/edit`} className={buttonClassName({ variant: "secondary", size: "sm" })}>
                    수정
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(song.id)}
                    disabled={deletingId === song.id}
                  >
                    {deletingId === song.id ? "삭제 중..." : "삭제"}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
