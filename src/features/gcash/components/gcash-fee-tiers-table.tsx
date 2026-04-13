import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency";
import type { GCashFeeTier } from "../schema/gcash";

type GCashFeeTiersTableProps = {
  tiers: GCashFeeTier[];
};

export function GCashFeeTiersTable({ tiers }: GCashFeeTiersTableProps) {
  return (
    <Table className="p-6">
      <TableHeader>
        <TableRow>
          <TableHead>Min. Amount</TableHead>
          <TableHead>Max Amount</TableHead>
          <TableHead className="text-right">Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tiers.map((tier) => (
          <TableRow key={tier.id}>
            <TableCell className="py-4">
              {formatCurrency(String(tier.minAmount))}
            </TableCell>
            <TableCell className="py-4">
              {formatCurrency(String(tier.maxAmount))}
            </TableCell>
            <TableCell className="py-4 text-right">
              {formatCurrency(String(tier.fee))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
