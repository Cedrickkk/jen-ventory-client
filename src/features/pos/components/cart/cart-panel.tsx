import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CartItemRow from "@/features/pos/components/cart/cart-item-row";
import CustomerSelector from "@/features/pos/components/customer/customer-selector";
import {
  useCartCount,
  useCartItems,
} from "@/features/pos/store/selectors/cart-selector";
import { ShoppingCart } from "lucide-react";

export default function CartPanel() {
  const items = useCartItems();
  const count = useCartCount();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-12 items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="text-primary size-5" />
            {count > 0 && (
              <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
                {count}
              </Badge>
            )}
          </div>
          <h2 className="text-base font-semibold">Cart</h2>
        </div>
        <CustomerSelector />
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
            <ShoppingCart className="text-muted-foreground/40 size-10" />
            <p className="text-muted-foreground text-sm">Cart is empty</p>
            <p className="text-muted-foreground/60 text-xs">
              Add items to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y pr-3">
              {items.map((item) => (
                <div className="mt-5 first:mt-0">
                  <CartItemRow key={item.variantId} item={item} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Cart summary will be here */}
    </div>
  );
}
