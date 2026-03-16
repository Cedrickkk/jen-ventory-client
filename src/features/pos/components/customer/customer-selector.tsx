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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchCustomer } from "@/features/customers/queries/use-customer";
import {
  useCustomerActions,
  useSelectedCustomer,
} from "@/features/pos/store/selectors/customer-selector";
import { cn } from "@/lib/utils";
import { Check, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CustomerSelector() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResult, isFetching: isSearchFetching } =
    useSearchCustomer(searchQuery.toLowerCase());
  const customersResult = searchResult?.data;
  const selectedCustomer = useSelectedCustomer();
  const { setCustomer, clearCustomer } = useCustomerActions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
          <Button
            variant="outline"
            className="rounded-none rounded-l-md shadow-none focus-visible:z-10"
            asChild
          >
            <span className="truncate">
              {selectedCustomer ? selectedCustomer.name : "Walk-in"}
            </span>
          </Button>
          {selectedCustomer && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-none rounded-r-md shadow-none focus-visible:z-10"
              onClick={() => clearCustomer()}
            >
              <div>
                <Trash2 className="text-destructive" />
              </div>
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="end"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search customer..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="w-96"
          />
          <CommandList className="w-full min-w-(--radix-popover-trigger-width) p-0">
            {isSearchFetching && (
              <div className="py-6 text-center text-sm">
                <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
              </div>
            )}
            {!isSearchFetching && searchQuery.length < 2 && (
              <CommandEmpty>Search and select customer...</CommandEmpty>
            )}
            {!isSearchFetching &&
              searchQuery.length >= 2 &&
              customersResult?.length === 0 && (
                <CommandEmpty>No customer found.</CommandEmpty>
              )}
            {!isSearchFetching && (customersResult?.length ?? 0) > 0 && (
              <CommandGroup>
                {customersResult?.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={String(customer.id)}
                    onSelect={() => {
                      setCustomer(customer);
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
                    <div className="flex w-full flex-col">
                      <p className="font-medium">{customer?.name}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
