import ProductCard from "@/features/products/components/product-card";
import type { Product } from "@/features/products/schema/product";
import { useState } from "react";
import ProductVariantDialog from "./product-variant-dialog";

type ProductListProps = {
  products: Array<Product>;
};

export default function ProductList({ products }: ProductListProps) {
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
      <ProductVariantDialog
        productId={selectedProductId}
        open={selectedProductId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProductId(null);
        }}
      />
    </>
  );
}
