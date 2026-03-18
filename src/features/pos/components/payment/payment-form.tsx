import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePaymentActions } from "@/features/pos/store/selectors/payment-selector";
import type { PaymentMethod } from "@/features/pos/store/slices/payment-slice";
import { useState } from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PhilippinePeso } from "lucide-react";

export default function PaymentForm() {
  const { add } = usePaymentActions();

  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const parsed = parseFloat(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    add({
      id: crypto.randomUUID(),
      paymentMethod: method,
      amount: parsed,
    });

    setAmount("");
    setError(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Payment Method</Label>
        <ToggleGroup
          type="single"
          value={method}
          onValueChange={(v) => {
            if (v) setMethod(v as PaymentMethod);
          }}
          className="grid grid-cols-3"
        >
          <ToggleGroupItem value="CASH" className="w-full">
            Cash
          </ToggleGroupItem>
          <ToggleGroupItem value="GCASH" className="w-full">
            GCash
          </ToggleGroupItem>
          <ToggleGroupItem value="CREDIT_USED" className="w-full">
            Credit
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Field>
        <FieldLabel htmlFor="amount">Amount</FieldLabel>
        <div className="flex items-center gap-4">
          <InputGroup>
            <InputGroupInput
              id="amount"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={amount}
              className="pl-7"
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <InputGroupAddon align="inline-start">
              <PhilippinePeso className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          <Button onClick={handleSubmit} className="shrink-0">
            Add
          </Button>
        </div>

        <FieldDescription>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </FieldDescription>
      </Field>
    </div>
  );
}
