import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().trim().min(1, "비밀번호를 입력해주세요."),
  next: z.string().trim().optional()
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

