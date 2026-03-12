import { columns } from "@/features/customers/components/tables/customer-transactions-data-table-columns";
import { useGetCustomerTransactions } from "@/features/customers/queries/use-customer";
import { DataTable } from "@/features/shared/data-table";
import { usePagination } from "@/hooks/use-pagination";

type CustomerTransactionsDataTableProps = {
  customerId: number;
};

export default function CustomerTransactionsDataTable({
  customerId,
}: CustomerTransactionsDataTableProps) {
  const { pageParams, setPage } = usePagination({
    initialSize: 10,
    initialSort: ["id,asc", "createdAt,desc"],
  });
  const { data: transactions } = useGetCustomerTransactions(customerId);

  return (
    <DataTable
      title="Transactions"
      description=" Lorem ipsum dolor sit amet consectetur."
      columns={columns}
      data={transactions?.data?.content || []}
      page={transactions?.data?.page}
      currentPage={pageParams.page}
      onPageChange={setPage}
    />
  );
}
