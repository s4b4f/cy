import { NextResponse } from "next/server";

import { adminLoginSchema } from "@/features/auth/schemas";
import {
  AdminConfigError,
  getAdminSessionCookieOptions,
  normalizeNextPath,
  verifyAdminPassword
} from "@/features/auth/server";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, {
        success: false,
        message: "비밀번호를 확인해주세요.",
        error: "VALIDATION_ERROR",
        data: {
          fieldErrors: parsed.error.flatten().fieldErrors
        }
      });
    }

    if (!verifyAdminPassword(parsed.data.password)) {
      return json(401, {
        success: false,
        message: "관리자 비밀번호가 올바르지 않습니다.",
        error: "UNAUTHORIZED"
      });
    }

    const response = json(200, {
      success: true,
      data: {
        next: normalizeNextPath(parsed.data.next)
      },
      message: "관리자 로그인에 성공했습니다."
    });

    response.cookies.set(getAdminSessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof AdminConfigError) {
      return json(500, {
        success: false,
        message: error.message,
        error: "AUTH_CONFIG_MISSING"
      });
    }

    return json(500, {
      success: false,
      message: "로그인 처리 중 오류가 발생했습니다.",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}

