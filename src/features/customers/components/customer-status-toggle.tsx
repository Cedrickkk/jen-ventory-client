import { Switch } from "@/components/ui/switch";
import { useToggleCustomerStatus } from "@/features/customers/queries/use-customer";

type CustomerStatusToggle = {
  id: number;
  active: boolean;
};

export default function CustomerStatusToggle({
  id,
  active = true,
}: CustomerStatusToggle) {
  const { mutate: toggleStatus, isPending } = useToggleCustomerStatus();

  return (
    <Switch
      defaultChecked={active}
      checked={active}
      onCheckedChange={() => toggleStatus({ id, active })}
      disabled={isPending}
    />
  );
}
