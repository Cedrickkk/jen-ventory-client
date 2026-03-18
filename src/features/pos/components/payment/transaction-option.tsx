import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCustomerActions,
  useRepresentativeName,
  useSelectedCustomer,
} from "@/features/pos/store/selectors/customer-selector";
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

  const selectedCustomer = useSelectedCustomer();
  const representativeName = useRepresentativeName();
  const { setRepresentativeName } = useCustomerActions();

  const isWalkIn = selectedCustomer === null;

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
          disabled={!isDebt || isWalkIn}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rep-name" className="text-xs font-medium">
          {isWalkIn
            ? "Walk-in Customer Name (optional)"
            : "Representative Name (optional)"}
        </Label>
        <Input
          id="rep-name"
          placeholder={
            isWalkIn ? "e.g. Juan dela Cruz" : "e.g. picking up on behalf"
          }
          value={representativeName}
          onChange={(e) => setRepresentativeName(e.target.value)}
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
          disabled={!isOverPaid || isWalkIn}
        />
      </div>
    </div>
  );
}
