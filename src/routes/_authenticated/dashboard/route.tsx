import { PageHeader } from "@/components/page-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Track daily sales, monitor remaining stock levels, and manage customer 'utang' balances in one place."
      />
      <Outlet />
    </div>
  );
}
