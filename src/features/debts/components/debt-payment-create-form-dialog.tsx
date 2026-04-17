import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetCustomerDebtSummary,
  useRecordDebtPayment,
  useSearchCustomer,
} from "@/features/customers/queries/use-customer";
import type { Customer } from "@/features/customers/schema/customer";
import CustomerInformation from "@/features/pos/components/customer/customer-information";
import {
  debtPaymentSchema,
  type CreateDebtPayment,
  type DebtPaymentMethod,
} from "@/features/transactions/schema/debt";
import type { PaymentMethod } from "@/features/transactions/schema/transaction";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import {
  Check,
  CheckIcon,
  LoaderCircle,
  PhilippinePeso,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { v7 as uuidV7 } from "uuid";

type DebtPaymentMethodWithId = DebtPaymentMethod & { id: string };

export default function DebtPaymentCreateFormDialog() {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const {
    mutateAsync: recordDebtPaymentAsync,
    isPending,
    error,
  } = useRecordDebtPayment();

  const { data: searchResult, isFetching: isSearchFetching } =
    useSearchCustomer(searchQuery.toLowerCase());
  const customersResult = searchResult?.data;

  const { data: debtSummary } = useGetCustomerDebtSummary(
    selectedCustomer?.id ?? null,
  );
  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const form = useForm({
    defaultValues: {
      customerId: selectedCustomer?.id,
      payments: [] as DebtPaymentMethod[],
      notes: "",
    } as CreateDebtPayment,
    validators: {
      onSubmit: debtPaymentSchema,
      onBlur: debtPaymentSchema,
    },
    onSubmit: async ({ value }) => {
      if (!selectedCustomer) {
        return;
      }
      const paymentsWithIds = value.payments as DebtPaymentMethodWithId[];
      const sanitizedPayments = paymentsWithIds.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ id, ...payment }) => payment,
      );
      await recordDebtPaymentAsync(
        {
          customerId: selectedCustomer.id,
          payments: {
            ...value,
            payments: sanitizedPayments,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            toast.custom(() => (
              <Alert className="w-lg border-none bg-green-600 font-sans text-white dark:bg-green-400">
                <CheckIcon />
                <AlertTitle>
                  Payment transaction has been logged successfully.
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
            <Button>Payment</Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Payment</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Magbayad ng Utang</DialogTitle>
          <DialogDescription className="sr-only">
            Payment transacion
          </DialogDescription>
        </DialogHeader>
        <form
          id="debt-payment-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="customerId">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Customer</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 py-5"
                        >
                          <span>
                            {selectedCustomer
                              ? selectedCustomer.name
                              : "Pumili ng customer"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="end"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search customer..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="w-96"
                          />
                          <CommandList className="w-full min-w-(--radix-popover-trigger-width) p-0">
                            {isSearchFetching && (
                              <div className="py-6 text-center">
                                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                              </div>
                            )}
                            {!isSearchFetching && searchQuery.length < 2 && (
                              <CommandEmpty>Type to search...</CommandEmpty>
                            )}
                            {!isSearchFetching &&
                              searchQuery.length >= 2 &&
                              customersResult?.length === 0 && (
                                <CommandEmpty>No customer found.</CommandEmpty>
                              )}
                            {!isSearchFetching &&
                              (customersResult?.length ?? 0) > 0 && (
                                <CommandGroup>
                                  {customersResult?.map((customer) => (
                                    <CommandItem
                                      key={customer.id}
                                      value={String(customer.id)}
                                      onSelect={() => {
                                        setSelectedCustomer(customer);
                                        form.setFieldValue(
                                          "customerId",
                                          customer.id,
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "h-4 w-4",
                                          selectedCustomer?.id === customer.id
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      <span className="font-medium">
                                        {customer.name}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

            {selectedCustomer && (
              <CustomerInformation customer={selectedCustomer} />
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Payment Method</Label>
                <ToggleGroup
                  type="single"
                  value={method}
                  onValueChange={(value) => {
                    if (value) setMethod(value as PaymentMethod);
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

              <form.Field name="payments" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="name">Payments</Label>
                        <InputGroup>
                          <InputGroupInput
                            id="payment-amount"
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                            value={amount}
                            className="pl-7"
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              const nextAmount = Number(nextValue);
                              const nextValid =
                                Number.isFinite(nextAmount) && nextAmount > 0;

                              setAmount(nextValue);

                              if (amountError && nextValid) {
                                setAmountError(null);
                              }
                            }}
                            onBlur={() => {
                              if (!isAmountValid) {
                                setAmountError("Amount must be greater than 0");
                                return;
                              }
                              setAmountError(null);
                            }}
                          />
                          <InputGroupAddon align="inline-start">
                            <PhilippinePeso className="text-muted-foreground" />
                          </InputGroupAddon>
                        </InputGroup>

                        <Button
                          type="button"
                          onClick={() => {
                            if (!isAmountValid) {
                              setAmountError("Amount must be greater than 0");
                              return;
                            }
                            setAmountError(null);
                            const payment: DebtPaymentMethodWithId = {
                              id: uuidV7(),
                              amount: parsedAmount,
                              method,
                            };
                            field.pushValue(payment);
                            setAmount("");
                          }}
                          className="shrink-0"
                          disabled={
                            !debtSummary?.data?.netDebt ||
                            Math.abs(debtSummary.data.netDebt) <= 0
                          }
                        >
                          Add
                        </Button>
                      </div>
                      {isInvalid && (
                        <FieldError
                          className="text-xs"
                          errors={field.state.meta.errors}
                        />
                      )}
                      <div>
                        {amountError && (
                          <FieldError
                            className="text-xs"
                            errors={[{ message: amountError }]}
                          />
                        )}
                        {(field.state.value as DebtPaymentMethodWithId[]).map(
                          (payment) => {
                            return (
                              <div
                                key={payment.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {payment.method}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span>
                                    {formatCurrency(String(payment.amount))}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={() => {
                                      const paymentIndex = (
                                        field.state
                                          .value as DebtPaymentMethodWithId[]
                                      ).findIndex(
                                        (entry) => entry.id === payment.id,
                                      );

                                      if (paymentIndex >= 0) {
                                        field.removeValue(paymentIndex);
                                      }
                                    }}
                                  >
                                    <Trash2 className="text-destructive size-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          },
                        )}
                        {error && (
                          <FieldError
                            className="text-xs"
                            errors={[{ message: error?.message }]}
                          />
                        )}
                      </div>
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              type="submit"
              form="debt-payment-form"
              className="cursor-pointer"
              disabled={!selectedCustomer}
            >
              {isPending && (
                <div className="py-6 text-center text-sm">
                  <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                </div>
              )}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
