import { TableHeaderButton } from "@/components/table-header-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditCustomerFormDialog from "@/features/customers/components/forms/customer-edit-form-dialog";
import type { Customer } from "@/features/customers/schema/customer";
import { getInitials } from "@/lib/name";
import { Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import CustomerStatusToggle from "../customer-status-toggle";

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Name</TableHeaderButton>;
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const initials = getInitials(name);
      return (
        <div className="flex items-center gap-4">
          <Avatar className="size-9 rounded-sm">
            <AvatarImage
              src={`${import.meta.env.VITE_BASE_URL}/storage/images/${row.original.image}`}
              alt={initials}
              className="rounded-sm"
            />
            <AvatarFallback className="rounded-sm text-xs">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Address</TableHeaderButton>;
    },
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Phone No.</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "active",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Active</TableHeaderButton>;
    },
    cell: ({ row }) => (
      <CustomerStatusToggle id={row.original.id} active={row.original.active} />
    ),
  },
  {
    id: "actions",
    header: () => <p className="text-muted-foreground">Actions</p>,
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <EditCustomerFormDialog
            id={row.original.id}
            customer={row.original}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="cursor-pointer"
                asChild
              >
                <Link
                  to="/customers/$customerId"
                  params={{ customerId: row.original.id.toString() }}
                >
                  <Eye />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>
      );
    },
  },
];
