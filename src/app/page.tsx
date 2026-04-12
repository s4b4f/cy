import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminSession } from "@/features/auth/server";

export default async function HomePage() {
  const admin = await isAdminSession();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>응원가 DB</CardTitle>
          <CardDescription>
            로블록스 야구게임 응원가 정보를 조회하고, 관리자는 직접 등록하고, 일반 사용자는 신청 게시판을 통해 등록 요청할 수 있습니다.
          </CardDescription>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/songs" className={buttonClassName({ variant: "default" })}>
              응원가 목록
            </Link>
            <Link href="/requests" className={buttonClassName({ variant: "secondary" })}>
              응원가 신청 게시판
            </Link>
            {admin ? (
              <Link href="/songs/new" className={buttonClassName({ variant: "ghost" })}>
                관리자 등록
              </Link>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>운영 흐름</CardTitle>
          <CardDescription>
            신청은 누구나 가능하고, 관리자가 승인한 항목만 실제 응원가 목록으로 반영됩니다. 승인 전까지는 신청 게시판에서 상태를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

