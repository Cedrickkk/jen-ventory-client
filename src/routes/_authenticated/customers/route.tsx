import { PageHeader } from "@/components/page-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/customers")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="View your digital listahan: track regular suki, monitor outstanding utang, and record new payments."
      />
      <Outlet />
    </div>
  );
}
