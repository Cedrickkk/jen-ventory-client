import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { useCreateCustomer } from "@/features/customers/queries/use-customer";
import { customerSchema } from "@/features/customers/schema/customer";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CustomerCreateFormSheet() {
  const {
    mutateAsync: createCustomerAsync,
    isPending,
    error,
  } = useCreateCustomer();
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      active: true,
    },
    validators: {
      onSubmit: customerSchema,
    },
    onSubmit: async ({ value }) => {
      await createCustomerAsync(value, {
        onSuccess: () => {
          form.reset();
          toast.custom(() => (
            <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
              <CheckIcon />
              <AlertTitle>Customer has been created successfully.</AlertTitle>
            </Alert>
          ));
        },
      });
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Add Customer
        </Button>
      </SheetTrigger>
      <SheetContent className="md:max-w-5xl">
        <SheetHeader>
          <SheetTitle>Create Customer</SheetTitle>
          <SheetDescription>
            Enter the customer details below, then click save to create the
            customer.
          </SheetDescription>
        </SheetHeader>
        <form
          id="create-customer-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
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

            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="address">Address</Label>
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
            <form.Field name="phone">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone No.</Label>
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
            {error && (
              <FieldError
                className="text-xs"
                errors={[{ message: error?.message }]}
              />
            )}
          </div>
        </form>
        <SheetFooter>
          <Button type="submit" form="create-customer-form">
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
