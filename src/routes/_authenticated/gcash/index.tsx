import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { columns } from "@/features/gcash/components/gcash-data-table-columns";
import { GCashFeeTiersTable } from "@/features/gcash/components/gcash-fee-tiers-table";
import { GCashServiceLogsDataTable } from "@/features/gcash/components/gcash-service-logs-data-table";
import {
  useGetGCashFeeTiers,
  useGetGCashServiceLogs,
  useSearchGCashServiceLog,
} from "@/features/gcash/queries/use-gcash";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/_authenticated/gcash/")({
  head: () => ({
    meta: [
      {
        title: "GCash - JenVentory",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  );
  const { data: tiers } = useGetGCashFeeTiers();
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["createdAt,desc"],
  });
  const { data: gcashServiceLogs } = useGetGCashServiceLogs(pageParams);
  const { data: searchResult, isFetching: isSearchFetching } =
    useSearchGCashServiceLog(searchQuery.toLowerCase());
  const isSearching = searchQuery.length >= 3;
  return (
    <div className="space-y-6">
      <InputGroup className="md:max-w-2xl">
        <InputGroupInput
          placeholder="Search name or phone no."
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
      <GCashServiceLogsDataTable
        columns={columns}
        data={
          isSearching
            ? searchResult?.data?.content || []
            : gcashServiceLogs?.data?.content || []
        }
        isLoading={isSearchFetching}
        page={isSearching ? undefined : gcashServiceLogs?.data?.page}
        currentPage={pageParams.page}
        onPageChange={setPage}
      />
      <GCashFeeTiersTable tiers={tiers?.data || []} />
    </div>
  );
}
