import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";

type TableHeaderButtonProps<TData> = {
  column: Column<TData>;
  children: ReactNode;
  className?: string;
};

export function TableHeaderButton<TData>({
  column,
  children,
}: TableHeaderButtonProps<TData>) {
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground my-3 w-full cursor-pointer justify-start rounded-sm py-3 text-left hover:bg-white/10"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ChevronsUpDown className="size-3" />
    </Button>
  );
}
