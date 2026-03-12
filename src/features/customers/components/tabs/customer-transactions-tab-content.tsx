import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import CustomerTransactionsDataTable from "../tables/customer-transactions-data-table";

type CustomerTransactionsTabContentProps = {
  customerId: number;
};

export default function CustomerTransactionsTabContent({
  customerId,
}: CustomerTransactionsTabContentProps) {
  return (
    <div className="space-y-3">
      {/** Test Actions */}
      <div className="flex gap-2 justify-self-end">
        <Button variant="outline">
          <Download /> Download
        </Button>
      </div>
      <CustomerTransactionsDataTable customerId={customerId} />
    </div>
  );
}
