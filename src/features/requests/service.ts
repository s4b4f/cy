import { ZodError } from "zod";

import * as requestRepo from "@/features/requests/repository";
import { requestCreateSchema, requestListQuerySchema, requestReviewSchema, type RequestCreateOutput } from "@/features/requests/schemas";
import type { SongRequestDto, SongRequestListQuery, SongRequestRecord } from "@/features/requests/types";
import * as songRepo from "@/features/songs/repository";

export class SongRequestValidationError extends Error {
  constructor(public readonly cause: ZodError) {
    super("입력값이 올바르지 않습니다.");
    this.name = "SongRequestValidationError";
  }
}

export class SongRequestNotFoundError extends Error {
  constructor() {
    super("신청 내역을 찾을 수 없습니다.");
    this.name = "SongRequestNotFoundError";
  }
}

export class SongRequestConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SongRequestConflictError";
  }
}

function coerceFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeForDb(input: RequestCreateOutput) {
  return {
    requesterName: input.requesterName ?? null,
    requestNote: input.requestNote ?? null,
    name: input.name,
    teamName: input.teamName,
    playerName: input.playerName ?? null,
    type: input.type,
    customTypeName: input.type === "CUSTOM" ? (input.customTypeName ?? null) : null,
    assetId: input.assetId,
    status: "PENDING" as const,
    rejectionReason: null
  };
}

export function parseSongRequestSearchParams(searchParams: Record<string, string | string[] | undefined>): SongRequestListQuery {
  const parsed = requestListQuerySchema.safeParse({
    status: coerceFirst(searchParams.status)
  });

  if (!parsed.success) {
    throw new SongRequestValidationError(parsed.error);
  }

  return parsed.data;
}

export function parseSongRequestUrlSearchParams(params: URLSearchParams): SongRequestListQuery {
  const parsed = requestListQuerySchema.safeParse({
    status: params.get("status") ?? undefined
  });

  if (!parsed.success) {
    throw new SongRequestValidationError(parsed.error);
  }

  return parsed.data;
}

export async function listSongRequests(query: SongRequestListQuery) {
  return requestRepo.findManySongRequests(query);
}

export async function createSongRequest(input: unknown) {
  const parsed = requestCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new SongRequestValidationError(parsed.error);
  }

  return requestRepo.createSongRequest(normalizeForDb(parsed.data));
}

export async function reviewSongRequest(id: string, input: unknown) {
  const parsed = requestReviewSchema.safeParse(input);
  if (!parsed.success) {
    throw new SongRequestValidationError(parsed.error);
  }

  const request = await requestRepo.findSongRequestById(id);
  if (!request) {
    throw new SongRequestNotFoundError();
  }

  if (request.status !== "PENDING") {
    throw new SongRequestConflictError("이미 처리된 신청입니다.");
  }

  if (parsed.data.status === "APPROVED") {
    const existingSong = await songRepo.findSongByAssetId(request.assetId);
    if (existingSong) {
      throw new SongRequestConflictError("같은 assetId의 응원가가 이미 등록되어 있습니다.");
    }

    const approved = await requestRepo.approveSongRequest(id);
    if (!approved) {
      throw new SongRequestNotFoundError();
    }

    return approved.request;
  }

  return requestRepo.rejectSongRequest(id, parsed.data.rejectionReason ?? "");
}

export function toSongRequestDto(request: SongRequestRecord): SongRequestDto {
  return {
    ...request,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    reviewedAt: request.reviewedAt ? request.reviewedAt.toISOString() : null
  };
}

export function toSongRequestDtoList(requests: SongRequestRecord[]) {
  return requests.map(toSongRequestDto);
}

