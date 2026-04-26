"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SongsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>응원가 화면을 불러오지 못했습니다</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-6 text-zinc-400">일시적인 오류일 수 있습니다. 다시 시도 후에도 반복되면 최근 변경 사항이나 서버 로그를 확인하세요.</div>
        <Button onClick={reset}>다시 시도</Button>
      </CardContent>
    </Card>
  );
}
