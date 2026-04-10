import { TableHeaderButton } from "@/components/table-header-button";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductVariantEditFormDialog from "@/features/products/components/forms/product-variant-edit-form-dialog";
import type { ProductVariant } from "@/features/products/schema/product";
import { formatCurrency } from "@/lib/currency";
import { Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export const columns: ColumnDef<ProductVariant>[] = [
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
    accessorKey: "sku",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>SKU</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Size</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as number}</span>
    ),
  },

  {
    accessorKey: "flavor",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Flavor</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {!getValue() || getValue() === "" ? "-" : (getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "packaging",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Packaging</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Stocks</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <TableHeaderButton column={column}>Price</TableHeaderButton>;
    },
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {formatCurrency(getValue() as string)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <p className="text-muted-foreground">Actions</p>,
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <ProductVariantEditFormDialog
            id={row.original.productId}
            variant={row.original}
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
