import { Switch } from "@/components/ui/switch";
import { useToggleProductStatus } from "@/features/products/queries/use-product";

type CustomerStatusToggle = {
  id: number;
  active: boolean;
};

export default function ProductStatusToggle({
  id,
  active = true,
}: CustomerStatusToggle) {
  const { mutate: toggleStatus, isPending } = useToggleProductStatus();

  return (
    <Switch
      defaultChecked={active}
      checked={active}
      onCheckedChange={() => toggleStatus({ id, active })}
      disabled={isPending}
    />
  );
}
