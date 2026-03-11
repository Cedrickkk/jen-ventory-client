import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  className,
}: TableHeaderButtonProps<TData>) {
  return (
    <div className={cn("flex items-start justify-start py-3", className)}>
      <Button
        variant="ghost"
        className="text-muted-foreground w-fit cursor-pointer rounded-sm p-2 text-left hover:bg-white/10"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {children}
        <ChevronsUpDown className="size-3" />
      </Button>
    </div>
  );
}
