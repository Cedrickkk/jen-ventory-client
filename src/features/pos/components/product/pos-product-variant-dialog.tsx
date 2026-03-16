import PosProductVariantCard from "@/features/pos/components/product/pos-product-variant-card";
import ProductVariantDialog, {
  type ProductVariantDialogProps,
} from "@/features/products/components/product-variant-dialog";

type PosProductVariantDialogProps = Omit<
  ProductVariantDialogProps,
  "renderVariant"
>;

export default function PosProductVariantDialog(
  props: PosProductVariantDialogProps,
) {
  return (
    <ProductVariantDialog
      {...props}
      renderVariant={(variant) => (
        <PosProductVariantCard key={variant.id} variant={variant} />
      )}
    />
  );
}
