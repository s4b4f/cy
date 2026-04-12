import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { buttonClassName } from "@/components/ui/button";
import { isAdminSession } from "@/features/auth/server";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "응원가 DB",
  description: "로블록스 야구게임 응원가 DB 관리자"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdminSession();

  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen")}>
        <div className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
          <div className="container">
            <div className="flex min-h-14 flex-col justify-center gap-3 py-3 md:flex-row md:items-center md:justify-between md:py-0">
              <Link href="/" className="font-semibold tracking-tight">
                응원가 DB
              </Link>

              <nav className="flex flex-wrap items-center gap-2">
                <Link href="/songs" className={buttonClassName({ variant: "ghost" })}>
                  응원가 목록
                </Link>
                <Link href="/requests" className={buttonClassName({ variant: "ghost" })}>
                  응원가 신청
                </Link>

                {admin ? (
                  <>
                    <Link href="/songs/new" className={buttonClassName({ variant: "default" })}>
                      직접 등록
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <Link href="/admin/login" className={buttonClassName({ variant: "secondary" })}>
                    관리자 로그인
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>

        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}

