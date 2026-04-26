"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>신청 게시판을 불러오지 못했습니다</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-6 text-zinc-400">네트워크 상태 또는 서버 처리 오류일 수 있습니다. 다시 시도해도 반복되면 API 로그를 확인해야 합니다.</div>
        <Button onClick={reset}>다시 시도</Button>
      </CardContent>
    </Card>
  );
}
