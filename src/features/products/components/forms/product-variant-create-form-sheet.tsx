import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateProductVariant } from "@/features/products/queries/use-product";
import {
  productVariantSchema,
  type CreateProductVariant,
} from "@/features/products/schema/product";
import { useForm } from "@tanstack/react-form";
import {
  CheckIcon,
  LoaderCircle,
  PhilippinePeso,
  Plus,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

type ProductVariantCreateFormSheetProps = {
  id: number;
};

export default function ProductVariantCreateFormSheet({
  id,
}: ProductVariantCreateFormSheetProps) {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {
    mutateAsync: createProductVariantAsync,
    isPending,
    error,
  } = useCreateProductVariant();
  const form = useForm({
    defaultValues: {
      sku: "",
      size: "" as string | undefined,
      flavor: "" as string | undefined,
      packacging: "" as string | undefined,
      price: 0,
      image: null,
    } as CreateProductVariant,
    validators: {
      onSubmit: productVariantSchema,
    },
    onSubmit: async ({ value }) => {
      await createProductVariantAsync(
        { id, variant: value },
        {
          onSuccess: () => {
            form.reset();
            toast.custom(() => (
              <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
                <CheckIcon />
                <AlertTitle>
                  Product variant has been created successfully.
                </AlertTitle>
              </Alert>
            ));
          },
        },
      );
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Add Variant
        </Button>
      </SheetTrigger>
      <SheetContent className="md:max-w-5xl">
        <SheetHeader>
          <SheetTitle>Create Product Variant</SheetTitle>
          <SheetDescription>
            Enter the product details below, then click save to create the
            variant.
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-product-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <form.Field name="sku">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="name">SKU</Label>
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

            <form.Field name="size">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="description">Size</Label>
                    <Input
                      id="description"
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

            <form.Field name="packaging">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="description">Packaging</Label>
                    <Input
                      id="description"
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
                    <Label htmlFor="description">Price</Label>
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

            <form.Subscribe
              selector={(state) => state.values.image}
              children={(image) => (
                <form.Field name="image">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <div className="space-y-3">
                        <Label htmlFor="image">Picture</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          size="sm"
                          onClick={() => imageRef.current?.click()}
                        >
                          <Upload className="mr-2 h-6 w-6" />
                          {image ? image.name : "Upload Picture"}
                        </Button>

                        <Input
                          id="image"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          ref={imageRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.handleChange(file);
                            e.target.value = "";
                          }}
                        />
                        {isInvalid && (
                          <FieldError
                            className="text-xs"
                            errors={field.state.meta.errors}
                          />
                        )}
                        <p className="text-muted-foreground text-xs">
                          PDF, JPG, PNG, DOC (Max 10MB)
                        </p>
                        {field.state.value && (
                          <img
                            src={URL.createObjectURL(field.state.value)}
                            alt="Preview"
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              )}
            />

            {error && (
              <FieldError
                className="text-xs"
                errors={[{ message: error?.message }]}
              />
            )}
          </div>
        </form>
        <SheetFooter>
          <Button type="submit" form="create-product-form">
            {isPending && (
              <div className="py-6 text-center text-sm">
                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
              </div>
            )}
            Save
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
