import { AssetIdCopy } from "@/components/songs/asset-id-copy";
import { RequestActions } from "@/components/requests/request-actions";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import type { SongRequestRecord } from "@/features/requests/types";
import { SONG_TYPE_LABEL } from "@/features/songs/constants";
import { formatDateTime } from "@/lib/utils";

type Props = {
  requests: SongRequestRecord[];
  canManage: boolean;
};

export function RequestTable({ requests, canManage }: Props) {
  const columnCount = canManage ? 8 : 7;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
      <table className="min-w-[1100px] w-full border-separate border-spacing-0">
        <thead className="sticky top-0 bg-zinc-950">
          <tr className="text-left text-xs text-zinc-400">
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">상태</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">신청자</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">응원가</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">팀 / 선수</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">assetId</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">메모 / 결과</th>
            <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">신청일</th>
            {canManage ? <th className="border-b border-zinc-800/80 px-4 py-3 font-medium">관리</th> : null}
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="text-sm hover:bg-zinc-900/40">
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <RequestStatusBadge status={request.status} />
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">{request.requesterName ?? "익명"}</td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <div className="font-medium">{request.name}</div>
                <div className="mt-1 text-xs text-zinc-500">{SONG_TYPE_LABEL[request.type]}</div>
                {request.customTypeName ? <div className="mt-1 text-xs text-zinc-400">{request.customTypeName}</div> : null}
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <div>{request.teamName}</div>
                <div className="mt-1 text-xs text-zinc-400">{request.playerName ?? "-"}</div>
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <AssetIdCopy assetId={request.assetId} />
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top">
                <div className="whitespace-pre-wrap text-sm text-zinc-200">{request.requestNote ?? "-"}</div>
                {request.rejectionReason ? (
                  <div className="mt-2 rounded-md bg-red-950/40 px-2 py-1 text-xs text-red-200">{request.rejectionReason}</div>
                ) : null}
              </td>
              <td className="border-b border-zinc-900 px-4 py-3 align-top text-xs text-zinc-400">
                <div>{formatDateTime(request.createdAt)}</div>
                {request.reviewedAt ? <div className="mt-1">처리: {formatDateTime(request.reviewedAt)}</div> : null}
              </td>
              {canManage ? (
                <td className="border-b border-zinc-900 px-4 py-3 align-top">
                  <RequestActions requestId={request.id} disabled={request.status !== "PENDING"} />
                </td>
              ) : null}
            </tr>
          ))}

          {requests.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-10 text-center text-sm text-zinc-400">
                아직 등록된 신청이 없습니다.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
