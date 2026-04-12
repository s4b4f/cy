import { NextResponse } from "next/server";

import {
  SongRequestValidationError,
  createSongRequest,
  listSongRequests,
  parseSongRequestUrlSearchParams,
  toSongRequestDto,
  toSongRequestDtoList
} from "@/features/requests/service";
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

function serverError(message = "서버 오류가 발생했습니다.") {
  return json(500, { success: false, message, error: "INTERNAL_SERVER_ERROR" } as ApiResponse<unknown>);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = parseSongRequestUrlSearchParams(url.searchParams);
    const requests = await listSongRequests(query);
    return ok(toSongRequestDtoList(requests));
  } catch (error) {
    if (error instanceof SongRequestValidationError) {
      return badRequest("신청 목록 조건이 올바르지 않습니다.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const createdRequest = await createSongRequest(body);
    return created(toSongRequestDto(createdRequest), "응원가 신청이 등록되었습니다.");
  } catch (error) {
    if (error instanceof SongRequestValidationError) {
      return badRequest("입력값을 확인해주세요.", "VALIDATION_ERROR", {
        fieldErrors: error.cause.flatten().fieldErrors
      });
    }

    return serverError();
  }
}

