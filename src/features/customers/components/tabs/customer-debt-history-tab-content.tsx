import { Button } from "@/components/ui/button";
import CustomerDebtHistoryDataTable from "@/features/customers/components/tables/customer-debt-history-data-tablet";
import { Download } from "lucide-react";

type CustomerDebtHistoryTabContentProps = {
  customerId: number;
};

export default function CustomerDebtHistoryTabContent({
  customerId,
}: CustomerDebtHistoryTabContentProps) {
  return (
    <div className="space-y-3">
      {/** Test Actions */}
      <div className="flex gap-2 justify-self-end">
        <Button variant="outline">
          <Download /> Download
        </Button>
      </div>
      <CustomerDebtHistoryDataTable customerId={customerId} />
    </div>
  );
}
