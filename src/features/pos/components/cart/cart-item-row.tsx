import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { useCartActions } from "@/features/pos/store/selectors/cart-selector";
import type { CartItem } from "@/features/pos/store/slices/cart-slice";
import { formatCurrency } from "@/lib/currency";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type CartItemRowProps = {
  item: CartItem;
};

export default function CartItemRow({ item }: CartItemRowProps) {
  const { increment, decrement, remove, setQuantity } = useCartActions();
  const [inputValue, setInputValue] = useState(String(item.quantity));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      remove(item.variantId);
    } else {
      setQuantity(item.variantId, parsed);
      setInputValue(String(Math.min(parsed, item.stockQuantity)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const handleIncrement = () => {
    increment(item.variantId);
    setInputValue(String(item.quantity + 1));
  };

  const handleDecrement = () => {
    decrement(item.variantId);
    setInputValue(String(Math.max(item.quantity - 1, 0)));
  };

  const subtotal = item.quantity * item.unitPrice;
  const isAtStockLimit = item.quantity >= item.stockQuantity;

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm leading-tight font-semibold">
          {item.productName}
        </p>
        <p className="text-muted-foreground text-xs">{item.sku}</p>
        {(item.size || item.flavor || item.packaging) && (
          <p className="text-muted-foreground text-xs">
            {[item.size, item.flavor, item.packaging]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        <p className="pt-1 text-sm font-medium">
          {formatCurrency(String(subtotal))}
          <span className="text-muted-foreground ml-1 text-xs font-normal">
            ({formatCurrency(String(item.unitPrice))} × {item.quantity})
          </span>
        </p>
      </div>

      <ButtonGroup>
        <Button onClick={handleDecrement} size="icon-lg" variant="outline">
          -
        </Button>
        <Input
          className="bg-background h-10 w-20 text-center"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          min={1}
          max={item.stockQuantity}
        />
        <Button
          onClick={handleIncrement}
          disabled={isAtStockLimit}
          size="icon-lg"
          variant="outline"
        >
          +
        </Button>
      </ButtonGroup>
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => remove(item.variantId)}
      >
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  );
}
