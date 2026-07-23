import { TransactionDataTable } from "@/features/transactions/components/transaction-data-table";
import { columns } from "@/features/transactions/components/transaction-data-table-columns";
import { useGetAllTransactions } from "@/features/transactions/queries/use-transaction";
import { usePagination } from "@/hooks/use-pagination";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/transactions/")({
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
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["createdAt,desc"],
  });
  const { data: transactions } = useGetAllTransactions(pageParams);

  return (
    <div>
      <TransactionDataTable
        columns={columns}
        data={transactions?.data?.content || []}
        page={transactions?.data?.page}
        currentPage={pageParams.page}
        onPageChange={setPage}
      />
    </div>
  );
}
