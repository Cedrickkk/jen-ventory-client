import { PageHeader } from "@/components/page-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/items")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your products, update prices, and check which items need restock from your suppliers."
      />
      <Outlet />
    </div>
  );
}
