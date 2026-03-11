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
import { useEditCustomer } from "@/features/customers/queries/use-customer";
import {
  editCustomerSchema,
  type EditCustomer,
} from "@/features/customers/schema/customer";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, LoaderCircle, Pencil } from "lucide-react";
import { toast } from "sonner";

type EditCustomerFormDialogProps = {
  id: number;
  customer: EditCustomer;
};

export default function CustomerEditFormDialog({
  id,
  customer,
}: EditCustomerFormDialogProps) {
  const { mutateAsync: updateCustomerAsync, isPending } = useEditCustomer();
  const form = useForm({
    defaultValues: {
      ...customer,
    },
    validators: {
      onSubmit: editCustomerSchema,
    },
    onSubmit: async ({ value }) => {
      await updateCustomerAsync(
        { id, customer: value },
        {
          onSuccess: () => {
            form.reset();
            toast.custom(() => (
              <Alert className="border-none bg-green-600 font-sans text-white dark:bg-green-400">
                <CheckIcon />
                <AlertTitle>Customer has been updated successfully.</AlertTitle>
              </Alert>
            ));
          },
        },
      );
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Pencil />
        </Button>
      </DialogTrigger>
      <form
        id={`edit-customer-form-${id}`}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent className="md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Customer Profile</DialogTitle>
            <DialogDescription>
              Make changes to customer profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`edit-customer-form-${id}`}
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
