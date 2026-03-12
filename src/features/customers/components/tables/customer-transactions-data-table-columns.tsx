import { TableHeaderButton } from "@/components/table-header-button";

import type { CustomerTransaction } from "@/features/customers/schema/customer";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import CustomerTransactionDetailsDialog from "../customer-transaction-details-dialog";

export const columns: ColumnDef<CustomerTransaction>[] = [
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
    accessorKey: "representative",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Representative</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => (
      <span className="font-medium">
        {(getValue() as string) ? (getValue() as string) : "None"}
      </span>
    ),
  },
  {
    accessorKey: "itemCount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>QTY</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Total</TableHeaderButton>;
    },
    cell: ({ getValue }) => {
      return <span>{formatCurrency(getValue() as string)}</span>;
    },
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Amount Paid</TableHeaderButton>;
    },
    cell: ({ getValue }) => {
      return <span>{formatCurrency(getValue() as string)}</span>;
    },
  },
  {
    accessorKey: "creditAmount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Credit</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{formatCurrency(getValue() as string)}</span>,
  },
  {
    accessorKey: "debtAmount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Debt</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{formatCurrency(getValue() as string)}</span>,
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
  {
    id: "actions",
    header: () => {
      return <p className="text-muted-foreground">Actions</p>;
    },
    cell: ({ row }) => {
      return (
        <CustomerTransactionDetailsDialog transactionId={row.original.id} />
      );
    },
  },
];
