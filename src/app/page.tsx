import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { isAdminSession } from "@/features/auth/server";
import { listSongRequests } from "@/features/requests/service";
import { listSongs } from "@/features/songs/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [admin, songs, requests] = await Promise.all([isAdminSession(), listSongs({}), listSongRequests({})]);

  const pendingRequests = requests.filter((request) => request.status === "PENDING").length;
  const approvedRequests = requests.filter((request) => request.status === "APPROVED").length;
  const uniqueTeams = new Set(songs.map((song) => song.teamName)).size;

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="관리 대시보드"
        title="로블록스 야구 응원가 운영판"
        description="응원가 데이터 조회, 신규 신청 접수, 관리자 승인 흐름을 한곳에서 관리합니다. DB 구조와 배포 설정은 유지한 채 화면 구조만 다시 설계한 버전입니다."
        meta={
          <>
            <span>실제 DB와 연결된 운영 화면</span>
            <span className="text-zinc-600">•</span>
            <span>최신순 정렬 기본</span>
            <span className="text-zinc-600">•</span>
            <span>신청 후 승인 시 실제 목록 반영</span>
          </>
        }
        actions={
          <>
            <Link href="/songs" className={buttonClassName({ variant: "default", size: "lg" })}>
              응원가 목록 보기
            </Link>
            <Link href="/requests" className={buttonClassName({ variant: "secondary", size: "lg" })}>
              신청 게시판 보기
            </Link>
            {admin ? (
              <Link href="/songs/new" className={buttonClassName({ variant: "outline", size: "lg" })}>
                직접 등록
              </Link>
            ) : (
              <Link href="/admin/login" className={buttonClassName({ variant: "outline", size: "lg" })}>
                관리자 로그인
              </Link>
            )}
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="등록된 응원가" value={songs.length} description="현재 공개된 응원가 데이터 수" tone="blue" />
        <StatCard label="팀 수" value={uniqueTeams} description="문자열 기준으로 분류된 팀 수" />
        <StatCard label="대기 중 신청" value={pendingRequests} description="관리자 승인을 기다리는 요청" tone="amber" />
        <StatCard label="처리 완료 신청" value={approvedRequests} description="승인되어 실제 목록에 반영된 요청" tone="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>운영 흐름</CardTitle>
            <CardDescription>현재 서비스는 공개 조회와 신청 접수, 관리자 승인 흐름을 분리해서 운영합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-sm font-medium text-zinc-100">1. 일반 사용자</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">응원가 목록을 검색하고, 없는 곡은 신청 게시판에서 등록 요청합니다.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-sm font-medium text-zinc-100">2. 신청 상태 관리</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">신청은 대기, 승인, 반려 상태로 관리되며 처리 이력이 그대로 남습니다.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-sm font-medium text-zinc-100">3. 관리자 승인</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">관리자가 승인하면 신청 데이터를 기반으로 실제 응원가 레코드가 생성됩니다.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 이동</CardTitle>
            <CardDescription>자주 쓰는 작업만 바로 접근할 수 있게 정리했습니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/songs" className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 hover:border-zinc-700 hover:bg-zinc-900">
              <div className="text-sm font-medium text-zinc-100">응원가 목록</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">팀, 선수, 타입 기준으로 검색하고 assetId를 바로 복사합니다.</p>
            </Link>
            <Link href="/requests" className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 hover:border-zinc-700 hover:bg-zinc-900">
              <div className="text-sm font-medium text-zinc-100">신청 게시판</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">신청 현황 확인과 승인 대기 건 검토를 한 화면에서 처리합니다.</p>
            </Link>
            <Link
              href={admin ? "/songs/new" : "/admin/login"}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="text-sm font-medium text-zinc-100">{admin ? "직접 등록" : "관리자 로그인"}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {admin ? "신규 응원가를 수동으로 등록하고 즉시 공개 목록에 반영합니다." : "등록, 수정, 삭제 권한이 필요하면 관리자 로그인으로 전환합니다."}
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
