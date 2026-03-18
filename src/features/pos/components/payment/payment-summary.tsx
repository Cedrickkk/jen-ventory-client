import { Button } from "@/components/ui/button";
import {
  usePaymentActions,
  usePayments,
  usePaymentStatus,
} from "@/features/pos/store/selectors/payment-selector";
import { formatCurrency } from "@/lib/currency";
import { Trash2 } from "lucide-react";

export default function PaymentSummary() {
  const { totalAmount, totalPaid, difference, isDebt, isOverPaid, isExactPay } =
    usePaymentStatus();
  const payments = usePayments();
  const { remove } = usePaymentActions();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">
              {payment.paymentMethod}
            </span>
            <div className="flex items-center gap-2">
              <span>{formatCurrency(String(payment.amount))}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(payment.id)}
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <span>{formatCurrency(String(totalAmount))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Paid</span>
          <span>{formatCurrency(String(totalPaid))}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>
            {isDebt && "Remaining Balance"}
            {isOverPaid && "Change"}
            {isExactPay && "Balance"}
          </span>
          <span
            className={
              isDebt
                ? "text-destructive"
                : isOverPaid
                  ? "text-green-600"
                  : "text-green-600"
            }
          >
            {formatCurrency(String(Math.abs(difference)))}
          </span>
        </div>
      </div>
    </div>
  );
}
