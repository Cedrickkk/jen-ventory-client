import ProductVariantCard from "@/features/products/components/product-variant-card";
import { useGetProductVariants } from "@/features/products/queries/use-product";
import { usePagination } from "@/hooks/use-pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProductVariant } from "@/features/products/schema/product";
import type { ReactNode } from "react";

export type ProductVariantDialogProps = {
  productId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renderVariant: (variant: ProductVariant) => ReactNode;
};

export default function ProductVariantDialog({
  productId,
  open,
  onOpenChange,
  renderVariant,
}: ProductVariantDialogProps) {
  const { pageParams } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: productVariants } = useGetProductVariants(
    productId,
    pageParams,
  );

  const variants = productVariants?.data?.content ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-5/6 flex-col gap-0 p-0 md:max-w-5xl">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4">
            Product Variants
          </DialogTitle>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <DialogDescription className="w-full space-y-4 p-4" asChild>
              <div>
                {variants.length === 0 ? (
                  <p className="text-muted-foreground text-center text-sm">
                    No variants found.
                  </p>
                ) : (
                  variants.map((variant) =>
                    renderVariant ? (
                      renderVariant(variant)
                    ) : (
                      <ProductVariantCard key={variant.id} variant={variant} />
                    ),
                  )
                )}
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
          <p>TODO: Pagination will be here.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
