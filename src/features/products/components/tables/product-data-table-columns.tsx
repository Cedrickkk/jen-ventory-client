import { TableHeaderButton } from "@/components/table-header-button";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductStatusToggle from "@/features/products/components/product-status-toggle";
import type { Product } from "@/features/products/schema/product";
import { Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
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
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Description</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="max-w-36 truncate">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "variantCount",
    header: ({ column }) => {
      return (
        <TableHeaderButton column={column}>Variants (#)</TableHeaderButton>
      );
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "active",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Active</TableHeaderButton>;
    },
    cell: ({ row }) => (
      <ProductStatusToggle id={row.original.id} active={row.original.active} />
    ),
  },
  {
    id: "actions",
    header: () => <p className="text-muted-foreground">Actions</p>,
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="cursor-pointer"
                asChild
              >
                <Link
                  to="/products/$productId"
                  params={{ productId: row.original.id.toString() }}
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
