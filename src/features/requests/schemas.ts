import { z } from "zod";

import { REQUEST_STATUSES } from "@/features/requests/constants";
import { optionalTrimmedStringSchema, refineSongUpsertInput, songBaseSchema } from "@/features/songs/schemas";

export const requestStatusSchema = z.enum(REQUEST_STATUSES);

export const requestCreateSchema = songBaseSchema
  .extend({
    requesterName: optionalTrimmedStringSchema,
    requestNote: optionalTrimmedStringSchema
  })
  .superRefine((data, ctx) => {
    refineSongUpsertInput(data, ctx);

    if (data.requestNote && data.requestNote.length > 500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requestNote"],
        message: "요청 메모는 500자 이하로 입력해주세요."
      });
    }
  });

export const requestListQuerySchema = z.object({
  status: requestStatusSchema.optional()
});

export const requestReviewSchema = z
  .object({
    status: requestStatusSchema,
    rejectionReason: optionalTrimmedStringSchema
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionReason"],
        message: "반려 사유를 입력해주세요."
      });
    }

    if (data.status === "APPROVED" && data.rejectionReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rejectionReason"],
        message: "승인 시 반려 사유는 비워주세요."
      });
    }

    if (data.status === "PENDING") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["status"],
        message: "관리자는 승인 또는 반려만 처리할 수 있습니다."
      });
    }
  });

export type RequestCreateOutput = z.output<typeof requestCreateSchema>;
export type RequestReviewOutput = z.output<typeof requestReviewSchema>;
