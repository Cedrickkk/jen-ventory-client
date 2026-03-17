import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import CartPanel from "@/features/pos/components/cart/cart-panel";
import PosProductVariantDialog from "@/features/pos/components/product/pos-product-variant-dialog";
import ProductList from "@/features/products/components/product-list";
import {
  useGetProducts,
  useSearchProduct,
} from "@/features/products/queries/use-product";
import { getPageNumbers, usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Search, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/_authenticated/pos/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  );
  const { pageParams, setPage } = usePagination({
    initialSize: 20,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: _products } = useGetProducts(pageParams);
  const { data: searchResult, isFetching: isSearchFetching } = useSearchProduct(
    searchQuery.toLowerCase(),
  );
  const products = _products?.data?.content || [];
  const totalPages = _products?.data?.page?.totalPages ?? 1;
  const currentPage = pageParams.page;
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const isSearching = searchQuery.length >= 3;

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div>
      <Separator className="mb-6" />
      <div className="grid h-[calc(100vh-8rem)] items-start gap-8 lg:grid-cols-[2fr_auto_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <PageHeader
              title="Cashier"
              description="Lorem ipsum dolor sit, amet consectetur."
            />
            <div className="flex items-center gap-2">
              <InputGroup className="md:max-w-2xl">
                <InputGroupInput
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                {searchQuery && (
                  <InputGroupAddon align="inline-end">
                    <X
                      onClick={() => setSearchQuery("")}
                      className="size-3.5 cursor-pointer"
                      type="button"
                    />
                  </InputGroupAddon>
                )}
              </InputGroup>
              <Button>Utang</Button>
              <Button>GCash</Button>
            </div>
          </div>
          <div className="relative">
            <Pagination className="my-10 flex justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {pageNumbers.map((pageNum, i) =>
                  pageNum === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={pageNum === currentPage}
                        onClick={() => onPageChange(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex h-200 flex-col overflow-y-auto">
              {isSearching && isSearchFetching ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <LoaderCircle className="text-muted-foreground size-8 animate-spin" />
                </div>
              ) : null}
              {isSearching ? (
                <ProductList
                  products={searchResult?.data || []}
                  renderDialog={(props) => (
                    <PosProductVariantDialog {...props} />
                  )}
                />
              ) : (
                <ProductList
                  products={products}
                  renderDialog={(props) => (
                    <PosProductVariantDialog {...props} />
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="mx-4 hidden h-full lg:block"
        />
        <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-hidden">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}
