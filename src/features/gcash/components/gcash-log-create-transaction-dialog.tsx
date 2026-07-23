import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateGCashServiceLog } from "@/features/gcash/queries/use-gcash";
import {
  gCashServiceLogSchema,
  type CreateGCashServiceLog,
  type GCashTransactionType,
} from "@/features/gcash/schema/gcash";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, LoaderCircle, PhilippinePeso } from "lucide-react";
import { toast } from "sonner";

export default function GCashLogCreateTransactionDialog() {
  const {
    mutateAsync: createGCashServiceLogTransactionAsync,
    isPending,
    error,
  } = useCreateGCashServiceLog();
  const form = useForm({
    defaultValues: {
      serviceType: "CASH_IN" as GCashTransactionType,
      amount: 0,
      representativePhone: "",
      customerId: "" as string | undefined,
      representativeName: "",
      notes: "" as string | undefined,
    } as CreateGCashServiceLog,
    validators: {
      onSubmit: gCashServiceLogSchema,
    },
    onSubmit: async ({ value }) => {
      await createGCashServiceLogTransactionAsync(value, {
        onSuccess: () => {
          form.reset();
          toast.custom(() => (
            <Alert className="w-lg border-none bg-green-600 font-sans text-white dark:bg-green-400">
              <CheckIcon />
              <AlertTitle>
                GCash transaction has been logged successfully.
              </AlertTitle>
            </Alert>
          ));
        },
      });
    },
  });

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button>GCash</Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>GCash</p>
        </TooltipContent>
      </Tooltip>

      <form
        id="gcash-log-transaction-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent className="md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>GCash Service Transaction</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="serviceType">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Service Type</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as GCashTransactionType)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Service type" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Transaction Type</SelectLabel>
                          {(
                            ["CASH_IN", "CASH_OUT"] as GCashTransactionType[]
                          ).map((type) => {
                            return (
                              <SelectItem key={type} value={type}>
                                {type.replace("_", " ")}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

            <form.Field name="representativeName">
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

            <form.Field name="representativePhone">
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

            <form.Field name="amount">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="amount">Amount</Label>
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
              form="gcash-log-transaction-form"
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
