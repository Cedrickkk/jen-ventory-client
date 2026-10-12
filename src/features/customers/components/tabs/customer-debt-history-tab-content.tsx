import { Button } from "@/components/ui/button";
import CustomerDebtHistoryDataTable from "@/features/customers/components/tables/customer-debt-history-data-tablet";
import { downloadCustomerDebtReport } from "@/features/customers/api/customer-api";
import { Download } from "lucide-react";
import { useState } from "react";

export default function CustomerDebtHistoryTabContent({ customerId }: { customerId: number }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = async () => {
    setDownloading(true); setError(null);
    try { await downloadCustomerDebtReport(customerId); }
    catch { setError("The report could not be downloaded. Please try again."); }
    finally { setDownloading(false); }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-self-end">
        <Button variant="outline" disabled={downloading} onClick={download}>
          <Download /> {downloading ? "Downloading…" : "Download PDF"}
        </Button>
      </div>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      <CustomerDebtHistoryDataTable customerId={customerId} />
    </div>
  );
}
