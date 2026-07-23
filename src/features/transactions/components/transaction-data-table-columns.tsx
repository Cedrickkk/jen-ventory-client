import { TableHeaderButton } from "@/components/table-header-button";
import type { TransactionSummary } from "@/features/transactions/schema/transaction";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const columns: ColumnDef<TransactionSummary>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Name</TableHeaderButton>;
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="text-muted-foreground ml-5">
          {value ? `${value}` : "Walk-in"}
        </span>
      );
    },
  },
  {
    accessorKey: "representative",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Representative</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="text-muted-foreground ml-5">
          {value ? `${value}` : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Notes</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Total Amount</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatCurrency(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Date</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatDate(String(getValue()), "MMM d, yyyy h:mm a")}
      </span>
    ),
  },
];
