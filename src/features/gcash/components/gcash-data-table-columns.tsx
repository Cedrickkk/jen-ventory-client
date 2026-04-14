import { TableHeaderButton } from "@/components/table-header-button";
import type { GCashServiceLog } from "@/features/gcash/schema/gcash";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const columns: ColumnDef<GCashServiceLog>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Customer</TableHeaderButton>;
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
    accessorKey: "representativeName",
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
    accessorKey: "representativePhone",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Phone No.</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "serviceType",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Type</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Amount</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatCurrency(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "fee",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Fee</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatCurrency(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Notes</TableHeaderButton>;
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Transaction Date</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatDate(getValue() as string, "MMM d, yyyy h:mm a")}
      </span>
    ),
  },
];
