import Link from "next/link";

import { SongFilter } from "@/components/songs/song-filter";
import { SongTable } from "@/components/songs/song-table";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import type { SongListQuery, SongRecord } from "@/features/songs/types";

type Props = {
  songs: SongRecord[];
  query: SongListQuery;
  canManage: boolean;
};

function activeFilterCount(query: SongListQuery) {
  return Object.values(query).filter(Boolean).length;
}

export function SongList({ songs, query, canManage }: Props) {
  const typeTeamCount = songs.filter((song) => song.type === "TEAM").length;
  const typePlayerCount = songs.filter((song) => song.type === "PLAYER").length;
  const uniqueTeams = new Set(songs.map((song) => song.teamName)).size;
  const filters = activeFilterCount(query);

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="응원가 데이터"
        title="응원가 목록"
        description="팀, 선수, 타입 기준으로 현재 등록된 응원가를 조회합니다. 기본 정렬은 최신순이며, 관리자는 같은 화면에서 수정과 삭제까지 처리합니다."
        meta={
          <>
            <span>조회 결과 {songs.length}건</span>
            <span className="text-zinc-600">•</span>
            <span>활성 필터 {filters}개</span>
          </>
        }
        actions={
          canManage ? (
            <Link href="/songs/new" className={buttonClassName({ variant: "default", size: "lg" })}>
              응원가 등록
            </Link>
          ) : (
            <Link href="/requests/new" className={buttonClassName({ variant: "default", size: "lg" })}>
              응원가 신청
            </Link>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="조회 결과" value={songs.length} description="현재 조건에 맞는 응원가 수" tone="blue" />
        <StatCard label="팀 응원가" value={typeTeamCount} description="TEAM 타입 응원가 수" />
        <StatCard label="선수 응원가" value={typePlayerCount} description="PLAYER 타입 응원가 수" />
        <StatCard label="팀 수" value={uniqueTeams} description="현재 결과에 포함된 팀 수" tone="emerald" />
      </div>

      <Card>
        <CardHeader className="gap-3 border-b border-zinc-800/60">
          <CardTitle>검색과 필터</CardTitle>
          <CardDescription>이름, 팀, 선수, 커스텀 타입 기준으로 검색합니다. 모든 검색은 URL 쿼리스트링으로 유지됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <SongFilter initialQuery={query} />
        </CardContent>
      </Card>

      {!canManage ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-3 text-sm leading-6 text-zinc-300">
          일반 사용자는 조회와 신청만 가능합니다. 신규 등록이나 수정, 삭제는 관리자 로그인 후 처리됩니다.
        </div>
      ) : null}

      {songs.length > 0 ? (
        <SongTable songs={songs} canManage={canManage} />
      ) : (
        <EmptyState
          title="조건에 맞는 응원가가 없습니다"
          description="검색어를 줄이거나 필터를 초기화해 다시 확인하세요. 없는 곡이라면 신청 게시판을 통해 등록 요청을 받을 수 있습니다."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
                필터 초기화
              </Link>
              {!canManage ? (
                <Link href="/requests/new" className={buttonClassName({ variant: "default" })}>
                  응원가 신청
                </Link>
              ) : null}
            </div>
          }
        />
      )}
    </div>
  );
}
