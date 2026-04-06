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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditProductVariant } from "@/features/products/queries/use-product";
import {
  editProductVariantSchema,
  type EditProductVariant,
} from "@/features/products/schema/product";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, LoaderCircle, Pencil, PhilippinePeso } from "lucide-react";
import { toast } from "sonner";

type EditProductFormDialogProps = {
  id: number;
  variant: EditProductVariant;
};

export default function EditProductVariantFormDialog({
  id,
  variant,
}: EditProductFormDialogProps) {
  const { mutateAsync: updateProductVariantAsync, isPending } =
    useEditProductVariant();
  const form = useForm({
    defaultValues: {
      ...variant,
    },
    validators: {
      onSubmit: editProductVariantSchema,
    },
    onSubmit: async ({ value }) => {
      await updateProductVariantAsync(
        { id, variant: value },
        {
          onSuccess: () => {
            form.reset();
            toast.custom(() => (
              <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
                <CheckIcon />
                <AlertTitle>
                  Product variant has been updated successfully.
                </AlertTitle>
              </Alert>
            ));
          },
        },
      );
    },
  });

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-lg" className="cursor-pointer">
              <Pencil />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
      <form
        id={`edit-product-variant-form-${id}`}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent className="md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Product Variant</DialogTitle>
            <DialogDescription>
              Make changes to variant here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="packaging">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Packaging</Label>
                    <Input
                      id="name"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
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
            <form.Field name="flavor">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="address">Flavor</Label>
                    <Input
                      id="address"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
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
            <form.Field name="size">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Size</Label>
                    <Input
                      id="phone"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
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
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Price</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="amount"
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        value={field.state.value || ""}
                        className="pl-7"
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <InputGroupAddon align="inline-start">
                        <PhilippinePeso className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`edit-product-variant-form-${id}`}
              className="cursor-pointer"
            >
              {isPending && (
                <div className="py-6 text-center text-sm">
                  <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                </div>
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
