import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomerCreateFormSheet from "@/features/customers/components/forms/customer-create-form-sheet";
import { ProductDataTable } from "@/features/products/components/tables/product-data-table";
import { columns } from "@/features/products/components/tables/product-data-table-columns";
import {
  productQueries,
  useGetProducts,
  useSearchProduct,
} from "@/features/products/queries/use-product";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Upload, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/_authenticated/products/")({
  head: () => ({
    meta: [
      {
        title: "Products - JenVentory",
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      productQueries.list({
        page: 1,
        size: 5,
        sort: ["id,asc"],
      }),
    );
  },
  component: RouteComponent,
});

const ROWS_PER_PAGE = [5, 10, 20, 30];

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  );
  const { pageParams, setPage, setSize } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: customers } = useGetProducts(pageParams);
  const { data: searchResult, isFetching: isSearchFetching } = useSearchProduct(
    searchQuery.toLowerCase(),
  );
  const isSearching = searchQuery.length >= 3;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 py-6 max-sm:flex-col sm:items-center sm:justify-between">
        <InputGroup className="max-w-md">
          <InputGroupInput
            placeholder="Search..."
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
        <div className="flex flex-wrap items-center gap-4 sm:justify-between">
          <Select
            defaultValue="5"
            value={String(pageParams.size)}
            onValueChange={(value) => setSize(Number(value))}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue defaultValue={pageParams.size} defaultChecked />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectGroup>
                {ROWS_PER_PAGE.map((row) => {
                  return (
                    <SelectItem key={row} value={String(row)}>
                      {row || 5}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            className="bg-primary/10 hover:bg-primary/20 cursor-pointer"
          >
            <Upload />
            Export
          </Button>
          <CustomerCreateFormSheet />
        </div>
      </div>
      <ProductDataTable
        columns={columns}
        data={
          isSearching
            ? searchResult?.data || []
            : customers?.data?.content || []
        }
        isLoading={isSearchFetching}
        page={isSearching ? undefined : customers?.data?.page}
        currentPage={pageParams.page}
        onPageChange={setPage}
      />
    </div>
  );
}
