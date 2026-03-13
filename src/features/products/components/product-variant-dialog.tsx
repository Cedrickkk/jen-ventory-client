import { usePagination } from "@/hooks/use-pagination";
import { useGetProductVariants } from "../queries/use-product";
import ProductVariantCard from "./product-variant-card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProductVariantDialogProps = {
  productId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProductVariantDialog({
  productId,
  open,
  onOpenChange,
}: ProductVariantDialogProps) {
  const { pageParams } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: productVariants } = useGetProductVariants(
    productId,
    pageParams,
  );

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
                {productVariants?.data?.content.map((variant) => {
                  return (
                    <ProductVariantCard key={variant.id} variant={variant} />
                  );
                })}
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
