import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateProductVariantStockMovement } from "@/features/products/queries/use-product";
import {
  stockMovementFormSchema,
  type ProductVariant,
  type StockMovementFormValues,
  type StockMovementType,
} from "@/features/products/schema/product";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, LoaderCircle, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProductVariantStockMovementDialogProps = {
  productId: number;
  variant: ProductVariant;
};

type MovementTypeLabels = Record<Exclude<StockMovementType, "SOLD">, string>;

const movementTypeLabels: MovementTypeLabels = {
  RESTOCK: "Restock",
  ADJUSTMENT: "Adjustment",
  RETURN: "Return",
};

function getMovementSuccessMessage(movementType: StockMovementType) {
  switch (movementType) {
    case "ADJUSTMENT":
      return "Stock adjustment has been saved successfully.";
    case "RETURN":
      return "Stock return has been recorded successfully.";
    case "RESTOCK":
    default:
      return "Stock restock has been recorded successfully.";
  }
}

export default function ProductVariantStockMovementDialog({
  productId,
  variant,
}: ProductVariantStockMovementDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    mutateAsync: createProductVariantStockMovementAsync,
    isPending,
    error,
  } = useCreateProductVariantStockMovement();
  const form = useForm({
    defaultValues: {
      movementType: "RESTOCK",
      quantity: 1,
      direction: "ADD",
      notes: "",
    } as StockMovementFormValues,
    validators: {
      onSubmit: stockMovementFormSchema,
    },
    onSubmit: async ({ value }) => {
      await createProductVariantStockMovementAsync(
        {
          productId,
          variantId: variant.id,
          movementType: value.movementType,
          quantity: value.quantity,
          direction: value.direction,
          notes: value.notes,
        },
        {
          onSuccess: () => {
            form.reset();
            setOpen(false);
            toast.custom(() => (
              <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
                <CheckIcon />
                <AlertTitle>
                  {getMovementSuccessMessage(value.movementType)}
                </AlertTitle>
              </Alert>
            ));
          },
        },
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset();
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="cursor-pointer"
              type="button"
            >
              <Truck />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Stock movement</p>
        </TooltipContent>
      </Tooltip>
      <form
        id={`product-variant-stock-movement-form-${variant.id}`}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent className="md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Stock Movement</DialogTitle>
            <DialogDescription>
              Update the stock for {variant.sku} using restock, adjustment, or
              return.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="movementType">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor={`movement-type-${variant.id}`}>
                      Movement Type
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as StockMovementType)
                      }
                    >
                      <SelectTrigger
                        id={`movement-type-${variant.id}`}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select movement type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(["RESTOCK", "ADJUSTMENT", "RETURN"] as const).map(
                          (movementType) => {
                            return (
                              <SelectItem
                                key={movementType}
                                value={movementType}
                              >
                                {movementTypeLabels[movementType]}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError
                        className="text-xs"
                        errors={field.state.meta.errors}
                      />
                    )}

                    {field.state.value === "ADJUSTMENT" && (
                      <form.Field name="direction">
                        {(directionField) => {
                          const isDirectionInvalid =
                            directionField.state.meta.isTouched &&
                            !directionField.state.meta.isValid;

                          return (
                            <div className="grid gap-3">
                              <Label htmlFor={`direction-${variant.id}`}>
                                Direction
                              </Label>
                              <Select
                                value={directionField.state.value ?? ""}
                                onValueChange={(value) =>
                                  directionField.handleChange(
                                    value as StockMovementFormValues["direction"],
                                  )
                                }
                              >
                                <SelectTrigger
                                  id={`direction-${variant.id}`}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Select direction" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(["ADD", "DEDUCT"] as const).map(
                                    (direction) => {
                                      return (
                                        <SelectItem
                                          key={direction}
                                          value={direction}
                                        >
                                          {direction === "ADD"
                                            ? "Add"
                                            : "Deduct"}
                                        </SelectItem>
                                      );
                                    },
                                  )}
                                </SelectContent>
                              </Select>
                              {isDirectionInvalid && (
                                <FieldError
                                  className="text-xs"
                                  errors={directionField.state.meta.errors}
                                />
                              )}
                            </div>
                          );
                        }}
                      </form.Field>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="quantity">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor={`quantity-${variant.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${variant.id}`}
                      type="number"
                      min={1}
                      step={1}
                      value={field.state.value || ""}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      onBlur={field.handleBlur}
                    />
                    {isInvalid && (
                      <FieldError
                        className="text-xs"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="notes">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor={`notes-${variant.id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${variant.id}`}
                      rows={4}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Optional notes"
                    />
                    {isInvalid && (
                      <FieldError
                        className="text-xs"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </div>
                );
              }}
            </form.Field>

            {error && (
              <FieldError
                className="text-xs"
                errors={[{ message: error?.message }]}
              />
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`product-variant-stock-movement-form-${variant.id}`}
              className="cursor-pointer"
            >
              {isPending && (
                <div className="py-6 text-center text-sm">
                  <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                </div>
              )}
              Save movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
