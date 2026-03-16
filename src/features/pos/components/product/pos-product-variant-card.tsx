import { Button } from "@/components/ui/button";
import {
  useCartActions,
  useIsInCart,
  useItemQuantity,
} from "@/features/pos/store/selectors/cart-selector";
import ProductVariantCard from "@/features/products/components/product-variant-card";
import type { ProductVariant } from "@/features/products/schema/product";
import { ShoppingCart } from "lucide-react";

type PosProductVariantCardProps = {
  variant: ProductVariant;
};

export default function PosProductVariantCard({
  variant,
}: PosProductVariantCardProps) {
  const { add, increment } = useCartActions();
  const quantity = useItemQuantity(variant.id);
  const isInCart = useIsInCart(variant.id);
  const isOutOfStock = quantity >= (variant.stockQuantity ?? 0);

  const handleAdd = () => {
    if (isOutOfStock) return;

    if (quantity === 0) {
      add({
        variantId: variant.id,
        productName: variant.productName,
        sku: variant.sku,
        size: variant.size ?? null,
        flavor: variant.flavor ?? null,
        packaging: variant.packaging ?? null,
        unitPrice: variant.price,
        quantity: 1,
        stockQuantity: variant.stockQuantity ?? 0,
      });
    } else {
      increment(variant.id);
    }
  };

  return (
    <ProductVariantCard
      variant={variant}
      actionSlot={
        <Button
          onClick={handleAdd}
          disabled={isOutOfStock}
          variant={isInCart ? "secondary" : "default"}
        >
          {isInCart ? (
            "Already in cart"
          ) : (
            <>
              <ShoppingCart size={16} /> Add to cart
            </>
          )}
        </Button>
      }
    />
  );
}
