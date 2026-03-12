import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerDebtHistoryTabContent from "@/features/customers/components/tabs/customer-debt-history-tab-content";
import CustomerTransactionsTabContent from "@/features/customers/components/tabs/customer-transactions-tab-content";
import { useGetCustomerById } from "@/features/customers/queries/use-customer";
import StatisticsCard from "@/features/dashboard/components/statistics-card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/_authenticated/customers/$customerId")({
  component: RouteComponent,
});

const tabs = [
  {
    name: "Transactions",
    value: "transactions",
  },
  {
    name: "Debt History",
    value: "debt_history",
  },
  {
    name: "GCash",
    value: "gcash",
  },
];

function RouteComponent() {
  const { customerId } = Route.useParams();
  const { data: customer } = useGetCustomerById(Number(customerId));
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("transactions"),
  );

  return (
    <div className="mt-9 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild size="icon-lg">
          <Link to="/customers">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex flex-col justify-start">
          <p className="text-muted-foreground text-sm">Back to customers</p>
          <p className="text-2xl font-medium">{customer?.data?.name}</p>
        </div>
      </div>
      <div className="flex flex-col items-stretch lg:flex-row lg:gap-4">
        <StatisticsCard
          title="Total Spent"
          value="₱3,500.00"
          subtitle="Lorem ipsum dolor sit amet consectetur."
          className="flex-1 border-none shadow-none"
        />

        <Separator orientation="vertical" className="h-auto!" />
        <StatisticsCard
          title="Total Debts"
          value="₱0"
          subtitle="Lorem ipsum dolor sit amet consectetur."
          className="flex-1 border-none shadow-none"
        />
        <Separator orientation="vertical" className="h-auto!" />
        <StatisticsCard
          title="Total Transactions"
          value="34"
          subtitle="Lorem ipsum dolor sit amet consectetur."
          className="flex-1 border-none shadow-none"
        />
        <Separator orientation="vertical" className="h-auto!" />
        <StatisticsCard
          title="Store Credits"
          value="₱340.00"
          subtitle="Lorem ipsum dolor sit amet consectetur."
          className="flex-1 border-none shadow-none"
        />
      </div>
      <Separator orientation="horizontal" />
      <div className="grid gap-3 p-4 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-6">
          <FieldGroup className="gap-3">
            <FieldSet>
              <FieldLegend>Customer Details</FieldLegend>
              <FieldDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </FieldDescription>
              <FieldGroup className="gap-4">
                <Field
                  orientation="horizontal"
                  className="w-fll justify-between"
                >
                  <FieldLabel>Name</FieldLabel>
                  <FieldDescription>{customer?.data?.name} </FieldDescription>
                </Field>
                <Field
                  orientation="horizontal"
                  className="w-fll justify-between"
                >
                  <FieldLabel>Phone No.</FieldLabel>
                  <FieldDescription>{customer?.data?.phone} </FieldDescription>
                </Field>
                <Field
                  orientation="horizontal"
                  className="w-fll justify-between"
                >
                  <FieldLabel>Address</FieldLabel>
                  <FieldDescription>{customer?.data?.address}</FieldDescription>
                </Field>
                <Field
                  orientation="horizontal"
                  className="w-fll justify-between"
                >
                  <FieldLabel>Status</FieldLabel>
                  <FieldDescription>
                    <Badge>
                      {customer?.data?.active ? "Active" : "Inactive"}
                    </Badge>
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <FieldSeparator />
            </FieldSet>
          </FieldGroup>
          <FieldGroup className="gap-3">
            <FieldSet>
              <FieldLegend>Recent Activities</FieldLegend>
              <FieldDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </FieldDescription>
            </FieldSet>
          </FieldGroup>
        </div>
        <div className="lg:col-span-2">
          <Separator
            orientation="vertical"
            className="inline-block h-auto! w-4 bg-red-500"
          />
          <div className="w-full">
            <Tabs
              defaultValue="transactions"
              className="gap-4"
              value={tab}
              onValueChange={setTab}
            >
              <TabsList className="bg-background">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="transactions">
                <div className="">
                  <CustomerTransactionsTabContent
                    customerId={Number(customerId)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="debt_history">
                <CustomerDebtHistoryTabContent
                  customerId={Number(customerId)}
                />
              </TabsContent>
              <TabsContent value="gcash">gcas</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
