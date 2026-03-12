import { columns } from "@/features/customers/components/tables/customer-debt-history-data-table-columns";
import { useGetCustomerDebtHistory } from "@/features/customers/queries/use-customer";
import { DataTable } from "@/features/shared/data-table";
import { usePagination } from "@/hooks/use-pagination";

type CustomerDebtHistoryDataTableProps = {
  customerId: number;
};

export default function CustomerDebtHistoryDataTable({
  customerId,
}: CustomerDebtHistoryDataTableProps) {
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: debtHistory } = useGetCustomerDebtHistory(customerId);

  return (
    <div>
      <DataTable
        title="Debt History"
        description="Lorem ipsum dolor sit amet consectetur."
        columns={columns}
        data={debtHistory?.data?.content || []}
        page={debtHistory?.data?.page}
        currentPage={pageParams.page}
        onPageChange={setPage}
      />
    </div>
  );
}
