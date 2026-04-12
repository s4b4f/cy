import type { SongRequest } from "@prisma/client";

import type { REQUEST_STATUSES } from "@/features/requests/constants";

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type SongRequestRecord = SongRequest;

export type SongRequestDto = Omit<SongRequestRecord, "createdAt" | "updatedAt" | "reviewedAt"> & {
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
};

export type SongRequestListQuery = {
  status?: RequestStatus;
};

