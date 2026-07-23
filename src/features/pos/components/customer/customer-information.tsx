import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCustomerDebtSummary } from "@/features/customers/queries/use-customer";
import type { CustomerSummary } from "@/features/pos/store/slices/customer-slice";
import { formatCurrency } from "@/lib/currency";
import { getInitials } from "@/lib/name";
import { LoaderCircle } from "lucide-react";

type CustomerInformationProps = {
  customer: CustomerSummary | null;
};

export default function CustomerInformation({
  customer,
}: CustomerInformationProps) {
  const { data: debtSummary, isLoading } = useGetCustomerDebtSummary(
    customer?.id ?? null,
  );
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>
          {customer ? (
            <div className="flex flex-col items-start justify-start gap-4">
              <Avatar className="size-12 rounded-sm">
                <AvatarImage
                  src={`${import.meta.env.VITE_BASE_URL}/storage/images/${customer.image}`}
                  alt={customer.name}
                  className="rounded-sm"
                />
                <AvatarFallback className="rounded-sm text-xs">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{customer.name}</span>
                <span className="text-muted-foreground text-sm font-normal">
                  {customer.phone}
                </span>
              </div>
            </div>
          ) : (
            "Walk-in"
          )}
        </CardTitle>
        <CardDescription>
          {!customer && "No account selected"}

          {customer && (
            <>
              {isLoading ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  <span>
                    Natitirang Utang:{" "}
                    <span className="text-destructive font-semibold">
                      {formatCurrency(String(debtSummary?.data?.netDebt ?? 0))}
                    </span>
                  </span>
                  <span>
                    Natitirang Sukli:{" "}
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
