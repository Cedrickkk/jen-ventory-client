import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCustomerDebtSummary } from "@/features/customers/queries/use-customer";
import { useSelectedCustomer } from "@/features/pos/store/selectors/customer-selector";
import { formatCurrency } from "@/lib/currency";
import { LoaderCircle } from "lucide-react";

export default function CustomerInformation() {
  const selectedCustomer = useSelectedCustomer();
  const { data: debtSummary, isLoading } = useGetCustomerDebtSummary(
    selectedCustomer?.id ?? null,
  );

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>
          {selectedCustomer ? selectedCustomer.name : "Walk-in"}
        </CardTitle>
        <CardDescription>
          {!selectedCustomer && "No account selected"}

          {selectedCustomer && (
            <>
              {isLoading ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  <span>
                    Total Debt:{" "}
                    <span className="text-destructive font-semibold">
                      {formatCurrency(
                        String(debtSummary?.data?.totalDebt ?? 0),
                      )}
                    </span>
                  </span>
                  <span>
                    Store Credit:{" "}
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        String(debtSummary?.data?.totalCredit ?? 0),
                      )}
                    </span>
                  </span>
                  <span>
                    Net Debt:{" "}
                    <span className="text-destructive font-semibold">
                      {formatCurrency(String(debtSummary?.data?.netDebt ?? 0))}
                    </span>
                  </span>
                  <span>
                    Net Credit:{" "}
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        String(debtSummary?.data?.netCredit ?? 0),
                      )}
                    </span>
                  </span>
                </span>
              )}
            </>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
