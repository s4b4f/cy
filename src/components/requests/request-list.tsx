import Link from "next/link";

import { RequestTable } from "@/components/requests/request-table";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <div className="grid gap-4">
      {submitted ? (
        <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
          응원가 신청이 등록되었습니다. 관리자가 확인 후 승인하면 실제 목록에 반영됩니다.
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>응원가 신청 게시판</CardTitle>
            <CardDescription className="mt-2">
              누구나 응원가를 신청할 수 있고, 관리자가 승인하면 실제 응원가 목록에 반영됩니다.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/requests/new" className={buttonClassName({ variant: "default" })}>
              신청하기
            </Link>
            <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
              응원가 목록
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              href={hrefForStatus(undefined)}
              className={cn(
                buttonClassName({ variant: query.status ? "ghost" : "secondary", size: "sm" }),
                "rounded-full"
              )}
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

          <RequestTable requests={requests} canManage={canManage} />
        </CardContent>
      </Card>
    </div>
  );
}

