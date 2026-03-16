import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { transactionQueries } from "@/features/transactions/queries/use-transaction";
import { formatCurrency } from "@/lib/currency";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useState } from "react";

type CustomerTransactionDetailsDialogProps = {
  transactionId: number;
};

export default function CustomerTransactionDetailsDialog({
  transactionId,
}: CustomerTransactionDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: transaction } = useQuery({
    ...transactionQueries.detail(transactionId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-lg" className="cursor-pointer">
              <Eye />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>View</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 rounded-md p-0 sm:max-w-3xl">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4">
            Transaction Information
          </DialogTitle>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <DialogDescription asChild>
              <div className="p-6">
                <FieldSet className="gap-4">
                  <Field orientation="horizontal">
                    <FieldLabel className="text-foreground font-semibold">
                      Transaction ID:
                    </FieldLabel>
                    <FieldDescription>
                      #{transaction?.data?.id}
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="text-foreground font-semibold">
                      Customer:
                    </FieldLabel>
                    <FieldDescription>
                      {transaction?.data?.customerName}
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="text-foreground font-semibold">
                      Representative:
                    </FieldLabel>
                    <FieldDescription>
                      {transaction?.data?.representative ?? "None"}
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="text-foreground font-semibold">
                      Total Amount:
                    </FieldLabel>
                    <FieldDescription>
                      {formatCurrency(String(transaction?.data?.totalAmount))}
                    </FieldDescription>
                  </Field>
                  <Field className="gap-2">
                    <FieldLabel className="text-foreground justify-self-start font-semibold">
                      Items:
                    </FieldLabel>
                    <FieldDescription>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">
                              Unit Price
                            </TableHead>
                            <TableHead className="text-right">QTY</TableHead>
                            <TableHead className="text-right">
                              Subtotal
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transaction?.data?.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-muted-foreground">
                                {item.sku}
                              </TableCell>
                              <TableCell>{item.productVariantName}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(String(item.unitPrice))}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(String(item.subtotal))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </FieldDescription>
                  </Field>
                  <Field className="gap-2">
                    <FieldLabel className="text-foreground justify-self-start font-semibold">
                      Payments:
                    </FieldLabel>
                    <FieldDescription>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transaction?.data?.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {formatCurrency(String(payment.amount))}
                              </TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell className="text-right">
                                {formatDate(
                                  payment.createdAt,
                                  "MMM d, yyyy h:mm a",
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </FieldDescription>
                  </Field>
                </FieldSet>
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
