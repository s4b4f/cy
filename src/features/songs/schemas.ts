import { z } from "zod";

import { SONG_TYPES } from "@/features/songs/constants";

export const songTypeSchema = z.enum(SONG_TYPES, {
  required_error: "타입을 선택해주세요."
});

const requiredTrimmedString = z.string().trim().min(1, "필수 입력입니다.");

const optionalTrimmedString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value.trim() : ""))
  .transform((value) => (value.length > 0 ? value : undefined));

const assetIdSchema = z
  .union([z.string(), z.number()], { required_error: "assetId는 필수입니다." })
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "assetId는 필수입니다.");

export const songUpsertSchema = z
  .object({
    name: requiredTrimmedString,
    teamName: requiredTrimmedString,
    playerName: optionalTrimmedString,
    type: songTypeSchema,
    customTypeName: optionalTrimmedString,
    assetId: assetIdSchema
  })
  .superRefine((data, ctx) => {
    if (data.type === "PLAYER" && !data.playerName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["playerName"],
        message: "선수 타입은 선수 이름이 필요합니다."
      });
    }
    if (data.type === "CUSTOM" && !data.customTypeName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customTypeName"],
        message: "커스텀 타입은 기타 타입 이름이 필요합니다."
      });
    }
  });

export type SongUpsertInput = z.input<typeof songUpsertSchema>;
export type SongUpsertOutput = z.output<typeof songUpsertSchema>;

export const songListQuerySchema = z.object({
  name: optionalTrimmedString,
  teamName: optionalTrimmedString,
  playerName: optionalTrimmedString,
  customTypeName: optionalTrimmedString,
  type: songTypeSchema.optional()
});

export type SongListQueryInput = z.input<typeof songListQuerySchema>;
export type SongListQueryOutput = z.output<typeof songListQuerySchema>;

