import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import z from "zod/v3";

export const gCashTransactionTypeEnum = z.enum(["CASH_IN", "CASH_OUT"]);

export const gCashFeeTierSchema = z.object({
  minimumAmount: z.number().min(1, { message: "Minimum amount is required." }),
  maximumAmount: z.number().min(1, { message: "Maximum amount is required" }),
  fee: z.number().min(1, { message: "Fee is required." }),
});

export const gCashFeeTierResponseSchema = z.object({
  ...baseResponseDataSchema.pick({ id: true }).shape,
  ...gCashFeeTierSchema.shape,
});

export const gCashServiceLogSchema = z.object({
  serviceType: gCashTransactionTypeEnum,
  amount: z.number(),
  representativeName: z.string().optional(),
  representativePhone: z.string().regex(/^09\d{9}$/),
  customerId: z.string().optional(),
  notes: z.string().optional(),
});

export const gCashServiceLogResponseSchema = z.object({
  ...baseResponseDataSchema.pick({ id: true, createdAt: true }).shape,
  ...gCashServiceLogSchema.shape,
  customerName: z.string(),
  fee: z.number(),
});

export type GCashFeeTier = z.infer<typeof gCashFeeTierResponseSchema>;
export type CreateGCashFeeTier = z.infer<typeof gCashFeeTierSchema>;

export type GCashServiceLog = z.infer<typeof gCashServiceLogResponseSchema>;
export type CreateGCashServiceLog = z.infer<typeof gCashServiceLogSchema>;
export type PaginatedGCashServiceLog = Paginated<GCashServiceLog>;

export type GCashTransactionType = z.infer<typeof gCashTransactionTypeEnum>;
