export const formatCurrency = (amount: string | null) => {
  if (!amount) return "-";

  return Number(amount).toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
};
