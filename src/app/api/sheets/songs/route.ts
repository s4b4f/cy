import { NextResponse } from "next/server";

import { requireSheetIngestAccess, SheetConfigError, SheetUnauthorizedError } from "@/features/sheets/auth";
import { SongValidationError, toSongDto, upsertSongByAssetId } from "@/features/songs/service";
import type { ApiResponse } from "@/features/songs/types";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ok<T>(data: T, message?: string) {
  return json(200, { success: true, data, message });
}

function created<T>(data: T, message?: string) {
  return json(201, { success: true, data, message });
}

function badRequest(message: string, error: string, data?: unknown) {
  return json(400, { success: false, message, error, data } as ApiResponse<unknown>);
}

function unauthorized(message: string) {
  return json(401, { success: false, message, error: "UNAUTHORIZED" } as ApiResponse<unknown>);
}

function serverError(message = "서버 오류가 발생했습니다.") {
  return json(500, { success: false, message, error: "INTERNAL_SERVER_ERROR" } as ApiResponse<unknown>);
}

export async function POST(request: Request) {
  try {
    requireSheetIngestAccess(request);

    const body = await request.json();
    const result = await upsertSongByAssetId(body);
    const song = toSongDto(result.song);

    if (result.created) {
      return created(song, "시트 데이터가 신규 등록되었습니다.");
    }

    return ok(song, "시트 데이터로 기존 응원가를 업데이트했습니다.");
  } catch (error) {
    if (error instanceof SheetUnauthorizedError) {
      return unauthorized("시트 비밀키가 유효하지 않습니다.");
    }

    if (error instanceof SheetConfigError) {
      return serverError(error.message);
    }

    if (error instanceof SongValidationError) {
      return badRequest("입력값을 확인해주세요.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    return serverError();
  }
}
