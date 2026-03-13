import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import {
  useCartActions,
  useCartCount,
  useCartItems,
  useCartTotal,
} from "@/features/pos/store/selectors/cart-selector";
import ProductList from "@/features/products/components/product-list";
import {
  useGetProducts,
  useSearchProduct,
} from "@/features/products/queries/use-product";
import { getPageNumbers, usePagination } from "@/hooks/use-pagination";
import { formatCurrency } from "@/lib/currency";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Search, ShoppingCart, Trash2 } from "lucide-react";
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

  const items = useCartItems();
  const total = useCartTotal();
  const cartCount = useCartCount();
  const { increment, decrement } = useCartActions();

  return (
    <div>
      <Separator className="mb-6" />
      <div className="grid min-h-screen items-start gap-8 lg:grid-cols-[2fr_auto_1fr]">
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
                <ProductList products={searchResult?.data || []} />
              ) : (
                <ProductList products={products} />
              )}
            </div>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="mx-4 hidden h-full lg:block"
        />
        <div className="min-h-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="text-primary" />
                <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 tabular-nums">
                  {cartCount}
                </Badge>
              </div>
            </div>
            <Button variant="destructive">Clear Cart</Button>
          </div>
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const subtotal = item.quantity * item.unitPrice;
              return (
                <div
                  key={item.variantId}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                >
                  <div className="text-muted-foreground text-sm">
                    <div>SKU: {item.sku}</div>
                    <div>QTY: {item.quantity}</div>
                    <div>Subtotal: {formatCurrency(String(subtotal))}</div>
                  </div>
                  <ButtonGroup>
                    <Button
                      onClick={() => decrement(item.variantId)}
                      size="icon-lg"
                      variant="outline"
                    >
                      -
                    </Button>
                    <Button size="icon-lg" variant="outline">
                      {item.quantity}
                    </Button>
                    <Button
                      onClick={() => increment(item.variantId)}
                      size="icon-lg"
                      variant="outline"
                    >
                      +
                    </Button>
                  </ButtonGroup>
                  <Button variant="ghost" size="icon-lg">
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
          <p>TOTAL: {formatCurrency(String(total))}</p>
        </div>
      </div>
    </div>
  );
}
