import { Card, CardContent } from "@/components/ui/card";
import type { ProductVariant } from "@/features/products/schema/product";
import { formatCurrency } from "@/lib/currency";
import type { ReactNode } from "react";

type ProductVariantCardProps = {
  variant: ProductVariant;
  actionSlot?: ReactNode;
};

export default function ProductVariantCard({
  variant,
  actionSlot,
}: ProductVariantCardProps) {
  return (
    <Card className="w-full flex-row items-center gap-4 rounded-md p-4">
      <div className="max-w-35 min-w-35">
        <img
          src="/IMG-3545-1-600x631.jpg"
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
          {actionSlot}
        </div>
      </CardContent>
    </Card>
  );
}
