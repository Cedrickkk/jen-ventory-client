import type { CustomerTransaction } from "@/features/customers/schema/customer";

export const getStatus = (transaction: CustomerTransaction) => {
  if ((transaction.debtAmount ?? 0) > 0)
    return { label: "May Utang", color: "text-red-500" };
  if ((transaction.creditAmount ?? 0) > 0)
    return { label: "May Credit", color: "text-blue-500" };
  return { label: "Paid", color: "text-green-500" };
};
