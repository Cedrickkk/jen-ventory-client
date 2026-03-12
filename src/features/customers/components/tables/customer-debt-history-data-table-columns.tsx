import { TableHeaderButton } from "@/components/table-header-button";
import { Badge } from "@/components/ui/badge";

import type { Debt } from "@/features/transactions/schema/debt";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const columns: ColumnDef<Debt>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column} className="ml-5">
          ID
        </TableHeaderButton>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground ml-5">
        #{getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "transactionId",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Transaction ID</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span className="font-medium">{value ? `#${value}` : "-"}</span>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Type</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <Badge variant="secondary">{getValue() as string}</Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Amount</TableHeaderButton>;
    },
    cell: ({ getValue }) => {
      return <span>{formatCurrency(getValue() as string)}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Method</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Notes</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Date</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span> {formatDate(getValue() as string, "MMM d, yyyy h:mm a")}</span>
    ),
  },
];
