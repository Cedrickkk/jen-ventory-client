import { TableHeaderButton } from "@/components/table-header-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import ProductVariantEditFormDialog from "@/features/products/components/forms/product-variant-edit-form-dialog";
import ProductVariantStockMovementDialog from "@/features/products/components/forms/product-variant-stock-movement-dialog";
import type { ProductVariant } from "@/features/products/schema/product";
import { formatCurrency } from "@/lib/currency";
import { type ColumnDef } from "@tanstack/react-table";

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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <Avatar className="size-9 rounded-sm">
            <AvatarImage
              src={`${import.meta.env.VITE_BASE_URL}/storage/images/${row.original.image}`}
              alt={row.original.sku}
              className="rounded-sm"
            />
            <AvatarFallback className="rounded-sm text-xs">
              {row.original.sku}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.sku}</span>
        </div>
      );
    },
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
          <ProductVariantStockMovementDialog
            productId={row.original.productId}
            variant={row.original}
          />
        </ButtonGroup>
      );
    },
  },
];
