import { NextResponse } from "next/server";

import { AdminConfigError, AdminUnauthorizedError, requireAdminSession } from "@/features/auth/server";
import {
  SongValidationError,
  createSong,
  listSongs,
  parseSongListUrlSearchParams,
  toSongDto,
  toSongDtoList
} from "@/features/songs/service";
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = parseSongListUrlSearchParams(url.searchParams);
    const songs = await listSongs(query);
    return ok(toSongDtoList(songs));
  } catch (error) {
    if (error instanceof SongValidationError) {
      return badRequest("검색 조건이 올바르지 않습니다.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const song = await createSong(body);
    return created(toSongDto(song), "등록되었습니다.");
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return unauthorized("관리자 로그인 후 등록할 수 있습니다.");
    }

    if (error instanceof AdminConfigError) {
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

