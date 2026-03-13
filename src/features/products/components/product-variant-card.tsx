import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCartActions,
  useIsInCart,
  useItemQuantity,
} from "@/features/pos/store/selectors/cart-selector";
import type { ProductVariant } from "@/features/products/schema/product";
import { formatCurrency } from "@/lib/currency";
import { ShoppingCart } from "lucide-react";

type ProductVariantCardProps = {
  variant: ProductVariant;
};

export default function ProductVariantCard({
  variant,
}: ProductVariantCardProps) {
  const { add, increment } = useCartActions();
  const quantity = useItemQuantity(variant.id);
  const isItemInCart = useIsInCart(variant.id);

  const handleAdd = () => {
    if (quantity === 0) {
      add({
        variantId: variant.id,
        sku: variant.sku,
        size: variant.size || "",
        flavor: variant.flavor || "",
        packaging: variant.packaging || "",
        unitPrice: variant.price,
        quantity: 1,
      });
    } else {
      increment(variant.id);
    }
  };

  return (
    <Card className="w-full flex-row items-center gap-4 rounded-md p-4">
      <div className="max-w-35 min-w-35">
        <img
          src="https://placehold.co/600x400"
          alt="Product"
          className="h-30 w-full rounded object-cover"
        />
      </div>
      <CardContent className="flex-1 p-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">SKU: {variant.sku}</div>
            <div className="mt-1 text-2xl font-bold">
              {formatCurrency(String(variant.price))}
            </div>
            <div className="text-muted-foreground mt-2 text-sm">
              {variant.size && <div>Size: {variant.size}</div>}
              {variant.flavor && <div>Flavor: {variant.flavor}</div>}
              {variant.packaging && <div>Packaging: {variant.packaging}</div>}
              {variant.stockQuantity && (
                <div>Stocks: {variant.stockQuantity}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className="cursor-pointer"
              onClick={handleAdd}
              variant={isItemInCart ? "secondary" : "default"}
            >
              {isItemInCart ? (
                <span> Already in cart</span>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to cart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
