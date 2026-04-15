import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import z from "zod/v3";

export const transactionSchema = z.object({
  customerId: z.number().nullable(),
  representative: z.string().nullable(),
  notes: z.string().nullable(),
  allowDebt: z.boolean().nullable().default(false),
  storeChangeAsCredit: z.boolean().nullable().default(false),
});

export const transactionItemSchema = z.object({
  transactionId: z.number(),
  productVariantId: z.number(),
  quantity: z.number().default(1),
  unitPrice: z.number(),
});

export const transactionItemResponseSchema = z.object({
  ...baseResponseDataSchema.omit({ createdAt: true, updatedAt: true }).shape,
  ...transactionItemSchema.omit({ transactionId: true }).shape,
  productId: z.number(),
  productVariantName: z.string(),
  sku: z.string(),
  subtotal: z.number(),
});

export const paymentMethodEnum = z.enum(["CASH", "GCASH", "CREDIT_USED"]);

export const transactionPaymentSchema = z.object({
  transactionId: z.number(),
  method: paymentMethodEnum,
  amount: z.number(),
});

export const transactionPaymentResponseSchema = z.object({
  ...baseResponseDataSchema.omit({ updatedAt: true }).shape,
  ...transactionPaymentSchema.omit({ transactionId: true }).shape,
});

export const transactionResponseSchema = z.object({
  ...baseResponseDataSchema.omit({ updatedAt: true }).shape,
  ...transactionSchema.pick({
    customerId: true,
    notes: true,
    representative: true,
  }).shape,
  customerName: z.string().nullable(),
  totalAmount: z.number(),
  items: z.array(transactionItemResponseSchema).default([]),
  payments: z.array(transactionPaymentResponseSchema).default([]),
});

export const transactionSummaryResponseSchema = z.object({
  ...baseResponseDataSchema.omit({ updatedAt: true }).shape,
  ...transactionSchema.pick({
    customerId: true,
    representative: true,
  }).shape,
  customerName: z.string().nullable(),
  totalAmount: z.number(),
});

export type Transaction = z.infer<typeof transactionResponseSchema>;
export type CreateTransaction = z.infer<typeof transactionSchema>;
export type PaginatedTransaction = Paginated<Transaction>;

export type TransactionItem = z.infer<typeof transactionItemResponseSchema>;
export type CreateTransactionItem = z.infer<typeof transactionItemSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodEnum>;

export type TransactionPayment = z.infer<
  typeof transactionPaymentResponseSchema
>;

export type TransactionSummary = z.infer<
  typeof transactionSummaryResponseSchema
>;
