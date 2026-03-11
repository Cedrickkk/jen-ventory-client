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
import CustomerCreateFormSheet from "@/features/customers/components/customer-create-form-sheet";
import { CustomerDataTable } from "@/features/customers/components/customer-data-table";
import { columns } from "@/features/customers/components/customer-data-table-columns";
import {
  customerQueries,
  useGetCustomers,
  useSearchCustomer,
} from "@/features/customers/queries/use-customer";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Upload, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/customers/")({
  head: () => ({
    meta: [
      {
        title: "Customers - JenVentory",
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      customerQueries.list({
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
  const [searchQuery, setSearchQuery] = useState("");
  const { pageParams, setPage, setSize } = usePagination({
    initialSize: 5,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: customers } = useGetCustomers(pageParams);
  const { data: searchResult, isFetching: isSearchFetching } =
    useSearchCustomer(searchQuery.toLowerCase());
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
                className="size-4 cursor-pointer"
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
      <CustomerDataTable
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
