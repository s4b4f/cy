"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SongsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>문제가 발생했습니다</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-400">요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.</div>
        <Button onClick={reset}>다시 시도</Button>
      </CardContent>
    </Card>
  );
}

