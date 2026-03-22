export const formatCurrency = (amount: string | null) => {
  if (
    amount === null ||
    amount === undefined ||
    amount === "" ||
    amount === "null" ||
    amount === "undefined" ||
    isNaN(Number(amount))
  ) {
    return "₱0.00";
  }

  return Number(amount).toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });
};
