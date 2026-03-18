import type { PageParamsSchema } from "@/features/api/schema/pagination";
import { customerQueries } from "@/features/customers/queries/use-customer";
import { paymentMethodSchema } from "@/features/pos/store/slices/payment-slice";
import { useAppStore } from "@/features/pos/store/store";
import { productQueries } from "@/features/products/queries/use-product";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from "@/features/transactions/api/transaction-api";
import { transactionResponseSchema } from "@/features/transactions/schema/transaction";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod/v3";

export const transactionQueries = {
  all: () => ["transactions"] as const,
  lists: () => [...transactionQueries.all(), "list"] as const,
  list: (params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: [...transactionQueries.lists(), params],
      queryFn: () => getAllTransactions(params),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
  },
  details: () => [...transactionQueries.all(), "detail"] as const,
  detail: (id: number) => {
    return queryOptions({
      queryKey: [...transactionQueries.details(), id],
      queryFn: () => getTransactionById(id),
    });
  },
};

export const useGetAllTransactions = (pageParams?: PageParamsSchema) => {
  return useQuery(transactionQueries.list(pageParams));
};

export const useGetTransactionById = (id: number) => {
  return useQuery(transactionQueries.detail(id));
};

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

export const useCreatePosTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notes: string | null = null) => {
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
        throw payloadResult.error;
      }

      const response = await createTransaction(payloadResult.data);
      return transactionResponseSchema.parse(response?.data);
    },
    onMutate: () => {
      useAppStore.getState().setSubmitting(true);
    },
    onSuccess: (data) => {
      const s = useAppStore.getState();
      const customerId = s.selectedCustomer?.id ?? null;

      s.setLastTransaction(data);
      useAppStore.getState().resetPOS();

      if (customerId !== null) {
        queryClient.invalidateQueries({
          queryKey: customerQueries.detail(customerId).queryKey,
        });
      }

      queryClient.invalidateQueries({
        queryKey: productQueries.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: transactionQueries.lists(),
      });
    },
    onError: (error) => {
      console.error("Transaction failed", error);
    },
    onSettled: () => {
      useAppStore.getState().setSubmitting(false);
    },
  });
};
