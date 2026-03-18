import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CartItemRow from "@/features/pos/components/cart/cart-item-row";
import { useCartItems } from "@/features/pos/store/selectors/cart-selector";
import { ShoppingCart } from "lucide-react";

export default function CartTabContent() {
  const items = useCartItems();

  return (
    <div className="flex h-full flex-col gap-4">
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
                <div className="mt-5 first:mt-0" key={item.variantId}>
                  <CartItemRow item={item} />
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
