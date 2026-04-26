import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>페이지를 찾을 수 없습니다</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Link href="/" className={buttonClassName({ variant: "default" })}>
          홈으로
        </Link>
        <Link href="/songs" className={buttonClassName({ variant: "secondary" })}>
          응원가 목록
        </Link>
      </CardContent>
    </Card>
  );
}
