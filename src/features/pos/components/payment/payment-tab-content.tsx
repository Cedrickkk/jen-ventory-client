import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PaymentForm from "@/features/pos/components/payment/payment-form";
import PaymentSummary from "@/features/pos/components/payment/payment-summary";
import TransactionOptions from "@/features/pos/components/payment/transaction-option";
import { useCartItems } from "@/features/pos/store/selectors/cart-selector";
import { useCanSubmit } from "@/features/pos/store/selectors/ui-selector";
import { useCreatePosTransaction } from "@/features/transactions/queries/use-transaction";
import { CheckIcon, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function PaymentTabContent() {
  const items = useCartItems();

  const { mutateAsync: createPosTransactionAsync, isPending } =
    useCreatePosTransaction();
  const canSubmit = useCanSubmit();

  const handleSubmit = async () => {
    await createPosTransactionAsync(null, {
      onSuccess: () => {
        toast.custom(() => (
          <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
            <CheckIcon />
            <AlertTitle>Transaction created!</AlertTitle>
          </Alert>
        ));
      },
    });
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={!canSubmit || isPending}>Submit Transaction</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will finalize the transaction and clear the cart. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
