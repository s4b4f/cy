import { z } from "zod";

import { SONG_TYPES } from "@/features/songs/constants";

export const songTypeSchema = z.enum(SONG_TYPES, {
  required_error: "타입을 선택해주세요."
});

export const requiredTrimmedStringSchema = z.string().trim().min(1, "필수 입력입니다.");

export const optionalTrimmedStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value.trim() : ""))
  .transform((value) => (value.length > 0 ? value : undefined));

const assetIdSchema = z
  .union([z.string(), z.number()], { required_error: "assetId는 필수입니다." })
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "assetId는 필수입니다.");

export const songBaseSchema = z.object({
  name: requiredTrimmedStringSchema,
  teamName: requiredTrimmedStringSchema,
  playerName: optionalTrimmedStringSchema,
  type: songTypeSchema,
  customTypeName: optionalTrimmedStringSchema,
  assetId: assetIdSchema
});

export type SongBaseOutput = z.output<typeof songBaseSchema>;

export function refineSongUpsertInput(data: SongBaseOutput, ctx: z.RefinementCtx) {
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
}

export const songUpsertSchema = songBaseSchema.superRefine(refineSongUpsertInput);

export type SongUpsertInput = z.input<typeof songUpsertSchema>;
export type SongUpsertOutput = z.output<typeof songUpsertSchema>;

export const songListQuerySchema = z.object({
  name: optionalTrimmedStringSchema,
  teamName: optionalTrimmedStringSchema,
  playerName: optionalTrimmedStringSchema,
  customTypeName: optionalTrimmedStringSchema,
  type: songTypeSchema.optional()
});

export type SongListQueryInput = z.input<typeof songListQuerySchema>;
export type SongListQueryOutput = z.output<typeof songListQuerySchema>;
