import { Button } from "@/components/ui/button";
import CustomerGCashHistoryDataTable from "@/features/customers/components/tables/customer-gcash-history-data-table";
import { Download } from "lucide-react";

type CustomerGCashHistoryTabContentProps = {
  customerId: number;
};

export default function CustomerGCashHistoryTabContent({
  customerId,
}: CustomerGCashHistoryTabContentProps) {
  return (
    <div className="space-y-3">
      {/** Test Actions */}
      <div className="flex gap-2 justify-self-end">
        <Button variant="outline">
          <Download /> Download
        </Button>
      </div>
      <CustomerGCashHistoryDataTable customerId={customerId} />
    </div>
  );
}
