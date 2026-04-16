import { ProductVariantDataTable } from "@/features/products/components/tables/product-variant-data-table";
import { columns as variantColumns } from "@/features/products/components/tables/product-variant-data-table-columns";
import {
  useGetProductById,
  useGetProductVariants,
} from "@/features/products/queries/use-product";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductVariantCreateFormSheet from "@/features/products/components/forms/product-variant-create-form-sheet";
import { Link } from "@tanstack/react-router";
import { formatDate } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/products/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const id = Number(productId);
  const { data: productRes } = useGetProductById(id);
  const product = productRes?.data;

  // Pagination for variants
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc"],
  });
  const { data: variantsRes, isLoading: isVariantsLoading } =
    useGetProductVariants(id, pageParams);
  const variants = variantsRes?.data?.content ?? [];
  const page = variantsRes?.data?.page;
  const currentPage = page?.number ? page.number + 1 : 1;
  const totalAvailableStocks = useMemo(
    () =>
      variantsRes?.data?.content?.reduce(
        (sum, v) => sum + (v.stockQuantity ?? 0),
        0,
      ) ?? 0,
    [variantsRes?.data?.content],
  );
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" asChild size="icon-lg">
          <Link to="/products">
            <ArrowLeft />
          </Link>
        </Button>
        <ProductVariantCreateFormSheet id={Number(productId)} />
      </div>

      {product && (
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex justify-between gap-9">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/images/${product.image}`}
              alt={product.name}
              className="w-full max-w-md rounded-xl object-cover"
            />

            <div className="flex w-full flex-col gap-4 md:min-w-1/2">
              <div>
                <Badge variant={product.active ? "secondary" : "outline"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h1 className="text-3xl leading-tight font-bold">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-muted-foreground max-w-xl text-base">
                  {product.description}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-1">
                <div className="text-muted-foreground text-sm">
                  <span className="font-medium">Added on:</span>{" "}
                  {formatDate(product.createdAt, "MMM d, yyyy h:mm a")}
                </div>
                <div className="text-muted-foreground text-sm">
                  <span className="font-medium">Variants:</span>{" "}
                  {product.variantCount}
                </div>
                <div className="text-muted-foreground text-sm">
                  <span className="font-medium">Available Stocks:</span>{" "}
                  {totalAvailableStocks}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductVariantDataTable
        columns={variantColumns}
        data={variants}
        page={page}
        currentPage={currentPage}
        onPageChange={setPage}
        isLoading={isVariantsLoading}
      />
    </div>
  );
}
