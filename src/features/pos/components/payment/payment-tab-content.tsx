import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PaymentForm from "@/features/pos/components/payment/payment-form";
import PaymentSummary from "@/features/pos/components/payment/payment-summary";
import TransactionOptions from "@/features/pos/components/payment/transaction-option";
import { useSubmitTransaction } from "@/features/pos/hooks/use-submit-transaction";
import { useCartItems } from "@/features/pos/store/selectors/cart-selector";
import {
  useCanSubmit,
  useIsSubmitting,
} from "@/features/pos/store/selectors/ui-selector";
import {
  CheckIcon,
  LoaderCircle,
  ShoppingCart,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentTabContent() {
  const items = useCartItems();

  const submitTransaction = useSubmitTransaction();
  const canSubmit = useCanSubmit();
  const isSubmitting = useIsSubmitting();

  const handleSubmit = async () => {
    try {
      await submitTransaction(null);
      toast.custom(() => (
        <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
          <CheckIcon />
          <AlertTitle>Transaction has been successful.</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      toast.custom(() => (
        <Alert className="bg-destructive dark:bg-destructive/60 border-none text-white">
          <TriangleAlertIcon />
          <AlertTitle>Couldn&apos;t save changes</AlertTitle>
          <AlertDescription className="text-white/80">
            {error
              ? String(error)
              : "Something went wrong. Please contact support."}
          </AlertDescription>
        </Alert>
      ));
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
            <ShoppingCart className="text-muted-foreground/40 size-10" />
            <p className="text-muted-foreground text-sm">Cart is empty</p>
            <p className="text-muted-foreground/60 text-xs">
              Add items to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <TransactionOptions />
      <Separator />
      <PaymentForm />
      <PaymentSummary />
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Submit Transaction"
        )}
      </Button>
    </div>
  );
}
