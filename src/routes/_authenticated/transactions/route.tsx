import { PageHeader } from "@/components/page-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Record daily sales, update inventory levels, and stay on top of customer 'utang' and payments."
      />
      <Outlet />
    </div>
  );
}
