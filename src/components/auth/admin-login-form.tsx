"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

type LoginResponse = {
  success: boolean;
  data?: {
    next?: string;
    fieldErrors?: Record<string, string[]>;
  };
  message?: string;
};

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          password,
          next: nextPath
        })
      });

      const result = (await response.json()) as LoginResponse;
      if (!response.ok || !result.success) {
        setError(result.message ?? "로그인에 실패했습니다.");
        return;
      }

      router.push(result.data?.next ?? "/songs");
      router.refresh();
    } catch {
      setError("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="관리자 인증"
        title="관리자 로그인"
        description="등록, 수정, 삭제 권한은 관리자 세션으로만 열립니다. 로그인 후에는 기존 화면 흐름을 그대로 유지합니다."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 입력</CardTitle>
            <CardDescription>세션 쿠키가 발급되면 관리자 전용 기능이 활성화됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <Field label="관리자 비밀번호">
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                  autoFocus
                />
              </Field>

              {error ? (
                <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">{error}</div>
              ) : null}

              <Button type="submit" disabled={submitting}>
                {submitting ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>권한 범위</CardTitle>
            <CardDescription>현재 관리자 세션에서만 허용되는 작업입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-zinc-400">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">응원가 직접 등록</div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">응원가 수정 및 삭제</div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">신청 게시판 승인 / 반려 처리</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
