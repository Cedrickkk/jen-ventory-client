import { columns } from "@/features/customers/components/tables/customer-gcash-history-data-table-columns";
import { useGetCustomerGCashHistory } from "@/features/customers/queries/use-customer";
import { DataTable } from "@/features/shared/data-table";
import { usePagination } from "@/hooks/use-pagination";

type CustomerGCashHistoryDataTableProps = {
  customerId: number;
};

export default function CustomerGCashHistoryDataTable({
  customerId,
}: CustomerGCashHistoryDataTableProps) {
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: gcashHistory } = useGetCustomerGCashHistory(customerId);

  return (
    <DataTable
      title="Transactions"
      description=" Lorem ipsum dolor sit amet consectetur."
      columns={columns}
      data={gcashHistory?.data?.content || []}
      page={gcashHistory?.data?.page}
      currentPage={pageParams.page}
      onPageChange={setPage}
    />
  );
}
