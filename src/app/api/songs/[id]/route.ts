import { NextResponse } from "next/server";

import { AdminConfigError, AdminUnauthorizedError, requireAdminSession } from "@/features/auth/server";
import { SongNotFoundError, SongValidationError, getSong, removeSong, toSongDto, updateSong } from "@/features/songs/service";
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

function serverError(message = "서버 오류가 발생했습니다.") {
  return json(500, { success: false, message, error: "INTERNAL_SERVER_ERROR" } as ApiResponse<unknown>);
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const song = await getSong(id);

    if (!song) {
      return notFound("응원가를 찾을 수 없습니다.");
    }

    return ok(toSongDto(song));
  } catch {
    return serverError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = await request.json();
    const song = await updateSong(id, body);
    return ok(toSongDto(song), "수정되었습니다.");
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return unauthorized("관리자 로그인 후 수정할 수 있습니다.");
    }

    if (error instanceof AdminConfigError) {
      return serverError(error.message);
    }

    if (error instanceof SongValidationError) {
      return badRequest("입력값을 확인해주세요.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    if (error instanceof SongNotFoundError) {
      return notFound(error.message);
    }

    return serverError();
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const song = await removeSong(id);
    return ok(toSongDto(song), "삭제되었습니다.");
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return unauthorized("관리자 로그인 후 삭제할 수 있습니다.");
    }

    if (error instanceof AdminConfigError) {
      return serverError(error.message);
    }

    if (error instanceof SongNotFoundError) {
      return notFound(error.message);
    }

    return serverError();
  }
}

