import { z } from "zod";

import type { DiscordInteraction, DiscordInteractionOption } from "@/features/discord/types";

export const discordInteractionOptionSchema: z.ZodType<DiscordInteractionOption> = z.lazy(() =>
  z.object({
    name: z.string().min(1),
    type: z.number().int(),
    value: z.union([z.string(), z.number(), z.boolean()]).optional(),
    options: z.array(discordInteractionOptionSchema).optional()
  })
);

export const discordInteractionSchema: z.ZodType<DiscordInteraction> = z.object({
  id: z.string().min(1),
  application_id: z.string().min(1),
  type: z.number().int(),
  data: z
    .object({
      id: z.string().min(1),
      name: z.string().min(1),
      type: z.number().int(),
      options: z.array(discordInteractionOptionSchema).optional()
    })
    .optional(),
  member: z
    .object({
      user: z.object({
        id: z.string().min(1),
        username: z.string().min(1),
        global_name: z.string().nullable().optional()
      })
    })
    .optional(),
  user: z
    .object({
      id: z.string().min(1),
      username: z.string().min(1),
      global_name: z.string().nullable().optional()
    })
    .optional(),
  token: z.string().min(1),
  version: z.number().int()
});
