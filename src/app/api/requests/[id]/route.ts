import { NextResponse } from "next/server";

import { AdminConfigError, AdminUnauthorizedError, requireAdminSession } from "@/features/auth/server";
import {
  SongRequestConflictError,
  SongRequestNotFoundError,
  SongRequestValidationError,
  reviewSongRequest,
  toSongRequestDto
} from "@/features/requests/service";
import type { ApiResponse } from "@/features/songs/types";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ok<T>(data: T, message?: string) {
  return json(200, { success: true, data, message });
}

function badRequest(message: string, error: string, data?: unknown) {
  return json(400, { success: false, message, error, data } as ApiResponse<unknown>);
}

function unauthorized(message: string) {
  return json(401, { success: false, message, error: "UNAUTHORIZED" } as ApiResponse<unknown>);
}

function notFound(message: string) {
  return json(404, { success: false, message, error: "NOT_FOUND" } as ApiResponse<unknown>);
}

function conflict(message: string) {
  return json(409, { success: false, message, error: "CONFLICT" } as ApiResponse<unknown>);
}

function serverError(message = "서버 오류가 발생했습니다.") {
  return json(500, { success: false, message, error: "INTERNAL_SERVER_ERROR" } as ApiResponse<unknown>);
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = await request.json();
    const reviewed = await reviewSongRequest(id, body);
    return ok(toSongRequestDto(reviewed), "신청 상태가 업데이트되었습니다.");
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return unauthorized("관리자 로그인 후 신청을 관리할 수 있습니다.");
    }

    if (error instanceof AdminConfigError) {
      return serverError(error.message);
    }

    if (error instanceof SongRequestValidationError) {
      return badRequest("입력값을 확인해주세요.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    if (error instanceof SongRequestNotFoundError) {
      return notFound(error.message);
    }

    if (error instanceof SongRequestConflictError) {
      return conflict(error.message);
    }

    return serverError();
  }
}

