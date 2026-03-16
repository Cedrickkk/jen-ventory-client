import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useCartActions,
  useCartCount,
  useCartTotal,
} from "@/features/pos/store/selectors/cart-selector";
import { formatCurrency } from "@/lib/currency";

export default function CartSummary() {
  const total = useCartTotal();
  const count = useCartCount();
  const { clearCart } = useCartActions();

  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Items</p>
        <p className="text-sm font-medium tabular-nums">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Total</p>
        <p className="text-xl font-bold tabular-nums">
          {formatCurrency(String(total))}
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button className="w-full" size="lg" disabled={count === 0}>
          Charge {count > 0 && formatCurrency(String(total))}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          size="lg"
          disabled={count === 0}
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
