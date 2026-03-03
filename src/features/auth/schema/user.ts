import { baseResponseDataSchema } from "@/features/response/schema/response";
import z from "zod/v3";

export const userSchema = z.object({
  ...baseResponseDataSchema.shape,
  name: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^09\d{9}$/),
  address: z.string(),
});

export type User = z.infer<typeof userSchema>;
