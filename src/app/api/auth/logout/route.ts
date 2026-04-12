import { NextResponse } from "next/server";

import { getAdminSessionClearCookieOptions } from "@/features/auth/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "로그아웃되었습니다."
  });

  response.cookies.set(getAdminSessionClearCookieOptions());
  return response;
}
