import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import z from "zod/v3";

export const transactionSchema = z.object({
  customerId: z.string().optional(),
  representative: z.string().optional(),
  notes: z.string().optional(),
  allowDebt: z.boolean().optional().default(false),
  storeChangeAsCredit: z.boolean().optional().default(false),
});

export const transactionItemSchema = z.object({
  transactionId: z.number(),
  productVariantId: z.number(),
  quantity: z.number().default(1),
  unitPrice: z.number(),
});

export const transactionItemResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...transactionItemSchema.omit({ transactionId: true }).shape,
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
  ...baseResponseDataSchema.shape,
  ...transactionPaymentSchema.omit({ transactionId: true }).shape,
});

export const transactionResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...transactionSchema.pick({
    customerId: true,
    notes: true,
    representative: true,
  }).shape,
  customerName: z.string().optional(),
  totalAmount: z.number(),
  items: z.array(transactionItemResponseSchema).default([]),
  payments: z.array(transactionPaymentResponseSchema).default([]),
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
