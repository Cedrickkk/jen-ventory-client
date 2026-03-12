import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import { paymentMethodEnum } from "@/features/transactions/schema/transaction";
import z from "zod/v3";

export const debtLedgerTypeEnum = z.enum([
  "DEBT",
  "PAYMENT",
  "CREDIT",
  "CREDIT_USED",
]);

export const debtSchema = z.object({
  customerId: z.number(),
  transactionId: z.number(),
  type: debtLedgerTypeEnum,
  amount: z.number(),
  paymentMethod: paymentMethodEnum,
  notes: z.string().optional(),
});

export const debtResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...debtSchema.shape,
});

export const debtSummaryResponseSchema = z.object({
  totalDebt: z.number(),
  totalCredit: z.number(),
  totalPaid: z.number(),
  creditUsed: z.number(),
  netDebt: z.number(),
  netCredit: z.number(),
});

export type Debt = z.infer<typeof debtResponseSchema>;
export type CreateDebt = z.infer<typeof debtSchema>;
export type PaginatedDebt = Paginated<Debt>;

export type DebtLedgerType = z.infer<typeof debtLedgerTypeEnum>;

export type DebtSummary = z.infer<typeof debtSummaryResponseSchema>;
