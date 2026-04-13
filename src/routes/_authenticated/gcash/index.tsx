import { columns } from "@/features/gcash/components/gcash-data-table-columns";
import { GCashFeeTiersTable } from "@/features/gcash/components/gcash-fee-tiers-table";
import { GCashServiceLogsDataTable } from "@/features/gcash/components/gcash-service-logs-data-table";
import {
  useGetGCashFeeTiers,
  useGetGCashServiceLogs,
} from "@/features/gcash/queries/use-gcash";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";

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
  const { data: tiers } = useGetGCashFeeTiers();
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: gcashServiceLogs } = useGetGCashServiceLogs();

  return (
    <div>
      <GCashFeeTiersTable tiers={tiers?.data || []} />
      <GCashServiceLogsDataTable
        columns={columns}
        data={gcashServiceLogs?.data?.content || []}
        currentPage={pageParams.page}
        onPageChange={setPage}
      />
    </div>
  );
}
