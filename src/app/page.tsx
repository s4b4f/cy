import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminSession } from "@/features/auth/server";

export default async function HomePage() {
  const admin = await isAdminSession();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>응원가 DB</CardTitle>
          <CardDescription>
            로블록스 야구게임에서 사용하는 응원가 정보를 조회하고, 관리자만 등록/수정/삭제할 수 있는 관리 페이지입니다.
          </CardDescription>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/songs" className={buttonClassName({ variant: "default" })}>
              목록 보기
            </Link>

            {admin ? (
              <Link href="/songs/new" className={buttonClassName({ variant: "secondary" })}>
                새 응원가 등록
              </Link>
            ) : (
              <Link href="/admin/login" className={buttonClassName({ variant: "secondary" })}>
                관리자 로그인
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>빠른 안내</CardTitle>
          <CardDescription>
            검색과 필터는 URL 쿼리스트링 기반으로 동작합니다. 관리자 로그인 전에는 조회만 가능하고, 로그인 후 등록/수정/삭제가 열립니다.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

