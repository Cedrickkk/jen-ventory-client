import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAllowDebt,
  useOptionActions,
  useStoreChangeAsCredit,
} from "@/features/pos/store/selectors/option-selector";
import { usePaymentStatus } from "@/features/pos/store/selectors/payment-selector";

export default function TransactionOptions() {
  const { isDebt, isOverPaid } = usePaymentStatus();
  const allowDebt = useAllowDebt();
  const storeChangeAsCredit = useStoreChangeAsCredit();
  const { toggleAllowDebt, toggleStoreCredit } = useOptionActions();

  const showAllowDebt = isDebt || allowDebt;
  const showStoreCredit = isOverPaid || storeChangeAsCredit;

  if (!showAllowDebt && !showStoreCredit) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="allow-debt" className="text-sm font-medium">
            Allow Debt (Utang)
          </Label>
          <p className="text-muted-foreground text-xs">
            Record unpaid balance as debt
          </p>
        </div>
        <Switch
          id="allow-debt"
          checked={allowDebt}
          onCheckedChange={toggleAllowDebt}
          disabled={!isDebt}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="store-credit" className="text-sm font-medium">
            Store as Credit
          </Label>
          <p className="text-muted-foreground text-xs">
            Keep overpayment as store credit
          </p>
        </div>
        <Switch
          id="store-credit"
          checked={storeChangeAsCredit}
          onCheckedChange={toggleStoreCredit}
          disabled={!isOverPaid}
        />
      </div>
    </div>
  );
}
