import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  customerQueries,
  useSearchCustomer,
} from "@/features/customers/queries/use-customer";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/customers/")({
  head: () => ({
    meta: [
      {
        title: "Customers - JenVentory",
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(customerQueries.list());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const { data: customers } = useGetCustomers();
  const { data: searchResults, isLoading: isSearching } =
    useSearchCustomer(searchQuery);

  const customerSearchResult = searchResults?.data || [];

  return (
    <div>
      <Field className="max-w-sm">
        <Command shouldFilter={false}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroup>
                <InputGroupInput
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpen(e.target.value.length >= 3);
                  }}
                />
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </PopoverTrigger>
            <PopoverContent
              className="-mt-1 w-[--radix-popover-trigger-width] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <CommandList className="w-full min-w-(--radix-popover-trigger-width) p-0">
                {isSearching && (
                  <div className="py-6 text-center text-sm">
                    <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                  </div>
                )}
                {!isSearching && customerSearchResult.length === 0 && (
                  <CommandEmpty>No customer found.</CommandEmpty>
                )}
                {!isSearching && customerSearchResult.length > 0 && (
                  <CommandGroup>
                    {customerSearchResult.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={(value) => {
                          setSearchQuery(value);
                          setOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.name}</span>
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </PopoverContent>
          </Popover>
        </Command>
      </Field>
      <pre className="mt-5">
        {JSON.stringify(customerSearchResult, null, 2)}
      </pre>
    </div>
  );
}
