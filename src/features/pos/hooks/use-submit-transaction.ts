import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import { paymentMethodSchema } from "@/features/pos/store/slices/payment-slice";
import { useAppStore } from "@/features/pos/store/store";
import {
  transactionResponseSchema,
  type Transaction,
} from "@/features/transactions/schema/transaction";
import { api } from "@/lib/api";
import axios from "axios";
import z from "zod/v3";

const submitPayloadSchema = z
  .object({
    customerId: z.number().int().positive().nullable(),
    representative: z.string().min(1).nullable(),
    notes: z.string().nullable(),
    allowDebt: z.boolean(),
    storeChangeAsCredit: z.boolean(),
    items: z
      .array(
        z.object({
          productVariantId: z.number().int().positive(),
          quantity: z.number().int().min(1),
        }),
      )
      .min(1, "Cart must not be empty"),
    payments: z.array(
      z.object({
        paymentMethod: paymentMethodSchema,
        amount: z.number().positive(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // Walk-in requires a representative name -> "Walk-in"
    if (data.customerId === null && !data.representative) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["representative"],
        message: "Representative name is required for walk-in customers",
      });
    }

    // Walk-in cannot have debt -> debt is tied to an account
    if (data.customerId === null && data.allowDebt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allowDebt"],
        message: "Walk-in customers cannot carry debt",
      });
    }

    if (data.payments.length === 0) {
      if (!data.allowDebt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payments"],
          message: "At least one payment entry is required",
        });
      }
      if (data.customerId === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payments"],
          message: "Walk-in customers must provide payment",
        });
      }
    }
  });

export const useSubmitTransaction = () => {
  return async (notes: string | null = null) => {
    const s = useAppStore.getState();

    const payloadResult = submitPayloadSchema.safeParse({
      customerId: s.selectedCustomer?.id ?? null,
      representative: s.representativeName || null,
      notes,
      allowDebt: s.allowDebt,
      storeChangeAsCredit: s.storeChangeAsCredit,
      items: s.items.map((i) => ({
        productVariantId: i.variantId,
        quantity: i.quantity,
      })),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      payments: s.payments.map(({ id: _id, ...rest }) => rest),
    });

    if (!payloadResult.success) {
      console.error("Payload validation failed", payloadResult.error.flatten());
      return;
    }

    try {
      s.setSubmitting(true);

      const response = await api.post<SuccessApiResponse<Transaction>>(
        `/transactions`,
        payloadResult.data,
      );

      const tx = transactionResponseSchema.parse(response.data.data);

      s.setLastTransaction(tx);
      useAppStore.getState().resetPOS();

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorApiResponse;
      }
      throw error;
    } finally {
      s.setSubmitting(false);
    }
  };
};
