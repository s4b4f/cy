"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  requestId: string;
  disabled?: boolean;
};

export function RequestActions({ requestId, disabled }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState<"APPROVED" | "REJECTED" | null>(null);

  async function update(status: "APPROVED" | "REJECTED") {
    const rejectionReason =
      status === "REJECTED" ? window.prompt("반려 사유를 입력해주세요.", "사유를 입력해주세요.")?.trim() : undefined;

    if (status === "REJECTED" && !rejectionReason) {
      return;
    }

    setSubmitting(status);

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          status,
          rejectionReason
        })
      });

      const result = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (response.status === 401 || result.error === "UNAUTHORIZED") {
        router.push(`/admin/login?next=${encodeURIComponent("/requests")}`);
        return;
      }

      if (!response.ok || !result.success) {
        window.alert(result.message ?? "처리에 실패했습니다.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => update("APPROVED")}
        disabled={disabled || submitting !== null}
      >
        {submitting === "APPROVED" ? "승인 중..." : "승인"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => update("REJECTED")}
        disabled={disabled || submitting !== null}
      >
        {submitting === "REJECTED" ? "반려 중..." : "반려"}
      </Button>
    </div>
  );
}

