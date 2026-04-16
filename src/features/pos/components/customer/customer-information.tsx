import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCustomerDebtSummary } from "@/features/customers/queries/use-customer";
import { useSelectedCustomer } from "@/features/pos/store/selectors/customer-selector";
import { formatCurrency } from "@/lib/currency";
import { getInitials } from "@/lib/name";
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
          {selectedCustomer ? (
            <div className="flex flex-col items-start justify-start gap-4">
              <Avatar className="size-12 rounded-sm">
                <AvatarImage
                  src={`${import.meta.env.VITE_BASE_URL}/storage/images/${selectedCustomer.image}`}
                  alt={selectedCustomer.name}
                  className="rounded-sm"
                />
                <AvatarFallback className="text-xs">
                  {getInitials(selectedCustomer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{selectedCustomer.name}</span>
                <span className="text-muted-foreground text-sm font-normal">
                  {selectedCustomer.phone}
                </span>
              </div>
            </div>
          ) : (
            "Walk-in"
          )}
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
