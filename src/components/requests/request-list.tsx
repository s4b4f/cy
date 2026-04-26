import Link from "next/link";

import { RequestTable } from "@/components/requests/request-table";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { REQUEST_STATUSES, REQUEST_STATUS_LABEL } from "@/features/requests/constants";
import type { SongRequestListQuery, SongRequestRecord } from "@/features/requests/types";
import { cn } from "@/lib/utils";

type Props = {
  requests: SongRequestRecord[];
  query: SongRequestListQuery;
  canManage: boolean;
  submitted?: boolean;
};

function hrefForStatus(status?: string) {
  return status ? `/requests?status=${status}` : "/requests";
}

export function RequestList({ requests, query, canManage, submitted }: Props) {
  const pendingCount = requests.filter((request) => request.status === "PENDING").length;
  const approvedCount = requests.filter((request) => request.status === "APPROVED").length;
  const rejectedCount = requests.filter((request) => request.status === "REJECTED").length;

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="응원가 신청"
        title="신청 게시판"
        description="사용자는 응원가를 신청하고, 관리자는 승인 또는 반려를 처리합니다. 승인된 항목만 실제 Song 데이터로 반영됩니다."
        meta={
          <>
            <span>현재 결과 {requests.length}건</span>
            {query.status ? (
              <>
                <span className="text-zinc-600">•</span>
                <span>필터: {REQUEST_STATUS_LABEL[query.status]}</span>
              </>
            ) : null}
          </>
        }
        actions={
          <>
            <Link href="/requests/new" className={buttonClassName({ variant: "default", size: "lg" })}>
              신청 작성
            </Link>
            <Link href="/songs" className={buttonClassName({ variant: "secondary", size: "lg" })}>
              응원가 목록
            </Link>
          </>
        }
      />

      {submitted ? (
        <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
          응원가 신청이 등록되었습니다. 관리자가 검토 후 승인하면 실제 응원가 목록에 반영됩니다.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="전체 신청" value={requests.length} description="현재 조건 기준 신청 수" tone="blue" />
        <StatCard label="대기" value={pendingCount} description="관리자 검토 전" tone="amber" />
        <StatCard label="승인" value={approvedCount} description="실제 목록 반영 완료" tone="emerald" />
        <StatCard label="반려" value={rejectedCount} description="보완이 필요한 신청" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>상태 필터</CardTitle>
          <CardDescription>승인 진행 상황만 빠르게 보고 싶을 때 사용합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link
              href={hrefForStatus(undefined)}
              className={cn(buttonClassName({ variant: query.status ? "ghost" : "secondary", size: "sm" }), "rounded-full")}
            >
              전체
            </Link>
            {REQUEST_STATUSES.map((status) => (
              <Link
                key={status}
                href={hrefForStatus(status)}
                className={cn(
                  buttonClassName({ variant: query.status === status ? "secondary" : "ghost", size: "sm" }),
                  "rounded-full"
                )}
              >
                {REQUEST_STATUS_LABEL[status]}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {requests.length > 0 ? (
        <RequestTable requests={requests} canManage={canManage} />
      ) : (
        <EmptyState
          title="신청 내역이 없습니다"
          description="첫 번째 신청을 등록하면 관리자 승인 흐름이 시작됩니다. 이미 등록된 응원가는 응원가 목록에서 바로 검색할 수 있습니다."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/requests/new" className={buttonClassName({ variant: "default" })}>
                신청하러 가기
              </Link>
              <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
                응원가 목록 보기
              </Link>
            </div>
          }
        />
      )}
    </div>
  );
}
