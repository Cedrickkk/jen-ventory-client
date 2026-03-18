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
import { Check, LoaderCircle, Trash2, UserIcon } from "lucide-react";
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
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserIcon />
              <span className="max-w-36 truncate">
                {selectedCustomer ? selectedCustomer.name : "Walk-in"}
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
                        <span className="font-medium">{customer.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCustomer && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={clearCustomer}
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
