import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { RequestActions } from "@/components/requests/request-actions";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SongRequestRecord } from "@/features/requests/types";
import { SONG_TYPE_LABEL } from "@/features/songs/constants";
import { formatDateTime } from "@/lib/utils";

type Props = {
  requests: SongRequestRecord[];
  canManage: boolean;
};

export function RequestTable({ requests, canManage }: Props) {
  return (
    <div className="page-grid">
      <Card className="hidden xl:block">
        <CardHeader className="border-b border-zinc-800/60">
          <CardTitle>데스크톱 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full border-separate border-spacing-0">
              <thead className="bg-zinc-950/90">
                <tr className="text-left text-xs font-medium text-zinc-400">
                  <th className="border-b border-zinc-800/60 px-6 py-4">상태</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">신청자</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">응원가</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">팀 / 선수</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">assetId</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">메모 / 결과</th>
                  <th className="border-b border-zinc-800/60 px-6 py-4">등록일</th>
                  {canManage ? <th className="border-b border-zinc-800/60 px-6 py-4">관리</th> : null}
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="text-sm hover:bg-zinc-900/35">
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <RequestStatusBadge status={request.status} />
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top text-zinc-200">{request.requesterName ?? "익명"}</td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <div className="font-medium text-zinc-50">{request.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">{SONG_TYPE_LABEL[request.type]}</div>
                      {request.customTypeName ? <div className="mt-1 text-xs text-zinc-400">{request.customTypeName}</div> : null}
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <div className="text-zinc-100">{request.teamName}</div>
                      <div className="mt-1 text-xs text-zinc-400">{request.playerName ?? "-"}</div>
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <AssetIdCopy assetId={request.assetId} />
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top">
                      <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">{request.requestNote ?? "-"}</div>
                      {request.rejectionReason ? (
                        <div className="mt-3 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
                          반려 사유: {request.rejectionReason}
                        </div>
                      ) : null}
                    </td>
                    <td className="border-b border-zinc-900 px-6 py-4 align-top text-xs text-zinc-400">
                      <div>{formatDateTime(request.createdAt)}</div>
                      {request.reviewedAt ? <div className="mt-1">처리: {formatDateTime(request.reviewedAt)}</div> : null}
                    </td>
                    {canManage ? (
                      <td className="border-b border-zinc-900 px-6 py-4 align-top">
                        <RequestActions requestId={request.id} disabled={request.status !== "PENDING"} />
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
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-zinc-800/60">
              <div className="space-y-2">
                <RequestStatusBadge status={request.status} />
                <div className="text-base font-semibold text-zinc-50">{request.name}</div>
                <div className="text-sm text-zinc-400">{request.teamName}{request.playerName ? ` · ${request.playerName}` : ""}</div>
              </div>
              <div className="text-right text-xs text-zinc-500">{formatDateTime(request.createdAt)}</div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-zinc-500">신청자</div>
                  <div className="mt-1 text-sm text-zinc-100">{request.requesterName ?? "익명"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">타입</div>
                  <div className="mt-1 text-sm text-zinc-100">
                    {SONG_TYPE_LABEL[request.type]}
                    {request.customTypeName ? ` · ${request.customTypeName}` : ""}
                  </div>
                </div>
              </div>

              <AssetIdCopy assetId={request.assetId} />

              <div>
                <div className="text-xs text-zinc-500">신청 메모</div>
                <div className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{request.requestNote ?? "-"}</div>
              </div>

              {request.rejectionReason ? (
                <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
                  반려 사유: {request.rejectionReason}
                </div>
              ) : null}

              {canManage ? <RequestActions requestId={request.id} disabled={request.status !== "PENDING"} /> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
