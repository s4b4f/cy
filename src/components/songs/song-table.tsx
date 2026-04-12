"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClassName } from "@/components/ui/button";
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
    const ok = confirm("정말 삭제할까요? 이 작업은 되돌릴 수 없습니다.");
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
        alert(result.message ?? "삭제에 실패했습니다.");
        return;
      }

      router.refresh();
    } catch {
      alert("삭제에 실패했습니다. 네트워크 상태를 확인해주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  const columnCount = canManage ? 7 : 6;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
      <table className="min-w-[900px] w-full border-separate border-spacing-0">
        <thead className="sticky top-0 bg-zinc-950">
          <tr className="text-left text-xs text-zinc-400">
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">이름</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">팀</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">선수</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">타입</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">assetId</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">생성일</th>
            {canManage ? (
              <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">관리</th>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {songs.map((song) => (
            <tr key={song.id} className="text-sm hover:bg-zinc-900/40">
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <Link href={`/songs/${song.id}`} className="font-medium hover:underline">
                  {song.name}
                </Link>
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">{song.teamName}</td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top text-zinc-200">
                {song.playerName ?? <span className="text-zinc-500">-</span>}
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <div className="flex flex-col gap-1">
                  <Badge variant={SONG_TYPE_BADGE_VARIANT[song.type]}>{SONG_TYPE_LABEL[song.type]}</Badge>
                  {song.type === "CUSTOM" && song.customTypeName ? (
                    <span className="text-xs text-zinc-400">{song.customTypeName}</span>
                  ) : null}
                </div>
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <AssetIdCopy assetId={song.assetId} />
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top text-xs text-zinc-400">
                {formatDateTime(song.createdAt)}
              </td>
              {canManage ? (
                <td className="border-b border-zinc-900 px-4 py-3 align-top">
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

          {songs.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-10 text-center text-sm text-zinc-400">
                조건에 맞는 응원가가 없습니다.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

