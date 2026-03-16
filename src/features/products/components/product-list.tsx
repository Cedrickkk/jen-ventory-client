import ProductCard from "@/features/products/components/product-card";
import type { Product } from "@/features/products/schema/product";
import { useState } from "react";

type ProductListProps = {
  products: Array<Product>;
  renderDialog: (props: {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => React.ReactNode;
};

export default function ProductList({
  products,
  renderDialog,
}: ProductListProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProductId(product.id)}
          />
        ))}
      </div>
      {renderDialog({
        productId: selectedProductId,
        open: selectedProductId !== null,
        onOpenChange: (open) => {
          if (!open) setSelectedProductId(null);
        },
      })}
    </>
  );
}
